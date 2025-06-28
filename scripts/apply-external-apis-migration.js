const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = "https://ctdajbfmgmkhqueskjvk.supabase.co";
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN0ZGFqYmZtZ21raHF1ZXNranZrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTAwNTcwMCwiZXhwIjoyMDY0NTgxNzAwfQ.Oe8mUm7qqKdcE1Xdp2fW7rqbpJRgLIGqHJUJhqfJq8c";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function createExternalApisTables() {
  console.log('🚀 Criando tabelas para APIs externas...');

  try {
    // SQL para criar as tabelas
    const createTablesSQL = `
      -- Criação da tabela para APIs externas
      CREATE TABLE IF NOT EXISTS external_apis (
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
          mcp_tools JSONB DEFAULT '[]'::jsonb,
          ai_analysis_enabled BOOLEAN DEFAULT false,
          ai_key_id VARCHAR(255),
          observations TEXT,
          documentation TEXT,
          error_logs JSONB DEFAULT '[]'::jsonb,
          curl_command TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
      );

      -- Criação da tabela para histórico de testes de APIs
      CREATE TABLE IF NOT EXISTS external_api_test_history (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          api_id UUID REFERENCES external_apis(id) ON DELETE CASCADE,
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
          ai_analysis TEXT,
          ai_suggestions TEXT,
          curl_command TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
      );

      -- Índices para melhor performance
      CREATE INDEX IF NOT EXISTS idx_external_apis_active ON external_apis(is_active);
      CREATE INDEX IF NOT EXISTS idx_external_apis_mcp ON external_apis(is_mcp_server);
      CREATE INDEX IF NOT EXISTS idx_external_api_test_history_api_id ON external_api_test_history(api_id);
      CREATE INDEX IF NOT EXISTS idx_external_api_test_history_created_at ON external_api_test_history(created_at);

      -- RLS (Row Level Security)
      ALTER TABLE external_apis ENABLE ROW LEVEL SECURITY;
      ALTER TABLE external_api_test_history ENABLE ROW LEVEL SECURITY;

      -- Políticas RLS para external_apis
      DROP POLICY IF EXISTS "Usuários autenticados podem visualizar APIs externas" ON external_apis;
      CREATE POLICY "Usuários autenticados podem visualizar APIs externas" ON external_apis
          FOR SELECT USING (auth.role() = 'authenticated');

      DROP POLICY IF EXISTS "Usuários autenticados podem gerenciar APIs externas" ON external_apis;
      CREATE POLICY "Usuários autenticados podem gerenciar APIs externas" ON external_apis
          FOR ALL USING (auth.role() = 'authenticated');

      -- Políticas RLS para external_api_test_history
      DROP POLICY IF EXISTS "Usuários autenticados podem visualizar histórico de testes" ON external_api_test_history;
      CREATE POLICY "Usuários autenticados podem visualizar histórico de testes" ON external_api_test_history
          FOR SELECT USING (auth.role() = 'authenticated');

      DROP POLICY IF EXISTS "Usuários autenticados podem inserir histórico de testes" ON external_api_test_history;
      CREATE POLICY "Usuários autenticados podem inserir histórico de testes" ON external_api_test_history
          FOR INSERT WITH CHECK (auth.role() = 'authenticated');
    `;

    const { error } = await supabase.rpc('exec_sql', { sql: createTablesSQL });

    if (error) {
      // Se a função exec_sql não existir, tentar executar diretamente
      console.log('Tentando executar SQL diretamente...');
      
      // Dividir em comandos menores
      const commands = [
        // Criar tabela external_apis
        `CREATE TABLE IF NOT EXISTS external_apis (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          description TEXT,
          base_url VARCHAR(500) NOT NULL,
          api_key VARCHAR(500),
          auth_type VARCHAR(50) DEFAULT 'none',
          headers JSONB DEFAULT '[]'::jsonb,
          query_params JSONB DEFAULT '[]'::jsonb,
          is_active BOOLEAN DEFAULT true,
          is_mcp_server BOOLEAN DEFAULT false,
          mcp_config JSONB DEFAULT '{}'::jsonb,
          mcp_tools JSONB DEFAULT '[]'::jsonb,
          ai_analysis_enabled BOOLEAN DEFAULT false,
          ai_key_id VARCHAR(255),
          observations TEXT,
          documentation TEXT,
          error_logs JSONB DEFAULT '[]'::jsonb,
          curl_command TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          created_by UUID
        )`,
        
        // Criar tabela external_api_test_history
        `CREATE TABLE IF NOT EXISTS external_api_test_history (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          api_id UUID,
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
          ai_analysis TEXT,
          ai_suggestions TEXT,
          curl_command TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          created_by UUID
        )`
      ];

      for (const command of commands) {
        console.log('Executando comando SQL...');
        const { error: cmdError } = await supabase.from('_temp').select('1').limit(0);
        // Como não podemos executar SQL diretamente, vamos tentar uma abordagem diferente
      }
      
      throw error;
    }

    console.log('✅ Tabelas criadas com sucesso!');
    
    // Verificar se as tabelas foram criadas
    const { data: tables, error: checkError } = await supabase
      .from('external_apis')
      .select('count')
      .limit(0);

    if (checkError) {
      console.log('❌ Erro ao verificar tabelas:', checkError.message);
    } else {
      console.log('✅ Tabelas verificadas com sucesso!');
    }

  } catch (error) {
    console.error('❌ Erro ao criar tabelas:', error.message);
    console.log('\n📝 Instruções manuais:');
    console.log('1. Acesse o painel do Supabase: https://supabase.com/dashboard');
    console.log('2. Vá para SQL Editor');
    console.log('3. Execute o SQL das migrações manualmente');
    console.log('4. Ou use: npx supabase db push --include-all');
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  createExternalApisTables();
}

module.exports = { createExternalApisTables }; 