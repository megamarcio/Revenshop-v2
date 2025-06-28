import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface TestAPIRequest {
  api_id: string;
  endpoint_id?: string;
  custom_url?: string;
  custom_method?: string;
  custom_headers?: Record<string, any>;
  custom_body?: string;
}

interface APIResponse {
  success: boolean;
  url: string;
  method: string;
  headers: Record<string, any>;
  response_time_ms: number;
  status: number;
  body: string;
  error?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { api_id, endpoint_id, custom_url, custom_method, custom_headers, custom_body } = await req.json()

    console.log('Iniciando teste de API:', { api_id, custom_url, custom_method })

    // Criar cliente Supabase
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!
    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    // Buscar dados da API
    const { data: apiData, error: apiError } = await supabase
      .from('external_apis')
      .select('*')
      .eq('id', api_id)
      .single()

    if (apiError || !apiData) {
      throw new Error('API não encontrada')
    }

    // Construir URL final
    let finalUrl = custom_url || apiData.base_url
    if (endpoint_id) {
      const { data: endpointData } = await supabase
        .from('external_api_endpoints')
        .select('*')
        .eq('id', endpoint_id)
        .single()
      
      if (endpointData) {
        finalUrl = apiData.base_url + endpointData.path
      }
    }

    // Construir headers
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...custom_headers
    }

    // Adicionar autenticação se necessário
    if (apiData.auth_type === 'api_key' && apiData.api_key) {
      headers['X-API-Key'] = apiData.api_key
    } else if (apiData.auth_type === 'bearer' && apiData.api_key) {
      headers['Authorization'] = `Bearer ${apiData.api_key}`
    } else if (apiData.auth_type === 'basic' && apiData.api_key) {
      headers['Authorization'] = `Basic ${apiData.api_key}`
    }

    // Adicionar headers da API
    if (apiData.headers && Array.isArray(apiData.headers)) {
      apiData.headers.forEach((header: any) => {
        if (header.name && header.value) {
          headers[header.name] = header.value
        }
      })
    }

    console.log('Fazendo requisição para:', finalUrl)
    console.log('Método:', custom_method || 'GET')
    console.log('Headers:', headers)

    // Fazer a requisição
    const startTime = Date.now()
    
    const requestOptions: RequestInit = {
      method: custom_method || 'GET',
      headers,
    }

    if (custom_body && ['POST', 'PUT', 'PATCH'].includes(custom_method || 'GET')) {
      requestOptions.body = custom_body
    }

    const response = await fetch(finalUrl, requestOptions)
    const endTime = Date.now()
    const responseTime = endTime - startTime

    const responseBody = await response.text()
    
    console.log('Resposta recebida:', response.status, response.statusText)
    console.log('Tempo de resposta:', responseTime, 'ms')

    // Preparar resultado
    const result = {
      success: response.ok,
      url: finalUrl,
      method: custom_method || 'GET',
      headers: Object.fromEntries(response.headers.entries()),
      response_time_ms: responseTime,
      status: response.status,
      body: responseBody,
      error: response.ok ? undefined : `HTTP ${response.status}: ${response.statusText}`
    }

    // Salvar no histórico
    const { error: historyError } = await supabase
      .from('external_api_test_history')
      .insert({
        api_id,
        endpoint_id: endpoint_id || null,
        request_url: finalUrl,
        request_method: custom_method || 'GET',
        request_headers: headers,
        request_body: custom_body || null,
        response_status: response.status,
        response_headers: Object.fromEntries(response.headers.entries()),
        response_body: responseBody,
        response_time_ms: responseTime,
        is_success: response.ok,
        error_message: response.ok ? null : `HTTP ${response.status}: ${response.statusText}`,
        created_by: null // Seria necessário pegar do JWT, mas por simplicidade deixamos null
      })

    if (historyError) {
      console.error('Erro ao salvar histórico:', historyError)
    }

    return new Response(
      JSON.stringify(result),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )

  } catch (error) {
    console.error('Erro na edge function:', error)
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Erro interno do servidor' 
      }),
      { 
        status: 500, 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )
  }
}) 