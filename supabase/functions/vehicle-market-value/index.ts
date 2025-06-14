
// Supabase Edge Function Hello World mínimo
import { serve } from "https://deno.land/std@0.202.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Log para debug no painel Supabase
  console.log("[vehicle-market-value] Edge Function alive! Método:", req.method);

  // Responde sempre com sucesso para debug
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  return new Response(JSON.stringify({ ok: true, msg: "vehicle-market-value function up!" }), {
    status: 200,
    headers: { ...corsHeaders, "Content-Type": "application/json" }
  });
});
