
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Health check endpoint
  if (req.method === 'GET') {
    return new Response(JSON.stringify({ status: 'healthy', service: 'generate-content' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const { transcript } = await req.json();
    
    if (!transcript) {
      throw new Error('No transcript provided');
    }

    console.log('Generating content from transcript...');

    const prompt = `
You are an expert content creator specializing in podcast repurposing. Based on the following podcast transcript, create the following content:

1. Show Notes Summary (comprehensive overview with key takeaways and timestamps if available)
2. 5 Twitter/X posts (engaging, under 280 characters each, include relevant hashtags)
3. 3 LinkedIn post ideas (professional tone, longer form, include hooks)
4. 10 Instagram Reel hooks (short, catchy, scroll-stopping phrases)

Please format your response as valid JSON with the following structure:
{
  "showNotes": {
    "title": "Episode title/topic",
    "content": "Detailed show notes with key points, takeaways, and any timestamps"
  },
  "tweets": ["tweet1", "tweet2", "tweet3", "tweet4", "tweet5"],
  "linkedinPosts": [
    {
      "hook": "Opening hook/question",
      "content": "Full LinkedIn post content"
    }
  ],
  "instagramHooks": ["hook1", "hook2", ...]
}

Transcript:
${transcript}
`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'You are an expert content creator. Always respond with valid JSON format as requested.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 4000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', errorText);
      throw new Error(`OpenAI API error: ${errorText}`);
    }

    const openAIResult = await response.json();
    const generatedContent = openAIResult.choices[0].message.content;

    console.log('Content generation completed');

    // Parse the JSON response from GPT-4o
    let parsedContent;
    try {
      parsedContent = JSON.parse(generatedContent);
    } catch (parseError) {
      console.error('Failed to parse GPT-4o response as JSON:', parseError);
      throw new Error('Invalid JSON response from content generation');
    }

    return new Response(JSON.stringify({
      status: 'success',
      content: parsedContent
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-content function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      status: 'error' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
