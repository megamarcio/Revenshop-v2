
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

    const { vehicleData } = await req.json();
    console.log('Generating description for vehicle:', vehicleData);

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

    let instructions = settings.description_instructions || '';

    // Instruções padrão caso não estejam configuradas
    if (!instructions) {
      instructions = `Criar uma descrição atrativa e profissional para um veículo usado/seminovo seguindo este modelo:
- Iniciar com características principais (marca, modelo, ano, motor)
- Destacar pontos fortes e diferenciais
- Mencionar estado de conservação
- Incluir equipamentos e opcionais
- Usar linguagem comercial e persuasiva
- Finalizar com chamada para ação`;
    }

    // Substituir variáveis nas instruções
    let finalInstructions = instructions
      .replace(/\[MODELO\]/g, vehicleData.modelo || '')
      .replace(/\[ANO\]/g, vehicleData.ano || '')
      .replace(/\[COR\]/g, vehicleData.cor || '');

    // Montar prompt completo
    const vehicleInfo = `
Marca: ${vehicleData.marca}
Modelo: ${vehicleData.modelo}
Ano: ${vehicleData.ano}
${vehicleData.cor ? `Cor: ${vehicleData.cor}` : ''}
${vehicleData.motor ? `Motor: ${vehicleData.motor}` : ''}
${vehicleData.quilometragem ? `Quilometragem: ${vehicleData.quilometragem}` : ''}
${vehicleData.equipamentos ? `Equipamentos: ${vehicleData.equipamentos}` : ''}
    `.trim();

    const fullPrompt = `${finalInstructions}

Informações do veículo:
${vehicleInfo}

Gere uma descrição comercial atrativa para este veículo:`;

    console.log('Sending prompt to OpenAI:', fullPrompt);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: 'Você é um especialista em marketing automotivo que cria descrições atrativas para veículos usados.' 
          },
          { role: 'user', content: fullPrompt }
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`OpenAI API error: ${response.status} - ${errorText}`);
      throw new Error(`Erro da API OpenAI: ${response.status}`);
    }

    const data = await response.json();
    const description = data.choices[0].message.content;

    console.log('Generated description:', description);

    return new Response(JSON.stringify({ description }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-description function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
