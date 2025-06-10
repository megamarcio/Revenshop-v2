import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { vehicleData, imageSize = '1024x1024' } = await req.json();
    console.log('Generating image for vehicle:', vehicleData, 'with size:', imageSize);

    // Buscar as configurações de IA do banco de dados incluindo a chave OpenAI
    const { data: aiSettings, error: settingsError } = await supabase
      .rpc('get_ai_settings');

    if (settingsError) {
      console.error('Error fetching AI settings:', settingsError);
      throw new Error('Erro ao buscar configurações de IA');
    }

    if (!aiSettings || aiSettings.length === 0) {
      throw new Error('Configurações de IA não encontradas');
    }

    const settings = aiSettings[0];
    const openAIApiKey = settings.openai_key;

    if (!openAIApiKey) {
      throw new Error('Chave da OpenAI não configurada. Configure a chave no painel de administração.');
    }

    let instructions = settings.image_instructions || '';

    // Instruções padrão caso não estejam configuradas
    if (!instructions) {
      instructions = `Criar uma imagem realista e profissional de um veículo baseado nas seguintes especificações:
- Modelo: [MODELO]
- Ano: [ANO] 
- Cor: [COR]
- Estilo: Foto profissional em showroom ou ambiente neutro
- Qualidade: Alta resolução, bem iluminado
- Perspectiva: Vista lateral/frontal que destaque as características do veículo`;
    }

    // Substituir variáveis nas instruções
    let finalPrompt = instructions
      .replace(/\[MODELO\]/g, `${vehicleData.marca} ${vehicleData.modelo}`)
      .replace(/\[ANO\]/g, vehicleData.ano || '')
      .replace(/\[COR\]/g, vehicleData.cor || 'cor padrão');

    console.log('Sending prompt to OpenAI for image generation:', finalPrompt);

    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt: finalPrompt,
        n: 1,
        size: imageSize,
        quality: 'standard',
        style: 'natural'
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`OpenAI API error: ${response.status} - ${errorText}`);
      throw new Error(`Erro da API OpenAI: ${response.status}`);
    }

    const data = await response.json();
    const imageUrl = data.data[0].url;

    console.log('Generated image URL:', imageUrl);

    return new Response(JSON.stringify({ imageUrl }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-image function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
