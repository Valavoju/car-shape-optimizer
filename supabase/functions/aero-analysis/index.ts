import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { fileName } = await req.json();
    console.log('Aerodynamic analysis request received for:', fileName);

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    const prompt = `You are an expert aerodynamics engineer analyzing a 3D car model file named "${fileName}". 
    
Provide a detailed aerodynamic analysis with:
1. Estimated drag coefficient (Cd) - provide a realistic value between 0.25 and 0.35
2. Brief analysis of aerodynamic characteristics
3. Three specific improvement suggestions with estimated Cd reduction for each

Format your response EXACTLY as follows:
DRAG_COEFFICIENT: [number]
ANALYSIS: [brief analysis text]
IMPROVEMENTS:
1. [improvement title] | [description] | [estimated Cd reduction]
2. [improvement title] | [description] | [estimated Cd reduction]
3. [improvement title] | [description] | [estimated Cd reduction]`;

    const response = await fetch(
      'https://ai.gateway.lovable.dev/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${LOVABLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'google/gemini-2.5-flash',
          messages: [
            {
              role: "system",
              content: "You are an expert aerodynamics engineer specializing in automotive design and CFD analysis."
            },
            {
              role: "user",
              content: prompt
            }
          ],
          max_tokens: 1024,
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        console.error('Rate limit exceeded');
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again in a moment.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        console.error('Payment required');
        return new Response(
          JSON.stringify({ error: 'AI credits exhausted. Please add credits to continue.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      const errorText = await response.text();
      console.error('Lovable AI error:', response.status, errorText);
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Lovable AI response received');

    const analysisText = data.choices?.[0]?.message?.content || 
      "I apologize, but I couldn't generate an analysis. Please try again.";

    return new Response(
      JSON.stringify({ analysis: analysisText }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in aero-analysis function:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
