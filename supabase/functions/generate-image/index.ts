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
    
    const chosenModel = model || 'gpt-image-1';

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

    // :: MELHORIA DE LOG ::
    if (!imageResponse.ok) {
      const errorContentType = imageResponse.headers.get('content-type');
      let errorData: any;
      let errorRaw: string | undefined = undefined;

      if (errorContentType && errorContentType.includes('application/json')) {
        try {
          errorData = await imageResponse.json();
        } catch (jsonErr) {
          errorRaw = await imageResponse.text();
        }
      } else {
        errorRaw = await imageResponse.text();
      }

      console.error(
        '[OpenAI API ERROR]',
        '\nModel:', chosenModel,
        '\nStatus:', imageResponse.status,
        imageResponse.statusText,
        '\nHeaders:', JSON.stringify([...imageResponse.headers], null, 2),
        '\nBody:', errorData ? JSON.stringify(errorData, null, 2) : errorRaw
      );

      // Mensagem especial para GPT-Image-1 não verificado
      const errorStr = errorData
        ? JSON.stringify(errorData)
        : errorRaw || '';

      if (
        chosenModel === 'gpt-image-1' &&
        imageResponse.status === 403 &&
        errorStr.includes('Your organization must be verified')
      ) {
        return new Response(
          JSON.stringify({
            error: "Sua organização OpenAI precisa ser verificada para usar o modelo GPT-Image-1. Verifique em https://platform.openai.com/settings/organization/general"
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 403
          }
        )
      }

      // Devolve resposta mais detalhada para o frontend
      return new Response(
        JSON.stringify({
          error: `OpenAI API error (${chosenModel}): Status ${imageResponse.status} ${imageResponse.statusText}`,
          openai_response: errorData || errorRaw || null
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: imageResponse.status
        }
      );
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
