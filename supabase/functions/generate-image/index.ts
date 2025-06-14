
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { prompt, vehicleData } = await req.json()

    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY')
    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY not configured')
    }

    console.log('Generating image with prompt:', prompt)
    console.log('Vehicle data:', vehicleData)

    // Try gpt-image-1 first, fallback to dall-e-3 if organization not verified
    let imageResponse;
    let imageData;
    
    try {
      // Try gpt-image-1 first
      imageResponse = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-image-1',
          prompt: prompt,
          n: 1,
          size: '1024x1024',
          quality: 'high',
          output_format: 'webp'
        }),
      })

      if (!imageResponse.ok) {
        const errorData = await imageResponse.json()
        console.log('gpt-image-1 failed, trying dall-e-3:', errorData)
        
        // Fallback to dall-e-3
        imageResponse = await fetch('https://api.openai.com/v1/images/generations', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'dall-e-3',
            prompt: prompt,
            n: 1,
            size: '1024x1024',
            quality: 'hd'
          }),
        })
      }

      if (!imageResponse.ok) {
        const errorData = await imageResponse.text()
        console.error('OpenAI API error:', imageResponse.status, errorData)
        throw new Error(`OpenAI API error: ${imageResponse.statusText}`)
      }

      imageData = await imageResponse.json()
      console.log('OpenAI response received successfully')
      
    } catch (error) {
      console.error('Error generating image:', error)
      throw error
    }
    
    if (!imageData.data || imageData.data.length === 0) {
      throw new Error('No image generated')
    }

    let imageBuffer;
    
    // Handle different response formats
    if (imageData.data[0].b64_json) {
      // gpt-image-1 returns base64
      const imageBase64 = imageData.data[0].b64_json
      imageBuffer = Uint8Array.from(atob(imageBase64), c => c.charCodeAt(0))
    } else if (imageData.data[0].url) {
      // dall-e-3 returns URL - need to fetch the image
      const imageUrl = imageData.data[0].url
      const imageResponse = await fetch(imageUrl)
      if (!imageResponse.ok) {
        throw new Error('Failed to fetch generated image')
      }
      const arrayBuffer = await imageResponse.arrayBuffer()
      imageBuffer = new Uint8Array(arrayBuffer)
    } else {
      throw new Error('Unexpected image response format')
    }
    
    // Upload to Supabase Storage
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    
    const fileName = `card-generated-${Date.now()}.webp`
    const filePath = `vehicle-cards/${fileName}`
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('vehicles-photos-new')
      .upload(filePath, imageBuffer, {
        contentType: 'image/webp'
      })

    if (uploadError) {
      console.error('Storage upload error:', uploadError)
      throw uploadError
    }

    // Get public URL
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
})
