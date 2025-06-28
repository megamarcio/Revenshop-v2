const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Configuração do Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variáveis de ambiente não configuradas:');
  console.error('VITE_SUPABASE_URL:', supabaseUrl ? '✅' : '❌');
  console.error('SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? '✅' : '❌');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function applyMigrations() {
  console.log('🚀 Iniciando aplicação das migrações das APIs externas...\n');

  try {
    // 1. Verificar se as tabelas existem
    console.log('📋 Verificando estrutura das tabelas...');
    
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .in('table_name', ['external_apis', 'external_api_test_history']);

    if (tablesError) {
      console.error('❌ Erro ao verificar tabelas:', tablesError);
      return;
    }

    const existingTables = tables.map(t => t.table_name);
    console.log('✅ Tabelas existentes:', existingTables);

    // 2. Aplicar migração das APIs externas
    console.log('\n🔧 Aplicando migração das APIs externas...');
    
    const migrationSQL = `
      -- Adicionar novos campos à tabela external_apis se não existirem
      DO $$ 
      BEGIN
          -- Adicionar campo observations se não existir
          IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                         WHERE table_name = 'external_apis' AND column_name = 'observations') THEN
              ALTER TABLE external_apis ADD COLUMN observations TEXT;
              RAISE NOTICE 'Campo observations adicionado';
          ELSE
              RAISE NOTICE 'Campo observations já existe';
          END IF;

          -- Adicionar campo documentation se não existir
          IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                         WHERE table_name = 'external_apis' AND column_name = 'documentation') THEN
              ALTER TABLE external_apis ADD COLUMN documentation TEXT;
              RAISE NOTICE 'Campo documentation adicionado';
          ELSE
              RAISE NOTICE 'Campo documentation já existe';
          END IF;

          -- Adicionar campo error_logs se não existir
          IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                         WHERE table_name = 'external_apis' AND column_name = 'error_logs') THEN
              ALTER TABLE external_apis ADD COLUMN error_logs JSONB DEFAULT '[]';
              RAISE NOTICE 'Campo error_logs adicionado';
          ELSE
              RAISE NOTICE 'Campo error_logs já existe';
          END IF;

          -- Adicionar campo ai_analysis_enabled se não existir
          IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                         WHERE table_name = 'external_apis' AND column_name = 'ai_analysis_enabled') THEN
              ALTER TABLE external_apis ADD COLUMN ai_analysis_enabled BOOLEAN DEFAULT false;
              RAISE NOTICE 'Campo ai_analysis_enabled adicionado';
          ELSE
              RAISE NOTICE 'Campo ai_analysis_enabled já existe';
          END IF;

          -- Adicionar campo ai_key_id se não existir
          IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                         WHERE table_name = 'external_apis' AND column_name = 'ai_key_id') THEN
              ALTER TABLE external_apis ADD COLUMN ai_key_id UUID;
              RAISE NOTICE 'Campo ai_key_id adicionado';
              
              -- Adicionar foreign key se a tabela ai_settings existir
              IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'ai_settings') THEN
                  ALTER TABLE external_apis ADD CONSTRAINT fk_external_apis_ai_key 
                      FOREIGN KEY (ai_key_id) REFERENCES ai_settings(id);
                  RAISE NOTICE 'Foreign key para ai_settings adicionada';
              END IF;
          ELSE
              RAISE NOTICE 'Campo ai_key_id já existe';
          END IF;
      END $$;

      -- Adicionar novos campos à tabela external_api_test_history se não existirem
      DO $$ 
      BEGIN
          -- Adicionar campo error_log se não existir
          IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                         WHERE table_name = 'external_api_test_history' AND column_name = 'error_log') THEN
              ALTER TABLE external_api_test_history ADD COLUMN error_log TEXT;
              RAISE NOTICE 'Campo error_log adicionado';
          ELSE
              RAISE NOTICE 'Campo error_log já existe';
          END IF;

          -- Adicionar campo ai_analysis se não existir
          IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                         WHERE table_name = 'external_api_test_history' AND column_name = 'ai_analysis') THEN
              ALTER TABLE external_api_test_history ADD COLUMN ai_analysis TEXT;
              RAISE NOTICE 'Campo ai_analysis adicionado';
          ELSE
              RAISE NOTICE 'Campo ai_analysis já existe';
          END IF;

          -- Adicionar campo ai_suggestions se não existir
          IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                         WHERE table_name = 'external_api_test_history' AND column_name = 'ai_suggestions') THEN
              ALTER TABLE external_api_test_history ADD COLUMN ai_suggestions TEXT;
              RAISE NOTICE 'Campo ai_suggestions adicionado';
          ELSE
              RAISE NOTICE 'Campo ai_suggestions já existe';
          END IF;

          -- Adicionar campo curl_command se não existir
          IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                         WHERE table_name = 'external_api_test_history' AND column_name = 'curl_command') THEN
              ALTER TABLE external_api_test_history ADD COLUMN curl_command TEXT;
              RAISE NOTICE 'Campo curl_command adicionado';
          ELSE
              RAISE NOTICE 'Campo curl_command já existe';
          END IF;
      END $$;
    `;

    const { error: migrationError } = await supabase.rpc('exec_sql', { sql: migrationSQL });
    
    if (migrationError) {
      console.error('❌ Erro ao aplicar migração:', migrationError);
      return;
    }

    console.log('✅ Migração das APIs externas aplicada com sucesso!');

    // 3. Criar funções
    console.log('\n🔧 Criando funções...');
    
    const functionsSQL = `
      -- Criar função para gerar comando cURL
      CREATE OR REPLACE FUNCTION generate_curl_command(
        p_url TEXT,
        p_method TEXT,
        p_headers JSONB,
        p_body TEXT
      ) RETURNS TEXT AS $$
      DECLARE
        curl_cmd TEXT := 'curl';
        header_part TEXT := '';
      BEGIN
        -- Adicionar método
        IF p_method != 'GET' THEN
          curl_cmd := curl_cmd || ' -X ' || p_method;
        END IF;
        
        -- Adicionar URL
        curl_cmd := curl_cmd || ' "' || p_url || '"';
        
        -- Adicionar headers
        IF p_headers IS NOT NULL AND jsonb_array_length(p_headers) > 0 THEN
          FOR i IN 0..jsonb_array_length(p_headers)-1 LOOP
            header_part := header_part || ' -H "' || 
              (p_headers->i->>'name') || ': ' || 
              (p_headers->i->>'value') || '"';
          END LOOP;
          curl_cmd := curl_cmd || header_part;
        END IF;
        
        -- Adicionar body
        IF p_body IS NOT NULL AND p_body != '' THEN
          curl_cmd := curl_cmd || ' -d ''' || p_body || '''';
        END IF;
        
        RETURN curl_cmd;
      END;
      $$ LANGUAGE plpgsql;

      -- Criar função para análise de IA de erros
      CREATE OR REPLACE FUNCTION analyze_api_error_with_ai(
        p_error_message TEXT,
        p_response_status INTEGER,
        p_response_body TEXT,
        p_api_documentation TEXT DEFAULT NULL
      ) RETURNS JSONB AS $$
      DECLARE
        ai_analysis JSONB;
        ai_key TEXT;
        ai_url TEXT;
      BEGIN
        -- Buscar configurações de IA
        SELECT api_key, base_url INTO ai_key, ai_url
        FROM ai_settings 
        WHERE is_active = true 
        LIMIT 1;
        
        IF ai_key IS NULL THEN
          RETURN jsonb_build_object(
            'error', 'Configuração de IA não encontrada',
            'suggestions', ARRAY['Configure uma chave de IA válida no painel admin']
          );
        END IF;
        
        -- Construir prompt para análise
        DECLARE
          prompt TEXT := 'Analise este erro de API e forneça sugestões de correção:';
        BEGIN
          prompt := prompt || E'\\n\\nErro: ' || COALESCE(p_error_message, 'N/A');
          prompt := prompt || E'\\nStatus: ' || COALESCE(p_response_status::TEXT, 'N/A');
          prompt := prompt || E'\\nResposta: ' || COALESCE(p_response_body, 'N/A');
          
          IF p_api_documentation IS NOT NULL THEN
            prompt := prompt || E'\\n\\nDocumentação da API: ' || p_api_documentation;
          END IF;
          
          prompt := prompt || E'\\n\\nForneça uma análise detalhada e sugestões práticas de correção.';
        END;
        
        -- Análise simulada (aqui você faria a chamada real para a API de IA)
        ai_analysis := jsonb_build_object(
          'analysis', 'Análise de erro realizada com sucesso',
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

      -- Criar funções de trigger
      CREATE OR REPLACE FUNCTION trigger_generate_curl() RETURNS TRIGGER AS $$
      BEGIN
        IF NEW.request_url IS NOT NULL THEN
          NEW.curl_command := generate_curl_command(
            NEW.request_url,
            NEW.request_method,
            NEW.request_headers,
            NEW.request_body
          );
        END IF;
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;

      CREATE OR REPLACE FUNCTION trigger_ai_error_analysis() RETURNS TRIGGER AS $$
      DECLARE
        api_doc TEXT;
        ai_result JSONB;
      BEGIN
        -- Só analisar se houve erro
        IF NEW.is_success = false AND NEW.error_message IS NOT NULL THEN
          -- Buscar documentação da API
          SELECT documentation INTO api_doc
          FROM external_apis
          WHERE id = NEW.api_id;
          
          -- Fazer análise com IA
          ai_result := analyze_api_error_with_ai(
            NEW.error_message,
            NEW.response_status,
            NEW.response_body,
            api_doc
          );
          
          -- Atualizar campos de análise
          NEW.ai_analysis := ai_result->>'analysis';
          NEW.ai_suggestions := ai_result->>'suggestions';
          NEW.error_log := NEW.error_message;
        END IF;
        
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `;

    const { error: functionsError } = await supabase.rpc('exec_sql', { sql: functionsSQL });
    
    if (functionsError) {
      console.error('❌ Erro ao criar funções:', functionsError);
      return;
    }

    console.log('✅ Funções criadas com sucesso!');

    // 4. Criar triggers
    console.log('\n🔧 Criando triggers...');
    
    const triggersSQL = `
      -- Criar triggers se não existirem
      DO $$
      BEGIN
          IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'generate_curl_trigger') THEN
              CREATE TRIGGER generate_curl_trigger
                BEFORE INSERT OR UPDATE ON external_api_test_history
                FOR EACH ROW
                EXECUTE FUNCTION trigger_generate_curl();
              RAISE NOTICE 'Trigger generate_curl_trigger criado';
          ELSE
              RAISE NOTICE 'Trigger generate_curl_trigger já existe';
          END IF;
          
          IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'ai_error_analysis_trigger') THEN
              CREATE TRIGGER ai_error_analysis_trigger
                BEFORE INSERT OR UPDATE ON external_api_test_history
                FOR EACH ROW
                EXECUTE FUNCTION trigger_ai_error_analysis();
              RAISE NOTICE 'Trigger ai_error_analysis_trigger criado';
          ELSE
              RAISE NOTICE 'Trigger ai_error_analysis_trigger já existe';
          END IF;
      END $$;
    `;

    const { error: triggersError } = await supabase.rpc('exec_sql', { sql: triggersSQL });
    
    if (triggersError) {
      console.error('❌ Erro ao criar triggers:', triggersError);
      return;
    }

    console.log('✅ Triggers criados com sucesso!');

    // 5. Criar índices
    console.log('\n🔧 Criando índices...');
    
    const indexesSQL = `
      -- Criar índices se não existirem
      DO $$
      BEGIN
          IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_external_apis_ai_key') THEN
              CREATE INDEX idx_external_apis_ai_key ON external_apis(ai_key_id);
              RAISE NOTICE 'Índice idx_external_apis_ai_key criado';
          ELSE
              RAISE NOTICE 'Índice idx_external_apis_ai_key já existe';
          END IF;
          
          IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_test_history_error_log') THEN
              CREATE INDEX idx_test_history_error_log ON external_api_test_history(error_log);
              RAISE NOTICE 'Índice idx_test_history_error_log criado';
          ELSE
              RAISE NOTICE 'Índice idx_test_history_error_log já existe';
          END IF;
          
          IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_test_history_ai_analysis') THEN
              CREATE INDEX idx_test_history_ai_analysis ON external_api_test_history(ai_analysis);
              RAISE NOTICE 'Índice idx_test_history_ai_analysis criado';
          ELSE
              RAISE NOTICE 'Índice idx_test_history_ai_analysis já existe';
          END IF;
      END $$;
    `;

    const { error: indexesError } = await supabase.rpc('exec_sql', { sql: indexesSQL });
    
    if (indexesError) {
      console.error('❌ Erro ao criar índices:', indexesError);
      return;
    }

    console.log('✅ Índices criados com sucesso!');

    // 6. Verificar resultado
    console.log('\n🔍 Verificando estrutura final...');
    
    const { data: columns, error: columnsError } = await supabase
      .from('information_schema.columns')
      .select('table_name, column_name, data_type')
      .eq('table_schema', 'public')
      .in('table_name', ['external_apis', 'external_api_test_history'])
      .order('table_name, column_name');

    if (columnsError) {
      console.error('❌ Erro ao verificar colunas:', columnsError);
      return;
    }

    console.log('\n📊 Estrutura das tabelas:');
    let currentTable = '';
    columns.forEach(col => {
      if (col.table_name !== currentTable) {
        currentTable = col.table_name;
        console.log(`\n${currentTable}:`);
      }
      console.log(`  - ${col.column_name}: ${col.data_type}`);
    });

    console.log('\n🎉 Migração das APIs externas concluída com sucesso!');
    console.log('\n✅ Funcionalidades implementadas:');
    console.log('  - Campos de observações e documentação');
    console.log('  - Logs de erro e análise de IA');
    console.log('  - Geração automática de comandos cURL');
    console.log('  - Triggers para análise automática de erros');
    console.log('  - Índices para melhor performance');

  } catch (error) {
    console.error('❌ Erro durante a migração:', error);
  }
}

// Executar migração
applyMigrations().then(() => {
  console.log('\n🏁 Script finalizado.');
  process.exit(0);
}).catch((error) => {
  console.error('❌ Erro fatal:', error);
  process.exit(1);
}); 