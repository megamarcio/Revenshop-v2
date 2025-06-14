
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

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
    const { prompt, vehicleData, vehicleId } = await req.json()

    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY')
    if (!GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY not configured')
    }

    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('Supabase configuration missing')
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

    console.log('Generating video with Gemini Veo3:', prompt)

    // Por enquanto, simulamos a geração de vídeo
    // Em uma implementação real, aqui você faria a chamada para a API do Gemini Veo3
    
    // Simular um delay de processamento
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // URL simulada de vídeo gerado (em produção seria retornada pela API do Gemini)
    const simulatedVideoUrl = `https://example.com/generated-video-${Date.now()}.mp4`
    
    // Salvar o vídeo no banco de dados
    if (vehicleId) {
      const { data: videoData, error: dbError } = await supabase
        .from('vehicle_videos')
        .insert({
          vehicle_id: vehicleId,
          video_url: simulatedVideoUrl,
          prompt_used: prompt,
          file_name: `generated-video-${Date.now()}.mp4`,
          is_main: false
        })
        .select()
        .single()

      if (dbError) {
        console.error('Database error:', dbError)
        throw new Error(`Failed to save video: ${dbError.message}`)
      }

      console.log('Video saved to database:', videoData)

      return new Response(
        JSON.stringify({ 
          success: true,
          message: 'Vídeo gerado e salvo com sucesso!',
          video_url: simulatedVideoUrl,
          video_data: videoData
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200
        }
      )
    }

    // Implementação futura com Gemini Veo3 real
    return new Response(
      JSON.stringify({ 
        message: 'Geração de vídeo iniciada. Em breve estará disponível na lista de vídeos.',
        prompt_used: prompt,
        vehicle_data: vehicleData
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    )

  } catch (error) {
    console.error('Error in generate-video-gemini function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})
