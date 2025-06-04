import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

// Types for better type safety
interface TranscriptionRequest {
  uploadId: string;
  audioUrl: string;
  userId: string;
  language?: string;
  priority?: number;
}

interface TranscriptionResponse {
  status: 'success' | 'error' | 'rate_limited' | 'quota_exceeded';
  jobId?: string;
  transcript?: string;
  error?: string;
  message?: string;
}

// CORS headers for browser requests
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

// Rate limiting configuration
const RATE_LIMITS = {
  free: { requests: 5, window: 60 * 60 }, // 5 requests per hour
  hobby: { requests: 20, window: 60 * 60 }, // 20 requests per hour  
  pro: { requests: 100, window: 60 * 60 }, // 100 requests per hour
  agency: { requests: 500, window: 60 * 60 }, // 500 requests per hour
};

// Utility function to check rate limits
async function checkRateLimit(userId: string, userTier: string): Promise<boolean> {
  const limit = RATE_LIMITS[userTier as keyof typeof RATE_LIMITS] || RATE_LIMITS.free;
  const windowStart = new Date(Date.now() - (limit.window * 1000));
  
  const { data, error } = await supabaseClient
    .from('usage_tracking')
    .select('usage_count')
    .eq('user_id', userId)
    .eq('action_type', 'transcription')
    .gte('created_at', windowStart.toISOString())
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
    console.error('Error checking rate limit:', error);
    return false;
  }

  const currentUsage = data?.usage_count || 0;
  return currentUsage < limit.requests;
}

// Utility function to check user quota
async function checkUserQuota(userId: string): Promise<boolean> {
  const { data, error } = await supabaseClient
    .from('profiles')
    .select('current_usage, usage_quota, subscription_tier')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error checking user quota:', error);
    return false;
  }

  return data.current_usage < data.usage_quota;
}

// Enhanced transcription with OpenAI Whisper
async function transcribeAudio(audioUrl: string, language: string = 'en'): Promise<string> {
  console.log(`Starting transcription for audio: ${audioUrl}`);
  
  // Download audio file
  const audioResponse = await fetch(audioUrl);
  if (!audioResponse.ok) {
    throw new Error(`Failed to download audio: ${audioResponse.statusText}`);
  }

  const audioBuffer = await audioResponse.arrayBuffer();
  const audioBlob = new Blob([audioBuffer], { type: 'audio/mpeg' });

  // Prepare form data for OpenAI
  const formData = new FormData();
  formData.append('file', audioBlob, 'audio.mp3');
  formData.append('model', 'whisper-1');
  formData.append('language', language);
  formData.append('response_format', 'verbose_json'); // Get timestamps
  formData.append('temperature', '0'); // More deterministic results

  // Call OpenAI Whisper API
  const openAIResponse = await fetch('https://api.openai.com/v1/audio/transcriptions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
    },
    body: formData,
  });

  if (!openAIResponse.ok) {
    const errorText = await openAIResponse.text();
    console.error('OpenAI API error:', errorText);
    throw new Error(`OpenAI API error: ${errorText}`);
  }

  const result = await openAIResponse.json();
  console.log('Transcription completed successfully');
  
  return result;
}

// Create processing job in database
async function createProcessingJob(uploadId: string, priority: number = 5): Promise<string> {
  const { data, error } = await supabaseClient
    .from('processing_jobs')
    .insert({
      upload_id: uploadId,
      job_type: 'transcription',
      status: 'running',
      priority: priority,
      started_at: new Date().toISOString(),
    })
    .select('id')
    .single();

  if (error) {
    throw new Error(`Failed to create processing job: ${error.message}`);
  }

  return data.id;
}

