const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Configuração do Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://your-project-url.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'your-service-role-key';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Função para executar SQL
async function executeSql(sql, description) {
  console.log(`\n🔄 Executando: ${description}...`);
  
  try {
    const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql });
    
    if (error) {
      console.error(`❌ Erro em ${description}:`, error);
      return false;
    }
    
    console.log(`✅ ${description} executado com sucesso`);
    return true;
  } catch (err) {
    console.error(`❌ Exceção em ${description}:`, err);
    return false;
  }
}

// SQL para criar a função exec_sql se não existir
const createExecSqlFunction = `
CREATE OR REPLACE FUNCTION exec_sql(sql_query text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  EXECUTE sql_query;
  RETURN json_build_object('success', true);
EXCEPTION
  WHEN OTHERS THEN
    RETURN json_build_object('success', false, 'error', SQLERRM);
END;
$$;
`;

// SQL principal para criar as tabelas das APIs externas
const createExternalApisTable = `
-- Criar tabela principal de APIs externas
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

-- Criar índices
CREATE INDEX IF NOT EXISTS idx_external_apis_active ON external_apis(is_active);
CREATE INDEX IF NOT EXISTS idx_external_apis_mcp ON external_apis(is_mcp_server);
CREATE INDEX IF NOT EXISTS idx_external_apis_auth_type ON external_apis(auth_type);
CREATE INDEX IF NOT EXISTS idx_external_apis_created_by ON external_apis(created_by);

-- Criar tabela de endpoints
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

-- Criar índices para endpoints
CREATE INDEX IF NOT EXISTS idx_external_api_endpoints_api_id ON external_api_endpoints(api_id);
CREATE INDEX IF NOT EXISTS idx_external_api_endpoints_active ON external_api_endpoints(is_active);
CREATE INDEX IF NOT EXISTS idx_external_api_endpoints_method ON external_api_endpoints(method);

-- Criar tabela de histórico de testes
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

-- Criar índices para histórico
CREATE INDEX IF NOT EXISTS idx_external_api_test_history_api_id ON external_api_test_history(api_id);
CREATE INDEX IF NOT EXISTS idx_external_api_test_history_endpoint_id ON external_api_test_history(endpoint_id);
CREATE INDEX IF NOT EXISTS idx_external_api_test_history_success ON external_api_test_history(success);
CREATE INDEX IF NOT EXISTS idx_external_api_test_history_tested_at ON external_api_test_history(tested_at);
CREATE INDEX IF NOT EXISTS idx_external_api_test_history_tested_by ON external_api_test_history(tested_by);
`;

// Triggers para updated_at
const createTriggers = `
-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

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
`;

// RLS (Row Level Security)
const createRLS = `
-- Habilitar RLS
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
`;

// Funções auxiliares
const createHelperFunctions = `
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
    FOR key, value IN SELECT * FROM jsonb_each_text(api_record.headers)
    LOOP
      curl_cmd := curl_cmd || ' -H "' || key || ': ' || value || '"';
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
  -- Por enquanto, retorna uma análise básica
  
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
  ELSE
    RETURN 'Erro não categorizado. Verifique a documentação da API para mais detalhes sobre este erro.';
  END IF;
END;
$$;
`;

async function main() {
  console.log('🚀 Iniciando aplicação das migrações de APIs Externas...');
  
  // Verificar variáveis de ambiente
  if (!process.env.VITE_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.log('\n⚠️  Variáveis de ambiente não encontradas. Usando valores padrão.');
    console.log('📝 Certifique-se de configurar:');
    console.log('   - VITE_SUPABASE_URL');
    console.log('   - SUPABASE_SERVICE_ROLE_KEY');
    console.log('\n💡 Você pode criar um arquivo .env com essas variáveis.');
  }
  
  let success = true;
  
  // 1. Criar função exec_sql
  success = await executeSql(createExecSqlFunction, 'Criação da função exec_sql') && success;
  
  // 2. Criar tabelas principais
  success = await executeSql(createExternalApisTable, 'Criação das tabelas de APIs externas') && success;
  
  // 3. Criar triggers
  success = await executeSql(createTriggers, 'Criação dos triggers') && success;
  
  // 4. Configurar RLS
  success = await executeSql(createRLS, 'Configuração do Row Level Security') && success;
  
  // 5. Criar funções auxiliares
  success = await executeSql(createHelperFunctions, 'Criação das funções auxiliares') && success;
  
  if (success) {
    console.log('\n🎉 Todas as migrações foram aplicadas com sucesso!');
    console.log('\n📋 Recursos criados:');
    console.log('   ✅ Tabela external_apis');
    console.log('   ✅ Tabela external_api_endpoints');
    console.log('   ✅ Tabela external_api_test_history');
    console.log('   ✅ Índices otimizados');
    console.log('   ✅ Triggers para updated_at');
    console.log('   ✅ Políticas RLS');
    console.log('   ✅ Função generate_curl_command');
    console.log('   ✅ Função analyze_api_error_with_ai');
    console.log('\n🔗 Agora você pode usar o sistema de APIs Externas no admin!');
  } else {
    console.log('\n❌ Algumas migrações falharam. Verifique os erros acima.');
    process.exit(1);
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { main }; 