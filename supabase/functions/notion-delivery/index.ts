import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

// Types for Notion integration
interface NotionDeliveryRequest {
  contentId: string;
  databaseId?: string;
  templateType?: 'episode' | 'content_suite' | 'social_media';
  customProperties?: Record<string, any>;
}

interface NotionDeliveryResponse {
  status: 'success' | 'error' | 'unauthorized' | 'not_connected';
  notionPageId?: string;
  notionUrl?: string;
  error?: string;
  message?: string;
}

interface NotionConnection {
  accessToken: string;
  workspaceId: string;
  workspaceName: string;
  botId: string;
}

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
};

// Initialize Supabase client
const supabaseClient = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

// Notion API base URL
const NOTION_API_BASE = 'https://api.notion.com/v1';
const NOTION_VERSION = '2022-06-28';

// Utility function to get user's Notion connection
async function getNotionConnection(userId: string): Promise<NotionConnection | null> {
  const { data, error } = await supabaseClient
    .from('profiles')
    .select('preferences')
    .eq('id', userId)
    .single();

  if (error || !data) {
    console.error('Error getting user profile:', error);
    return null;
  }

  const notionConnection = data.preferences?.notion_connection;
  if (!notionConnection?.access_token) {
    return null;
  }

  return {
    accessToken: notionConnection.access_token,
    workspaceId: notionConnection.workspace_id,
    workspaceName: notionConnection.workspace_name,
    botId: notionConnection.bot_id,
  };
}

// Utility function to get generated content
async function getGeneratedContent(contentId: string, userId: string) {
  const { data, error } = await supabaseClient
    .from('generated_content')
    .select(`
      *,
      processing_jobs!inner(
        upload_id,
        audio_uploads!inner(
          user_id,
          filename,
          original_filename
        )
      )
    `)
    .eq('id', contentId)
    .eq('processing_jobs.audio_uploads.user_id', userId)
    .single();

  if (error) {
    console.error('Error getting generated content:', error);
    return null;
  }

  return data;
}

