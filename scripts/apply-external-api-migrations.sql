-- ========================================
-- MIGRAÇÃO COMPLETA: SISTEMA DE APIS EXTERNAS
-- ========================================
-- Este arquivo contém todas as estruturas necessárias para o sistema de APIs externas
-- Execute este script diretamente no SQL Editor do Supabase

-- ========================================
-- 1. FUNÇÃO AUXILIAR PARA ATUALIZAR UPDATED_AT
-- ========================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- ========================================
-- 2. TABELA PRINCIPAL: EXTERNAL_APIS
-- ========================================

CREATE TABLE IF NOT EXISTS external_apis (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  base_url VARCHAR(500) NOT NULL,
  auth_type VARCHAR(50) DEFAULT 'none' CHECK (auth_type IN ('none', 'api_key', 'bearer', 'basic', 'oauth2')),
  auth_config JSONB DEFAULT '{}',
  headers JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  is_mcp_server BOOLEAN DEFAULT false,
  mcp_config JSONB DEFAULT '{}',
  observations TEXT,
  documentation TEXT,
  error_logs JSONB DEFAULT '[]',
  ai_analysis TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id)
);

-- Comentários para documentação
COMMENT ON TABLE external_apis IS 'Tabela principal para armazenar configurações de APIs externas';
COMMENT ON COLUMN external_apis.name IS 'Nome identificador da API';
COMMENT ON COLUMN external_apis.base_url IS 'URL base da API';
COMMENT ON COLUMN external_apis.auth_type IS 'Tipo de autenticação: none, api_key, bearer, basic, oauth2';
COMMENT ON COLUMN external_apis.auth_config IS 'Configurações de autenticação em JSON';
COMMENT ON COLUMN external_apis.headers IS 'Headers customizados em JSON';
COMMENT ON COLUMN external_apis.is_mcp_server IS 'Indica se esta API é um servidor MCP';
COMMENT ON COLUMN external_apis.mcp_config IS 'Configurações específicas do MCP em JSON';
COMMENT ON COLUMN external_apis.observations IS 'Observações e notas sobre a API';
COMMENT ON COLUMN external_apis.documentation IS 'Documentação da API';
COMMENT ON COLUMN external_apis.error_logs IS 'Log de erros em JSON';
COMMENT ON COLUMN external_apis.ai_analysis IS 'Análise de IA dos erros';

-- ========================================
-- 3. TABELA DE ENDPOINTS
-- ========================================

