-- Migração Consolidada e Idempotente para o Módulo de APIs Externas
-- Este script pode ser executado várias vezes sem causar erros.

-- 1. Criar a tabela external_apis (versão simplificada)
CREATE TABLE IF NOT EXISTS public.external_apis (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    base_url VARCHAR(500) NOT NULL,
    api_key VARCHAR(500),
    auth_type VARCHAR(50) DEFAULT 'none' CHECK (auth_type IN ('none', 'api_key', 'bearer', 'basic', 'oauth2')),
    headers JSONB DEFAULT '[]'::jsonb,
    query_params JSONB DEFAULT '[]'::jsonb,
    is_active BOOLEAN DEFAULT true,
    is_mcp_server BOOLEAN DEFAULT false,
    mcp_config JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    observations TEXT,
    documentation TEXT,
    error_logs JSONB DEFAULT '[]',
    ai_analysis_enabled BOOLEAN DEFAULT false,
    ai_key_id UUID,
    mcp_tools JSONB DEFAULT '[]'::jsonb
);

-- 2. Criar a tabela external_api_endpoints
CREATE TABLE IF NOT EXISTS public.external_api_endpoints (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    api_id UUID REFERENCES external_apis(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    path VARCHAR(500) NOT NULL,
    method VARCHAR(10) NOT NULL CHECK (method IN ('GET', 'POST', 'PUT', 'PATCH', 'DELETE')),
    description TEXT,
    headers JSONB DEFAULT '[]'::jsonb,
    query_params JSONB DEFAULT '[]'::jsonb,
    body_schema JSONB DEFAULT '{}'::jsonb,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Criar a tabela external_api_test_history
CREATE TABLE IF NOT EXISTS public.external_api_test_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    api_id UUID REFERENCES external_apis(id) ON DELETE CASCADE,
    endpoint_id UUID REFERENCES external_api_endpoints(id) ON DELETE SET NULL,
    request_url TEXT NOT NULL,
    request_method VARCHAR(10) NOT NULL,
    request_headers JSONB DEFAULT '{}'::jsonb,
    request_body TEXT,
    response_status INTEGER,
    response_headers JSONB DEFAULT '{}'::jsonb,
    response_body TEXT,
    response_time_ms INTEGER,
    is_success BOOLEAN,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    error_log TEXT,
    ai_analysis TEXT,
    ai_suggestions TEXT,
    curl_command TEXT
);

-- 4. Habilitar RLS (Row Level Security)
ALTER TABLE public.external_apis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.external_api_endpoints ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.external_api_test_history ENABLE ROW LEVEL SECURITY;

-- 5. Criar políticas RLS PERMISSIVAS (temporariamente)
-- Estas políticas permitem acesso total para usuários autenticados
CREATE POLICY "Permitir tudo para usuários autenticados - APIs" ON public.external_apis
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Permitir tudo para usuários autenticados - Endpoints" ON public.external_api_endpoints
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Permitir tudo para usuários autenticados - Histórico" ON public.external_api_test_history
    FOR ALL USING (auth.role() = 'authenticated');

-- 6. Criar índices básicos
CREATE INDEX IF NOT EXISTS idx_external_apis_active ON external_apis(is_active);
CREATE INDEX IF NOT EXISTS idx_external_api_endpoints_api_id ON external_api_endpoints(api_id);
CREATE INDEX IF NOT EXISTS idx_external_api_test_history_api_id ON external_api_test_history(api_id);

-- 7. Função para atualizar o timestamp de updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 8. Triggers para atualizar updated_at (aplica apenas se não existirem)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_external_apis_updated_at') THEN
        CREATE TRIGGER update_external_apis_updated_at 
            BEFORE UPDATE ON external_apis 
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_external_api_endpoints_updated_at') THEN
        CREATE TRIGGER update_external_api_endpoints_updated_at 
            BEFORE UPDATE ON external_api_endpoints 
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

-- 9. Comentários para documentação (sempre seguro de executar)
COMMENT ON TABLE external_apis IS 'Armazena configurações de APIs externas e servidores MCP.';
COMMENT ON COLUMN external_apis.observations IS 'Observações e notas internas sobre a API.';
COMMENT ON COLUMN external_apis.documentation IS 'URL ou texto da documentação da API para referência.';
COMMENT ON COLUMN external_apis.error_logs IS 'Logs de erros históricos para análise de tendências.';
COMMENT ON COLUMN external_apis.ai_analysis_enabled IS 'Habilita a análise de IA para erros nesta API.';
COMMENT ON COLUMN external_apis.mcp_tools IS 'Ferramentas disponíveis para servidores MCP';

COMMENT ON TABLE external_api_test_history IS 'Registra cada teste de API executado no sistema.';
COMMENT ON COLUMN external_api_test_history.error_log IS 'Log detalhado de um erro ocorrido durante o teste.';
COMMENT ON COLUMN external_api_test_history.ai_analysis IS 'Análise do erro gerada por IA.';
COMMENT ON COLUMN external_api_test_history.ai_suggestions IS 'Sugestões de correção da IA para o erro.';
COMMENT ON COLUMN external_api_test_history.curl_command IS 'Comando cURL equivalente ao teste executado.';

-- Primeiro, vamos ver qual é o seu user_id
SELECT id, email FROM auth.users ORDER BY created_at DESC LIMIT 5;

-- Substitua 'SEU_USER_ID_AQUI' pelo ID que você encontrou acima
INSERT INTO public.user_roles (user_id, role) 
VALUES ('SEU_USER_ID_AQUI', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;

-- Adicionar todos os campos que podem estar faltando
DO $$ 
BEGIN
    -- Adicionar mcp_tools se não existir
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'external_apis' AND column_name = 'mcp_tools') THEN
        ALTER TABLE external_apis ADD COLUMN mcp_tools JSONB DEFAULT '[]'::jsonb;
    END IF;
    
    -- Verificar se mcp_config existe (pode ter sido perdido)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'external_apis' AND column_name = 'mcp_config') THEN
        ALTER TABLE external_apis ADD COLUMN mcp_config JSONB DEFAULT '{}'::jsonb;
    END IF;
    
    -- Verificar se query_params existe
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'external_apis' AND column_name = 'query_params') THEN
        ALTER TABLE external_apis ADD COLUMN query_params JSONB DEFAULT '[]'::jsonb;
    END IF;
