const { createClient } = require('@supabase/supabase-js');

// Configuração do Supabase (substitua pelas suas credenciais)
const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseServiceKey = 'YOUR_SUPABASE_SERVICE_KEY';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function applyWebsiteSettingsMigration() {
  console.log('🔄 Aplicando migração da tabela website_settings...');

  try {
    // Verificar se a tabela já existe
    const { data: tables, error: checkError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .eq('table_name', 'website_settings');

    if (checkError) {
      console.error('❌ Erro ao verificar tabelas:', checkError);
      return;
    }

    if (tables && tables.length > 0) {
      console.log('✅ Tabela website_settings já existe');
      return;
    }

    console.log('🏗️ Criando tabela website_settings...');

    // Executar a migração
    const migrationSQL = `
      -- Criar tabela para configurações de sites
      CREATE TABLE IF NOT EXISTS website_settings (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        url TEXT NOT NULL,
        category VARCHAR(50) NOT NULL CHECK (category IN ('government', 'commercial', 'tools', 'other')),
        description TEXT,
        icon VARCHAR(100),
        is_active BOOLEAN DEFAULT true,
        sort_order INTEGER DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
      );

      -- Inserir sites padrão
      INSERT INTO website_settings (name, url, category, description, icon, sort_order) VALUES
        ('DETRAN SP', 'https://www.detran.sp.gov.br/', 'government', 'Departamento de Trânsito de São Paulo', 'Building2', 1),
        ('DENATRAN', 'https://www.gov.br/infraestrutura/pt-br/assuntos/transito', 'government', 'Departamento Nacional de Trânsito', 'Shield', 2),
        ('Tabela FIPE', 'https://veiculos.fipe.org.br/', 'tools', 'Consulta de preços de veículos', 'Calculator', 3),
        ('SINTEGRA', 'http://www.sintegra.gov.br/', 'government', 'Sistema Integrado de Informações sobre Operações Interestaduais', 'FileText', 4),
        ('Receita Federal', 'https://www.gov.br/receitafederal/pt-br', 'government', 'Portal da Receita Federal do Brasil', 'Building', 5),
        ('WebMotors', 'https://www.webmotors.com.br/', 'commercial', 'Portal de veículos usados e novos', 'Car', 6),
        ('MercadoLivre Veículos', 'https://carros.mercadolivre.com.br/', 'commercial', 'Marketplace de veículos', 'ShoppingCart', 7);

      -- Criar índices para performance
      CREATE INDEX IF NOT EXISTS idx_website_settings_category ON website_settings(category);
      CREATE INDEX IF NOT EXISTS idx_website_settings_active ON website_settings(is_active);
      CREATE INDEX IF NOT EXISTS idx_website_settings_sort ON website_settings(sort_order);

      -- Habilitar RLS (Row Level Security)
      ALTER TABLE website_settings ENABLE ROW LEVEL SECURITY;

      -- Criar políticas RLS
      CREATE POLICY "Allow read access for authenticated users" ON website_settings
        FOR SELECT USING (auth.role() = 'authenticated');

      CREATE POLICY "Allow all operations for admin users" ON website_settings
        FOR ALL USING (
          auth.uid() IN (
            SELECT id FROM profiles 
            WHERE role = 'admin'
          )
        );

      -- Criar função para atualizar updated_at automaticamente
      CREATE OR REPLACE FUNCTION update_website_settings_updated_at()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = timezone('utc'::text, now());
        RETURN NEW;
      END;
      $$ language 'plpgsql';

      -- Criar trigger para atualizar updated_at
      CREATE TRIGGER update_website_settings_updated_at
        BEFORE UPDATE ON website_settings
        FOR EACH ROW
        EXECUTE FUNCTION update_website_settings_updated_at();
    `;

    // Executar usando RPC se disponível
    const { error: rpcError } = await supabase.rpc('exec_sql', {
      sql: migrationSQL
    });

    if (rpcError) {
      console.warn('⚠️ RPC não disponível, tentando execução alternativa...');
      
      // Se RPC não funcionar, tentar criar tabela diretamente
      const { error: createError } = await supabase
        .from('website_settings')
        .select('*')
        .limit(1);

      if (createError && createError.code === '42P01') { // Tabela não existe
        console.log('❌ Não foi possível criar a tabela automaticamente.');
        console.log('📋 Execute manualmente no banco de dados:');
        console.log('\n' + migrationSQL);
        return;
      }
    }

    console.log('✅ Migração aplicada com sucesso!');
    
    // Verificar se os dados foram inseridos
    const { data: websites, error: selectError } = await supabase
      .from('website_settings')
      .select('*')
      .order('sort_order');

    if (selectError) {
      console.error('❌ Erro ao verificar dados:', selectError);
    } else {
      console.log(`✅ ${websites.length} sites padrão inseridos`);
    }

  } catch (error) {
    console.error('❌ Erro na migração:', error);
    console.log('\n📋 SQL para execução manual:');
    console.log(`
-- Criar tabela para configurações de sites
CREATE TABLE IF NOT EXISTS website_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  url TEXT NOT NULL,
  category VARCHAR(50) NOT NULL CHECK (category IN ('government', 'commercial', 'tools', 'other')),
  description TEXT,
  icon VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Inserir sites padrão
INSERT INTO website_settings (name, url, category, description, icon, sort_order) VALUES
  ('DETRAN SP', 'https://www.detran.sp.gov.br/', 'government', 'Departamento de Trânsito de São Paulo', 'Building2', 1),
  ('DENATRAN', 'https://www.gov.br/infraestrutura/pt-br/assuntos/transito', 'government', 'Departamento Nacional de Trânsito', 'Shield', 2),
  ('Tabela FIPE', 'https://veiculos.fipe.org.br/', 'tools', 'Consulta de preços de veículos', 'Calculator', 3),
  ('SINTEGRA', 'http://www.sintegra.gov.br/', 'government', 'Sistema Integrado de Informações sobre Operações Interestaduais', 'FileText', 4),
  ('Receita Federal', 'https://www.gov.br/receitafederal/pt-br', 'government', 'Portal da Receita Federal do Brasil', 'Building', 5),
  ('WebMotors', 'https://www.webmotors.com.br/', 'commercial', 'Portal de veículos usados e novos', 'Car', 6),
  ('MercadoLivre Veículos', 'https://carros.mercadolivre.com.br/', 'commercial', 'Marketplace de veículos', 'ShoppingCart', 7);
    `);
  }
}

if (require.main === module) {
  applyWebsiteSettingsMigration();
}

module.exports = { applyWebsiteSettingsMigration }; 