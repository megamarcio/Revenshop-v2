
/**
 * Edge Function para consultar o valor de mercado de veículos pela RapidAPI;
 * Usa a chave salva em ai_settings (coluna rapidapi_key).
 * Agora aceita parâmetro "miles" (obrigatório).
 */
import { serve } from "std/server";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabase = createClient(supabaseUrl, supabaseKey);

serve(async (req) => {
  // Log para debug no painel Supabase
  console.log("[vehicle-market-value] Função recebeu requisição:", req.method);

  if (req.method === "OPTIONS") {
    // CORS para browser preflight
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { vin, miles } = await req.json();
    if (!vin || typeof vin !== "string") {
      return new Response(JSON.stringify({ error: "VIN inválido." }), { status: 400, headers: corsHeaders });
    }
    if (!miles || (typeof miles !== "string" && typeof miles !== "number")) {
      return new Response(JSON.stringify({ error: "Milhas (miles) obrigatórias." }), { status: 400, headers: corsHeaders });
    }

    // Busca a rapidapi_key do banco
    const { data, error } = await supabase.rpc("get_ai_settings");
    const rapidapi_key = data?.[0]?.rapidapi_key;

    if (!rapidapi_key) {
      return new Response(JSON.stringify({ error: "RapidAPI key não configurada." }), { status: 500, headers: corsHeaders });
    }

    // Usa o endpoint da RapidAPI e header correto
    const url = `https://vehicle-market-value.p.rapidapi.com/vmv?vin=${encodeURIComponent(vin)}&mileage=${encodeURIComponent(miles)}`;
    const rapidResp = await fetch(url, {
      headers: {
        "X-RapidAPI-Key": rapidapi_key,
        "X-RapidAPI-Host": "vehicle-market-value.p.rapidapi.com",
        "Accept": "application/json",
      },
    });

    if (!rapidResp.ok) {
      const errJson = await rapidResp.json().catch(() => ({ message: rapidResp.statusText }));
      return new Response(JSON.stringify({ error: errJson.message || rapidResp.statusText }), {
        status: rapidResp.status,
        headers: corsHeaders,
      });
    }

    const result = await rapidResp.json();
    return new Response(JSON.stringify({ success: true, data: result }), { headers: corsHeaders });
  } catch (err: any) {
    // Log para debug erro
    console.error("[vehicle-market-value] ERROR:", err?.message || err);
    return new Response(JSON.stringify({ error: err?.message || "Erro desconhecido." }), {
      status: 500,
      headers: corsHeaders,
    });
  }
});
