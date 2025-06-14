
// Supabase Edge Function: Consulta valor de mercado de veículo via RapidAPI
import { serve } from "https://deno.land/std@0.202.0/http/server.ts";

// CORS headers obrigatórios para Edge Functions públicas
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Função utilitária para buscar o RapidAPI Key do secret
function getRapidAPIKey() {
  const key = Deno.env.get("RAPIDAPI_KEY");
  if (!key) {
    throw new Error("RapidAPI Key não configurada nas secrets do projeto Supabase.");
  }
  return key;
}

serve(async (req) => {
  // Log para debug no painel Supabase
  console.log("[vehicle-market-value] Edge Function chamada! Método:", req.method);

  // OPTIONS para CORS
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
    const vin = body.vin || body.VIN;
    const mileage = body.mileage || body.miles;
    const period = body.period;

    if (!vin) {
      return new Response(JSON.stringify({ error: "O campo 'vin' é obrigatório no corpo da requisição." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // Monta a URL da API externa
    const search = [`vin=${encodeURIComponent(vin)}`];
    if (mileage) search.push(`mileage=${encodeURIComponent(mileage)}`);
    if (period) search.push(`period=${encodeURIComponent(period)}`);
    const rapidapiUrl = `https://vehicle-market-value.p.rapidapi.com/vmv?${search.join("&")}`;

    // Pega key das secrets
    const RAPIDAPI_KEY = getRapidAPIKey();

    // Chama a API de valor de mercado
    const vmvResp = await fetch(rapidapiUrl, {
      method: "GET",
      headers: {
        "x-rapidapi-host": "vehicle-market-value.p.rapidapi.com",
        "x-rapidapi-key": RAPIDAPI_KEY,
        "Accept": "application/json"
      }
    });

    const data = await vmvResp.json();

    // Logging para debug Supabase
    console.log("[vehicle-market-value] resposta RapidAPI:", JSON.stringify(data));

    // Se resposta não for sucesso, repassar erro apropriado
    if (!vmvResp.ok || (data && data.status !== 'SUCCESS')) {
      return new Response(JSON.stringify({ error: data?.error || "Erro consultando valor de mercado.", details: data }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // Sucesso! Retorna a resposta da API externa
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
