
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { prompt, vehicleData, model } = await req.json();

    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY')
    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY not configured');
    }

    console.log('Generating image with prompt:', prompt);
    console.log('Vehicle data:', vehicleData);
    console.log('Model:', model);

    let imageResponse;
    let imageData;
    
    // **Novo: usar sempre o modelo enviado, padrão 'gpt-image-1'**
    const chosenModel = model || 'gpt-image-1';

    // Tenta o modelo escolhido, mostra erro se falhar (sem fallback)
    imageResponse = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: chosenModel,
        prompt: prompt,
        n: 1,
        size: '1024x1024',
        quality: chosenModel === 'dall-e-3' ? 'hd' : 'high',
        output_format: chosenModel === 'gpt-image-1' ? 'webp' : undefined
      }),
    });

    if (!imageResponse.ok) {
      const errorData = await imageResponse.text();
      console.error('OpenAI API error:', imageResponse.status, errorData);
      throw new Error(`OpenAI API error (${chosenModel}): ${imageResponse.statusText}`);
    }

    imageData = await imageResponse.json();
    console.log('OpenAI response received successfully');
    
    if (!imageData.data || imageData.data.length === 0) {
      throw new Error('No image generated');
    }

    let imageBuffer;
    if (imageData.data[0].b64_json) {
      const imageBase64 = imageData.data[0].b64_json;
      imageBuffer = Uint8Array.from(atob(imageBase64), c => c.charCodeAt(0));
    } else if (imageData.data[0].url) {
      const imageUrl = imageData.data[0].url;
      const imgResp = await fetch(imageUrl);
      if (!imgResp.ok) throw new Error('Failed to fetch generated image');
      const arrayBuffer = await imgResp.arrayBuffer();
      imageBuffer = new Uint8Array(arrayBuffer);
    } else {
      throw new Error('Unexpected image response format');
    }
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const fileName = `card-generated-${Date.now()}.webp`
    const filePath = `vehicle-cards/${fileName}`

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('vehicles-photos-new')
      .upload(filePath, imageBuffer, {
        contentType: 'image/webp'
      });

    if (uploadError) {
      console.error('Storage upload error:', uploadError)
      throw uploadError
    }

    const { data: { publicUrl } } = supabase.storage
      .from('vehicles-photos-new')
      .getPublicUrl(filePath)

    console.log('Image generated and uploaded:', publicUrl)

    return new Response(
      JSON.stringify({ 
        imageUrl: publicUrl,
        prompt_used: prompt
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    )

  } catch (error) {
    console.error('Error in generate-image function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
});