// Utility function to make Notion API requests
async function notionApiRequest(
  endpoint: string,
  method: string,
  accessToken: string,
  body?: any
): Promise<any> {
  const response = await fetch(`${NOTION_API_BASE}${endpoint}`, {
    method,
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      'Notion-Version': NOTION_VERSION,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Notion API error: ${response.status} ${errorText}`);
  }

  return await response.json();
}

// Create a new Notion database for podcast content
async function createPodcastDatabase(accessToken: string, parentPageId?: string): Promise<string> {
  const databaseProperties = {
    "Episode Title": {
      title: {}
    },
    "Status": {
      select: {
        options: [
          { name: "Processing", color: "orange" },
          { name: "Ready", color: "green" },
          { name: "Published", color: "blue" },
          { name: "Archived", color: "gray" }
        ]
      }
    },
    "Upload Date": {
      date: {}
    },
    "Duration": {
      rich_text: {}
    },
    "Content Type": {
      multi_select: {
        options: [
          { name: "Show Notes", color: "purple" },
          { name: "Social Media", color: "pink" },
          { name: "Transcript", color: "yellow" }
        ]
      }
    },
    "Platforms": {
      multi_select: {
        options: [
          { name: "Twitter", color: "blue" },
          { name: "LinkedIn", color: "blue" },
          { name: "Instagram", color: "red" },
          { name: "Blog", color: "green" }
        ]
      }
    }
  };

  const createPayload: any = {
    parent: parentPageId ? { page_id: parentPageId } : { type: "workspace", workspace: true },
    title: [
      {
        type: "text",
        text: { content: "📻 Podcast Content Hub" }
      }
    ],
    properties: databaseProperties
  };

  const result = await notionApiRequest('/databases', 'POST', accessToken, createPayload);
  return result.id;
}

// Create a Notion page with podcast content
async function createNotionPage(
  accessToken: string,
  databaseId: string,
  content: any,
  templateType: string
): Promise<{ pageId: string; url: string }> {
  const contentData = content.content_data;
  const filename = content.processing_jobs.audio_uploads.filename;
  const originalFilename = content.processing_jobs.audio_uploads.original_filename;

  // Prepare page properties
  const pageProperties: any = {
    "Episode Title": {
      title: [
        {
          type: "text",
          text: { content: contentData.title || originalFilename || "Untitled Episode" }
        }
      ]
    },
    "Status": {
      select: { name: "Ready" }
    },
    "Upload Date": {
      date: { start: content.created_at.split('T')[0] }
    },
    "Content Type": {
      multi_select: [
        { name: "Show Notes" },
        { name: "Social Media" },
        { name: "Transcript" }
      ]
    }
  };

  // Prepare page content blocks
  const pageBlocks: any[] = [];

  // Add show notes section
  if (contentData.showNotes) {
    pageBlocks.push(
      {
        type: "heading_1",
        heading_1: {
          rich_text: [{ type: "text", text: { content: "📝 Show Notes" } }]
        }
      },
      {
        type: "paragraph",
        paragraph: {
          rich_text: [{ type: "text", text: { content: contentData.showNotes.content || contentData.showNotes } }]
        }
      }
    );
  }

  // Add social media content
  if (contentData.tweets && contentData.tweets.length > 0) {
    pageBlocks.push({
      type: "heading_2",
      heading_2: {
        rich_text: [{ type: "text", text: { content: "🐦 Twitter Posts" } }]
      }
    });

    contentData.tweets.forEach((tweet: string, index: number) => {
      pageBlocks.push({
        type: "callout",
        callout: {
          icon: { emoji: "🐦" },
          rich_text: [{ type: "text", text: { content: tweet } }]
        }
      });
    });
  }

  // Add LinkedIn content
  if (contentData.linkedinPosts && contentData.linkedinPosts.length > 0) {
    pageBlocks.push({
      type: "heading_2",
      heading_2: {
        rich_text: [{ type: "text", text: { content: "💼 LinkedIn Posts" } }]
      }
    });

    contentData.linkedinPosts.forEach((post: any, index: number) => {
      pageBlocks.push({
        type: "callout",
        callout: {
          icon: { emoji: "💼" },
          rich_text: [{ type: "text", text: { content: typeof post === 'string' ? post : post.content } }]
        }
      });
    });
  }

  // Add Instagram hooks
  if (contentData.instagramHooks && contentData.instagramHooks.length > 0) {
    pageBlocks.push({
      type: "heading_2",
      heading_2: {
        rich_text: [{ type: "text", text: { content: "📱 Instagram Hooks" } }]
      }
    });

    const hooksText = contentData.instagramHooks.join('\n• ');
    pageBlocks.push({
      type: "bulleted_list_item",
      bulleted_list_item: {
        rich_text: [{ type: "text", text: { content: hooksText } }]
      }
    });
  }

  // Add transcript if available
  if (contentData.transcript || contentData.text) {
    pageBlocks.push(
      {
        type: "heading_2",
        heading_2: {
          rich_text: [{ type: "text", text: { content: "📄 Transcript" } }]
        }
      },
      {
        type: "toggle",
        toggle: {
          rich_text: [{ type: "text", text: { content: "Click to expand transcript" } }],
          children: [
            {
              type: "paragraph",
              paragraph: {
                rich_text: [{ type: "text", text: { content: contentData.transcript || contentData.text } }]
              }
            }
          ]
        }
      }
    );
  }

  // Create the page
  const createPagePayload = {
    parent: { database_id: databaseId },
    properties: pageProperties,
    children: pageBlocks
  };

  const result = await notionApiRequest('/pages', 'POST', accessToken, createPagePayload);
  
  return {
    pageId: result.id,
    url: result.url
  };
}

// Track delivery for analytics
async function trackDelivery(userId: string, contentId: string, notionPageId: string): Promise<void> {
  const { error } = await supabaseClient.rpc('track_usage', {
    p_user_id: userId,
    p_action_type: 'export',
    p_resource_id: contentId,
    p_usage_count: 1,
  });

  if (error) {
    console.error('Failed to track delivery:', error);
  }

  // Log activity
  await supabaseClient
    .from('activity_log')
    .insert({
      user_id: userId,
      action: 'notion_delivery',
      resource_type: 'generated_content',
      resource_id: contentId,
      new_values: { notion_page_id: notionPageId },
    });
}

// Validate request and extract user info
async function validateRequest(req: Request): Promise<string | null> {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.replace('Bearer ', '');
  const { data: { user }, error } = await supabaseClient.auth.getUser(token);
  
  if (error || !user) {
    return null;
  }

  return user.id;
}

// Main handler function
serve(async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Health check endpoint
  if (req.method === 'GET') {
    return new Response(JSON.stringify({ 
      status: 'healthy', 
      service: 'notion-delivery',
      version: '1.0.0'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ 
      status: 'error', 
      error: 'Method not allowed' 
    }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    // Validate authentication
    const userId = await validateRequest(req);
    if (!userId) {
      return new Response(JSON.stringify({
        status: 'unauthorized',
        error: 'Authentication required'
      }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Parse request body
    const requestData: NotionDeliveryRequest = await req.json();
    const { contentId, databaseId, templateType = 'content_suite', customProperties } = requestData;

    // Validate required fields
    if (!contentId) {
      return new Response(JSON.stringify({
        status: 'error',
        error: 'Missing required field: contentId'
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get Notion connection
    const notionConnection = await getNotionConnection(userId);
    if (!notionConnection) {
      return new Response(JSON.stringify({
        status: 'not_connected',
        error: 'Notion workspace not connected. Please connect your Notion account first.'
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get content to deliver
    const content = await getGeneratedContent(contentId, userId);
    if (!content) {
      return new Response(JSON.stringify({
        status: 'error',
        error: 'Content not found or access denied'
      }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Determine database ID (create one if not provided)
    let targetDatabaseId = databaseId;
    if (!targetDatabaseId) {
      targetDatabaseId = await createPodcastDatabase(notionConnection.accessToken);
    }

    // Create Notion page with content
    const { pageId, url } = await createNotionPage(
      notionConnection.accessToken,
      targetDatabaseId,
      content,
      templateType
    );

    // Track the delivery
    await trackDelivery(userId, contentId, pageId);

    // Return success response
    const response: NotionDeliveryResponse = {
      status: 'success',
      notionPageId: pageId,
      notionUrl: url,
      message: 'Content successfully delivered to Notion workspace'
    };

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Notion delivery error:', error);
    
    // Return error response
    const response: NotionDeliveryResponse = {
      status: 'error',
      error: error.message || 'Internal server error'
    };

    return new Response(JSON.stringify(response), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}); 