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
    const requestBody = await req.json()
    const { api_id, endpoint_id, custom_url, custom_method, custom_headers, custom_body } = requestBody

    console.log('Iniciando teste de API:', { api_id, endpoint_id, custom_url, custom_method })
    console.log('Dados recebidos:', requestBody)

    if (!api_id) {
      throw new Error('ID da API é obrigatório')
    }

    // Criar cliente Supabase
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const serviceRole = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY')!
    const supabase = createClient(
      supabaseUrl,
      serviceRole ?? anonKey,
      {
        auth: { persistSession: false }
      }
    ) // Usa service role se disponível (ignora RLS)

    // Buscar dados da API
    const { data: apiData, error: apiError } = await supabase
      .from('external_apis')
      .select('*')
      .eq('id', api_id)
      .single()

    if (apiError) {
      console.error('Erro ao buscar API:', apiError)
      throw new Error(`Erro ao buscar API: ${apiError.message}`)
    }

    if (!apiData) {
      throw new Error('API não encontrada')
    }

    console.log('API encontrada:', apiData.name, apiData.base_url)

    // Construir URL final
    let finalUrl = ''
    
    if (custom_url) {
      // Se há URL customizada, usar ela diretamente
      finalUrl = custom_url
      console.log('Usando URL customizada:', finalUrl)
    } else if (endpoint_id) {
      // Se há endpoint selecionado, buscar e construir URL
      console.log('Buscando endpoint:', endpoint_id)
      const { data: endpointData, error: endpointError } = await supabase
        .from('external_api_endpoints')
        .select('*')
        .eq('id', endpoint_id)
        .single()
      
      if (endpointError) {
        console.error('Erro ao buscar endpoint:', endpointError)
        throw new Error(`Erro ao buscar endpoint: ${endpointError.message}`)
      }
      
      if (endpointData) {
        // Construir URL combinando base_url + path do endpoint
        const baseUrl = apiData.base_url.endsWith('/') ? apiData.base_url.slice(0, -1) : apiData.base_url
        const path = endpointData.path.startsWith('/') ? endpointData.path : '/' + endpointData.path
        finalUrl = baseUrl + path
        console.log('URL construída com endpoint:', finalUrl)
      } else {
        throw new Error('Endpoint não encontrado')
      }
    } else {
      // Se não há endpoint nem URL customizada, usar apenas a base_url
      finalUrl = apiData.base_url
      console.log('Usando URL base:', finalUrl)
    }

    if (!finalUrl) {
      throw new Error('URL final não pôde ser determinada')
    }

    console.log('URL final para teste:', finalUrl)

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