END $$;

SELECT table_name FROM information_schema.tables 
WHERE table_name = 'external_apis' AND table_schema = 'public';

SELECT * FROM public.external_api_test_history WHERE ai_analysis IS NOT NULL;

\df+ analyze_api_error_with_ai
\df+ trigger_ai_error_analysis

SELECT tgname FROM pg_trigger WHERE tgrelid = 'external_api_test_history'::regclass;

-- Função para análise de IA de erros (mock/simulação)
CREATE OR REPLACE FUNCTION analyze_api_error_with_ai(
  p_error_message TEXT,
  p_response_status INTEGER,
  p_response_body TEXT,
  p_api_documentation TEXT DEFAULT NULL
) RETURNS JSONB AS $$
DECLARE
  ai_analysis JSONB;
BEGIN
  -- Aqui você pode integrar com uma API real de IA (OpenAI, Gemini, etc)
  -- Por enquanto, retorna uma análise simulada
  ai_analysis := jsonb_build_object(
    'analysis', 'Análise simulada: verifique a URL, as credenciais e o formato dos dados.',
    'suggestions', ARRAY[
      'Verifique se a URL está correta',
      'Confirme se as credenciais estão válidas',
      'Valide o formato dos dados enviados'
    ],
    'severity', CASE 
      WHEN p_response_status >= 500 THEN 'high'
      WHEN p_response_status >= 400 THEN 'medium'
      ELSE 'low'
    END
  );
  RETURN ai_analysis;
END;
$$ LANGUAGE plpgsql;

-- Função de trigger para análise automática de erros com IA
CREATE OR REPLACE FUNCTION trigger_ai_error_analysis() RETURNS TRIGGER AS $$
DECLARE
  ai_result JSONB;
BEGIN
  -- Só analisar se houve erro
  IF NEW.is_success = false AND NEW.error_message IS NOT NULL THEN
    -- Fazer análise com IA
    ai_result := analyze_api_error_with_ai(
      NEW.error_message,
      NEW.response_status,
      NEW.response_body,
      NULL
    );
    -- Atualizar campos de análise
    NEW.ai_analysis := ai_result->>'analysis';
    NEW.ai_suggestions := array_to_string(ai_result->'suggestions', E'\n');
    NEW.error_log := NEW.error_message;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Criar trigger para rodar a análise de IA automaticamente
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'ai_error_analysis_trigger'
      AND tgrelid = 'external_api_test_history'::regclass
  ) THEN
    CREATE TRIGGER ai_error_analysis_trigger
      BEFORE INSERT OR UPDATE ON public.external_api_test_history
      FOR EACH ROW
      EXECUTE FUNCTION trigger_ai_error_analysis();
  END IF;
END $$; 