// Update processing job with results
async function updateProcessingJob(
  jobId: string, 
  status: string, 
  result?: any, 
  errorLog?: string
): Promise<void> {
  const updateData: any = {
    status,
    progress: status === 'completed' ? 100 : 0,
    updated_at: new Date().toISOString(),
  };

  if (status === 'completed') {
    updateData.completed_at = new Date().toISOString();
    updateData.result = result;
  }

  if (status === 'failed') {
    updateData.error_log = errorLog;
  }

  const { error } = await supabaseClient
    .from('processing_jobs')
    .update(updateData)
    .eq('id', jobId);

  if (error) {
    console.error('Failed to update processing job:', error);
  }
}

// Store generated content
async function storeGeneratedContent(jobId: string, transcript: any): Promise<void> {
  const { error } = await supabaseClient
    .from('generated_content')
    .insert({
      job_id: jobId,
      content_type: 'transcript',
      content_data: transcript,
      word_count: transcript.text?.split(' ').length || 0,
      character_count: transcript.text?.length || 0,
      quality_score: 0.95, // High score for Whisper transcriptions
    });

  if (error) {
    console.error('Failed to store generated content:', error);
  }
}

// Track usage for billing
async function trackUsage(userId: string, resourceId: string): Promise<void> {
  const { error } = await supabaseClient.rpc('track_usage', {
    p_user_id: userId,
    p_action_type: 'transcription',
    p_resource_id: resourceId,
    p_usage_count: 1,
  });

  if (error) {
    console.error('Failed to track usage:', error);
  }
}

// Validate JWT token and extract user info
async function validateRequest(req: Request): Promise<{ userId: string; userTier: string } | null> {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.replace('Bearer ', '');
  const { data: { user }, error } = await supabaseClient.auth.getUser(token);
  
  if (error || !user) {
    return null;
  }

  // Get user subscription tier
  const { data: profile } = await supabaseClient
    .from('profiles')
    .select('subscription_tier')
    .eq('id', user.id)
    .single();

  return {
    userId: user.id,
    userTier: profile?.subscription_tier || 'free'
  };
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
      service: 'enhanced-transcribe',
      version: '2.0.0'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // Only allow POST requests for transcription
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
    const userInfo = await validateRequest(req);
    if (!userInfo) {
      return new Response(JSON.stringify({
        status: 'error',
        error: 'Unauthorized'
      }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { userId, userTier } = userInfo;

    // Parse request body
    const requestData: TranscriptionRequest = await req.json();
    const { uploadId, audioUrl, language = 'en', priority = 5 } = requestData;

    // Validate required fields
    if (!uploadId || !audioUrl) {
      return new Response(JSON.stringify({
        status: 'error',
        error: 'Missing required fields: uploadId and audioUrl'
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Check rate limits
    const withinRateLimit = await checkRateLimit(userId, userTier);
    if (!withinRateLimit) {
      return new Response(JSON.stringify({
        status: 'rate_limited',
        error: 'Rate limit exceeded. Please upgrade your plan for higher limits.'
      }), {
        status: 429,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Check user quota
    const withinQuota = await checkUserQuota(userId);
    if (!withinQuota) {
      return new Response(JSON.stringify({
        status: 'quota_exceeded',
        error: 'Monthly quota exceeded. Please upgrade your plan or wait for next billing cycle.'
      }), {
        status: 402,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Create processing job
    const jobId = await createProcessingJob(uploadId, priority);

    // Perform transcription
    const transcript = await transcribeAudio(audioUrl, language);

    // Store results
    await Promise.all([
      updateProcessingJob(jobId, 'completed', transcript),
      storeGeneratedContent(jobId, transcript),
      trackUsage(userId, uploadId),
    ]);

    // Return success response
    const response: TranscriptionResponse = {
      status: 'success',
      jobId,
      transcript: transcript.text,
      message: 'Transcription completed successfully'
    };

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Transcription error:', error);
    
    // Return error response
    const response: TranscriptionResponse = {
      status: 'error',
      error: error.message || 'Internal server error'
    };

    return new Response(JSON.stringify(response), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}); 