CREATE TABLE IF NOT EXISTS external_api_endpoints (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  api_id UUID NOT NULL REFERENCES external_apis(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  path VARCHAR(500) NOT NULL,
  method VARCHAR(10) DEFAULT 'GET' CHECK (method IN ('GET', 'POST', 'PUT', 'PATCH', 'DELETE')),
  description TEXT,
  parameters JSONB DEFAULT '{}',
  request_body_schema JSONB DEFAULT '{}',
  response_schema JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Comentários para documentação
COMMENT ON TABLE external_api_endpoints IS 'Endpoints específicos de cada API externa';
COMMENT ON COLUMN external_api_endpoints.api_id IS 'Referência para a API pai';
COMMENT ON COLUMN external_api_endpoints.path IS 'Caminho do endpoint (ex: /users/{id})';
COMMENT ON COLUMN external_api_endpoints.method IS 'Método HTTP';
COMMENT ON COLUMN external_api_endpoints.parameters IS 'Parâmetros esperados em JSON';
COMMENT ON COLUMN external_api_endpoints.request_body_schema IS 'Schema do corpo da requisição';
COMMENT ON COLUMN external_api_endpoints.response_schema IS 'Schema esperado da resposta';

-- ========================================
-- 4. TABELA DE HISTÓRICO DE TESTES
-- ========================================

CREATE TABLE IF NOT EXISTS external_api_test_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  api_id UUID NOT NULL REFERENCES external_apis(id) ON DELETE CASCADE,
  endpoint_id UUID REFERENCES external_api_endpoints(id) ON DELETE SET NULL,
  test_url VARCHAR(1000) NOT NULL,
  method VARCHAR(10) NOT NULL,
  request_headers JSONB DEFAULT '{}',
  request_body JSONB,
  response_status INTEGER,
  response_headers JSONB DEFAULT '{}',
  response_body JSONB,
  response_time_ms INTEGER,
  success BOOLEAN DEFAULT false,
  error_message TEXT,
  tested_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  tested_by UUID REFERENCES auth.users(id)
);

-- Comentários para documentação
COMMENT ON TABLE external_api_test_history IS 'Histórico de todos os testes realizados nas APIs';
COMMENT ON COLUMN external_api_test_history.test_url IS 'URL completa testada';
COMMENT ON COLUMN external_api_test_history.response_time_ms IS 'Tempo de resposta em milissegundos';
COMMENT ON COLUMN external_api_test_history.success IS 'Indica se o teste foi bem-sucedido';

-- ========================================
-- 5. ÍNDICES PARA PERFORMANCE
-- ========================================

-- Índices para external_apis
CREATE INDEX IF NOT EXISTS idx_external_apis_active ON external_apis(is_active);
CREATE INDEX IF NOT EXISTS idx_external_apis_mcp ON external_apis(is_mcp_server);
CREATE INDEX IF NOT EXISTS idx_external_apis_auth_type ON external_apis(auth_type);
CREATE INDEX IF NOT EXISTS idx_external_apis_created_by ON external_apis(created_by);
CREATE INDEX IF NOT EXISTS idx_external_apis_name ON external_apis(name);

-- Índices para external_api_endpoints
CREATE INDEX IF NOT EXISTS idx_external_api_endpoints_api_id ON external_api_endpoints(api_id);
CREATE INDEX IF NOT EXISTS idx_external_api_endpoints_active ON external_api_endpoints(is_active);
CREATE INDEX IF NOT EXISTS idx_external_api_endpoints_method ON external_api_endpoints(method);
CREATE INDEX IF NOT EXISTS idx_external_api_endpoints_path ON external_api_endpoints(path);

-- Índices para external_api_test_history
CREATE INDEX IF NOT EXISTS idx_external_api_test_history_api_id ON external_api_test_history(api_id);
CREATE INDEX IF NOT EXISTS idx_external_api_test_history_endpoint_id ON external_api_test_history(endpoint_id);
CREATE INDEX IF NOT EXISTS idx_external_api_test_history_success ON external_api_test_history(success);
CREATE INDEX IF NOT EXISTS idx_external_api_test_history_tested_at ON external_api_test_history(tested_at);
CREATE INDEX IF NOT EXISTS idx_external_api_test_history_tested_by ON external_api_test_history(tested_by);
CREATE INDEX IF NOT EXISTS idx_external_api_test_history_status ON external_api_test_history(response_status);

-- ========================================
-- 6. TRIGGERS PARA UPDATED_AT
-- ========================================

-- Trigger para external_apis
DROP TRIGGER IF EXISTS update_external_apis_updated_at ON external_apis;
CREATE TRIGGER update_external_apis_updated_at
    BEFORE UPDATE ON external_apis
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger para external_api_endpoints
DROP TRIGGER IF EXISTS update_external_api_endpoints_updated_at ON external_api_endpoints;
CREATE TRIGGER update_external_api_endpoints_updated_at
    BEFORE UPDATE ON external_api_endpoints
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- 7. ROW LEVEL SECURITY (RLS)
-- ========================================

-- Habilitar RLS nas tabelas
ALTER TABLE external_apis ENABLE ROW LEVEL SECURITY;
ALTER TABLE external_api_endpoints ENABLE ROW LEVEL SECURITY;
ALTER TABLE external_api_test_history ENABLE ROW LEVEL SECURITY;

-- Políticas para external_apis
DROP POLICY IF EXISTS "Users can view external_apis" ON external_apis;
CREATE POLICY "Users can view external_apis" ON external_apis
  FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Users can insert external_apis" ON external_apis;
CREATE POLICY "Users can insert external_apis" ON external_apis
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Users can update external_apis" ON external_apis;
CREATE POLICY "Users can update external_apis" ON external_apis
  FOR UPDATE USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Users can delete external_apis" ON external_apis;
CREATE POLICY "Users can delete external_apis" ON external_apis
  FOR DELETE USING (auth.role() = 'authenticated');

-- Políticas para external_api_endpoints
DROP POLICY IF EXISTS "Users can view external_api_endpoints" ON external_api_endpoints;
CREATE POLICY "Users can view external_api_endpoints" ON external_api_endpoints
  FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Users can insert external_api_endpoints" ON external_api_endpoints;
CREATE POLICY "Users can insert external_api_endpoints" ON external_api_endpoints
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Users can update external_api_endpoints" ON external_api_endpoints;
CREATE POLICY "Users can update external_api_endpoints" ON external_api_endpoints
  FOR UPDATE USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Users can delete external_api_endpoints" ON external_api_endpoints;
CREATE POLICY "Users can delete external_api_endpoints" ON external_api_endpoints
  FOR DELETE USING (auth.role() = 'authenticated');

-- Políticas para external_api_test_history
DROP POLICY IF EXISTS "Users can view external_api_test_history" ON external_api_test_history;
CREATE POLICY "Users can view external_api_test_history" ON external_api_test_history
  FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Users can insert external_api_test_history" ON external_api_test_history;
CREATE POLICY "Users can insert external_api_test_history" ON external_api_test_history
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Users can update external_api_test_history" ON external_api_test_history;
CREATE POLICY "Users can update external_api_test_history" ON external_api_test_history
  FOR UPDATE USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Users can delete external_api_test_history" ON external_api_test_history;
CREATE POLICY "Users can delete external_api_test_history" ON external_api_test_history
  FOR DELETE USING (auth.role() = 'authenticated');

-- ========================================
-- 8. FUNÇÕES AUXILIARES
-- ========================================

-- Função para gerar comando cURL
CREATE OR REPLACE FUNCTION generate_curl_command(
  p_api_id UUID,
  p_endpoint_id UUID DEFAULT NULL,
  p_custom_path TEXT DEFAULT NULL
)
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  api_record external_apis%ROWTYPE;
  endpoint_record external_api_endpoints%ROWTYPE;
  curl_cmd TEXT;
  auth_header TEXT := '';
  final_url TEXT;
  final_method TEXT := 'GET';
  header_key TEXT;
  header_value TEXT;
BEGIN
  -- Buscar dados da API
  SELECT * INTO api_record FROM external_apis WHERE id = p_api_id;
  
  IF NOT FOUND THEN
    RETURN 'API não encontrada';
  END IF;
  
  -- Buscar endpoint se fornecido
  IF p_endpoint_id IS NOT NULL THEN
    SELECT * INTO endpoint_record FROM external_api_endpoints WHERE id = p_endpoint_id;
    IF FOUND THEN
      final_url := api_record.base_url || endpoint_record.path;
      final_method := endpoint_record.method;
    END IF;
  ELSE
    final_url := api_record.base_url || COALESCE(p_custom_path, '');
  END IF;
  
  -- Construir comando base
  curl_cmd := 'curl -X ' || final_method || ' "' || final_url || '"';
  
  -- Adicionar autenticação
  CASE api_record.auth_type
    WHEN 'api_key' THEN
      IF api_record.auth_config->>'header_name' IS NOT NULL THEN
        curl_cmd := curl_cmd || ' -H "' || (api_record.auth_config->>'header_name') || ': ' || (api_record.auth_config->>'api_key') || '"';
      END IF;
    WHEN 'bearer' THEN
      curl_cmd := curl_cmd || ' -H "Authorization: Bearer ' || (api_record.auth_config->>'token') || '"';
    WHEN 'basic' THEN
      curl_cmd := curl_cmd || ' -u "' || (api_record.auth_config->>'username') || ':' || (api_record.auth_config->>'password') || '"';
  END CASE;
  
  -- Adicionar headers personalizados
  IF api_record.headers IS NOT NULL THEN
    FOR header_key, header_value IN SELECT * FROM jsonb_each_text(api_record.headers)
    LOOP
      curl_cmd := curl_cmd || ' -H "' || header_key || ': ' || header_value || '"';
    END LOOP;
  END IF;
  
  -- Adicionar Content-Type padrão para métodos que precisam
  IF final_method IN ('POST', 'PUT', 'PATCH') THEN
    curl_cmd := curl_cmd || ' -H "Content-Type: application/json"';
  END IF;
  
  RETURN curl_cmd;
END;
$$;

-- Função para análise de IA de erros (placeholder)
CREATE OR REPLACE FUNCTION analyze_api_error_with_ai(
  p_api_id UUID,
  p_error_message TEXT,
  p_response_body JSONB DEFAULT NULL
)
RETURNS TEXT
LANGUAGE plpgsql
AS $$
BEGIN
  -- Placeholder para integração futura com IA
  -- Por enquanto, retorna uma análise básica baseada em padrões comuns
  
  IF p_error_message ILIKE '%timeout%' THEN
    RETURN 'Erro de timeout detectado. Verifique a conectividade de rede e considere aumentar o timeout.';
  ELSIF p_error_message ILIKE '%unauthorized%' OR p_error_message ILIKE '%401%' THEN
    RETURN 'Erro de autenticação. Verifique as credenciais da API e o tipo de autenticação configurado.';
  ELSIF p_error_message ILIKE '%forbidden%' OR p_error_message ILIKE '%403%' THEN
    RETURN 'Acesso negado. Verifique as permissões da API key ou token de acesso.';
  ELSIF p_error_message ILIKE '%not found%' OR p_error_message ILIKE '%404%' THEN
    RETURN 'Endpoint não encontrado. Verifique a URL base e o caminho do endpoint.';
  ELSIF p_error_message ILIKE '%rate limit%' OR p_error_message ILIKE '%429%' THEN
    RETURN 'Limite de taxa excedido. Aguarde antes de fazer nova requisição ou verifique os limites da API.';
  ELSIF p_error_message ILIKE '%server error%' OR p_error_message ILIKE '%500%' THEN
    RETURN 'Erro interno do servidor da API. Tente novamente mais tarde ou contate o suporte da API.';
  ELSIF p_error_message ILIKE '%bad request%' OR p_error_message ILIKE '%400%' THEN
    RETURN 'Requisição inválida. Verifique os parâmetros e formato dos dados enviados.';
  ELSIF p_error_message ILIKE '%connection%' OR p_error_message ILIKE '%network%' THEN
    RETURN 'Problema de conectividade. Verifique a conexão de internet e a disponibilidade da API.';
  ELSE
    RETURN 'Erro não categorizado. Verifique a documentação da API para mais detalhes sobre este erro: ' || COALESCE(p_error_message, 'N/A');
  END IF;
END;
$$;

-- Função para buscar APIs ativas
CREATE OR REPLACE FUNCTION get_active_external_apis()
RETURNS TABLE (
  id UUID,
  name VARCHAR(255),
  description TEXT,
  base_url VARCHAR(500),
  auth_type VARCHAR(50),
  is_mcp_server BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ea.id,
    ea.name,
    ea.description,
    ea.base_url,
    ea.auth_type,
    ea.is_mcp_server,
    ea.created_at
  FROM external_apis ea
  WHERE ea.is_active = true
  ORDER BY ea.name;
END;
$$;

-- Função para buscar servidores MCP
CREATE OR REPLACE FUNCTION get_mcp_servers()
RETURNS TABLE (
  id UUID,
  name VARCHAR(255),
  description TEXT,
  base_url VARCHAR(500),
  mcp_config JSONB,
  created_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ea.id,
    ea.name,
    ea.description,
    ea.base_url,
    ea.mcp_config,
    ea.created_at
  FROM external_apis ea
  WHERE ea.is_active = true AND ea.is_mcp_server = true
  ORDER BY ea.name;
END;
$$;

-- ========================================
-- 9. DADOS DE EXEMPLO (OPCIONAL)
-- ========================================

-- Inserir uma API de exemplo (descomente se desejar)
/*
INSERT INTO external_apis (
  name,
  description,
  base_url,
  auth_type,
  auth_config,
  headers,
  is_active,
  is_mcp_server,
  mcp_config,
  observations
) VALUES (
  'JSONPlaceholder API',
  'API de teste para desenvolvimento',
  'https://jsonplaceholder.typicode.com',
  'none',
  '{}',
  '{"Accept": "application/json"}',
  true,
  false,
  '{}',
  'API pública para testes e desenvolvimento'
) ON CONFLICT DO NOTHING;
*/

-- ========================================
-- 10. VERIFICAÇÕES FINAIS
-- ========================================

-- Verificar se as tabelas foram criadas
DO $$
BEGIN
  -- Verificar external_apis
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'external_apis') THEN
    RAISE NOTICE '✅ Tabela external_apis criada com sucesso';
  ELSE
    RAISE EXCEPTION '❌ Falha ao criar tabela external_apis';
  END IF;
  
  -- Verificar external_api_endpoints
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'external_api_endpoints') THEN
    RAISE NOTICE '✅ Tabela external_api_endpoints criada com sucesso';
  ELSE
    RAISE EXCEPTION '❌ Falha ao criar tabela external_api_endpoints';
  END IF;
  
  -- Verificar external_api_test_history
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'external_api_test_history') THEN
    RAISE NOTICE '✅ Tabela external_api_test_history criada com sucesso';
  ELSE
    RAISE EXCEPTION '❌ Falha ao criar tabela external_api_test_history';
  END IF;
  
  -- Verificar funções
  IF EXISTS (SELECT 1 FROM information_schema.routines WHERE routine_name = 'generate_curl_command') THEN
    RAISE NOTICE '✅ Função generate_curl_command criada com sucesso';
  ELSE
    RAISE EXCEPTION '❌ Falha ao criar função generate_curl_command';
  END IF;
  
  RAISE NOTICE '🎉 Migração do sistema de APIs externas concluída com sucesso!';
  RAISE NOTICE '📋 Próximos passos:';
  RAISE NOTICE '   1. Verifique se a Edge Function test-external-api está ativa';
  RAISE NOTICE '   2. Configure as APIs externas no painel admin';
  RAISE NOTICE '   3. Teste as integrações criadas';
END $$; 