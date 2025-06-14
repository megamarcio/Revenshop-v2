
import { serve } from "https://deno.land/std@0.202.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function getRapidAPIKey() {
  const key = Deno.env.get("RAPIDAPI_KEY");
  if (!key) {
    console.error("[vehicle-market-value] RAPIDAPI_KEY NOT SET in Supabase secrets!");
    throw new Error("RapidAPI Key não configurada nas secrets do projeto Supabase. Acesse /settings/functions e configure RAPIDAPI_KEY.");
  }
  return key;
}

serve(async (req) => {
  console.log("[vehicle-market-value] Edge Function chamada! Método:", req.method);

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Método não suportado. Use POST com o corpo JSON." }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }

  try {
    const body = await req.json();
    const vin = (body.vin || body.VIN || "").toString().trim();
    const mileage = (body.mileage || body.miles || "").toString().trim();
    const period = (body.period || "").toString().trim();

    if (!vin) {
      return new Response(JSON.stringify({ error: "O campo 'vin' é obrigatório no corpo da requisição." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    if (vin.length !== 17) {
      return new Response(JSON.stringify({ error: "O VIN precisa ter 17 caracteres." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const params: string[] = [`vin=${encodeURIComponent(vin)}`];
    if (mileage) params.push(`mileage=${encodeURIComponent(mileage)}`);
    if (period) params.push(`period=${encodeURIComponent(period)}`);
    const rapidapiUrl = `https://vehicle-market-value.p.rapidapi.com/vmv?${params.join("&")}`;

    console.log("[vehicle-market-value] Fetching:", rapidapiUrl);

    let RAPIDAPI_KEY: string;
    try {
      RAPIDAPI_KEY = getRapidAPIKey();
      console.log("[vehicle-market-value] RAPIDAPI_KEY found and will be used (not printing the key itself for security).");
    } catch (err) {
      return new Response(JSON.stringify({ error: "RapidAPI Key não configurada no projeto Supabase.", details: String(err) }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const requestHeaders = {
      "x-rapidapi-host": "vehicle-market-value.p.rapidapi.com",
      "x-rapidapi-key": RAPIDAPI_KEY,
      "Accept": "application/json"
    };

    console.log("[vehicle-market-value] Enviando headers para RapidAPI:", Object.keys(requestHeaders));

    const vmvResp = await fetch(rapidapiUrl, {
      method: "GET",
      headers: requestHeaders
    });

    // Para debug, logar status recebido e parte da resposta
    console.log("[vehicle-market-value] Status recebido da RapidAPI:", vmvResp.status);

    const data = await vmvResp.json();
    console.log("[vehicle-market-value] resposta RapidAPI:", JSON.stringify(data));

    // Validação pelo padrão status === "SUCCESS"
    if (!vmvResp.ok || data?.status !== "SUCCESS") {
      const errorMsg = data?.message || data?.error || "Erro consultando valor de mercado (RapidAPI).";
      return new Response(JSON.stringify({ error: errorMsg, details: data }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });

  } catch (err) {
    console.error("[vehicle-market-value] Erro inesperado:", err);
    return new Response(JSON.stringify({ error: "Erro ao processar requisição.", details: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});
