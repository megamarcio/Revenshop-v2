
/**
 * Edge Function para consultar o valor de mercado de veículos pela RapidAPI;
 * Usa a chave salva em ai_settings (coluna rapidapi_key).
 */
import { serve } from 'std/server';
import { createClient } from '@supabase/supabase-js';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Config Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseKey);

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { vin } = await req.json();
    if (!vin || typeof vin !== 'string') {
      return new Response(JSON.stringify({ error: 'VIN inválido' }), { status: 400, headers: corsHeaders });
    }

    // Busca a rapidapi_key do banco
    const { data, error } = await supabase.rpc('get_ai_settings');
    const rapidapi_key = data?.[0]?.rapidapi_key;

    if (!rapidapi_key) {
      return new Response(JSON.stringify({ error: 'RapidAPI key não configurada.' }), { status: 500, headers: corsHeaders });
    }

    // Consulta na API (VEHICLE-MARKET-VALUE, exemplo: "us-market-value-by-vin" endpoint da RapidAPI)
    const url = `https://us-market-value-by-vin.p.rapidapi.com/value?vin=${encodeURIComponent(vin)}`;
    const rapidResp = await fetch(url, {
      headers: {
        'X-RapidAPI-Key': rapidapi_key,
        'X-RapidAPI-Host': 'us-market-value-by-vin.p.rapidapi.com',
        'Accept': 'application/json',
      }
    });

    if (!rapidResp.ok) {
      const errJson = await rapidResp.json().catch(() => ({ message: rapidResp.statusText }));
      return new Response(JSON.stringify({ error: errJson.message || rapidResp.statusText }), { status: rapidResp.status, headers: corsHeaders });
    }

    const result = await rapidResp.json();
    return new Response(JSON.stringify({ success: true, data: result }), { headers: corsHeaders });

  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || 'Erro desconhecido.' }), { status: 500, headers: corsHeaders });
  }
});
