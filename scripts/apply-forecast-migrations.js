/**
 * Script para aplicar as migrações de forecasts manualmente
 * Execute este script no SQL Editor do Supabase
 * 
 * Este script:
 * 1. Cria/corrige as tabelas expense_forecasts e revenue_forecasts
 * 2. Configura os índices para performance
 * 3. Configura as políticas RLS
 * 4. Permite que os filtros funcionem corretamente
 */

console.log('🚀 Script para aplicar migrações de Forecasts no Supabase');
console.log('');
console.log('📋 INSTRUÇÕES:');
console.log('1. Vá para o Dashboard do Supabase');
console.log('2. Abra o SQL Editor');
console.log('3. Execute os comandos SQL abaixo na ordem:');
console.log('');

const migrations = [
  {
    name: 'Criação/Correção da tabela expense_forecasts',
    sql: `
-- Fix expense_forecasts table structure
-- This migration fixes the category column to use category_id as foreign key

-- Drop the existing table if it exists (only if empty or in development)
DROP TABLE IF EXISTS expense_forecasts CASCADE;

-- Create expense_forecasts table with correct structure
CREATE TABLE expense_forecasts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  description text NOT NULL,
  amount numeric(10,2) NOT NULL,
  type text NOT NULL CHECK (type IN ('fixa', 'variavel')),
  category_id uuid REFERENCES financial_categories(id),
  due_day integer NOT NULL CHECK (due_day >= 1 AND due_day <= 31),
  is_active boolean DEFAULT true,
  notes text,
  import_category text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  created_by uuid REFERENCES profiles(id)
);

-- Create index for better performance
CREATE INDEX idx_expense_forecasts_type ON expense_forecasts(type);
CREATE INDEX idx_expense_forecasts_category_id ON expense_forecasts(category_id);
CREATE INDEX idx_expense_forecasts_is_active ON expense_forecasts(is_active);
CREATE INDEX idx_expense_forecasts_created_at ON expense_forecasts(created_at);
CREATE INDEX idx_expense_forecasts_due_day ON expense_forecasts(due_day);

-- Enable RLS
ALTER TABLE expense_forecasts ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view all expense forecasts" ON expense_forecasts
  FOR SELECT USING (true);

CREATE POLICY "Users can insert expense forecasts" ON expense_forecasts
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update expense forecasts" ON expense_forecasts
  FOR UPDATE USING (true);

CREATE POLICY "Users can delete expense forecasts" ON expense_forecasts
  FOR DELETE USING (true);

-- Add comment for documentation
COMMENT ON TABLE expense_forecasts IS 'Tabela para armazenar previsões de despesas mensais fixas e variáveis';
COMMENT ON COLUMN expense_forecasts.category_id IS 'Referência para a categoria financeira na tabela financial_categories';
COMMENT ON COLUMN expense_forecasts.due_day IS 'Dia do mês (1-31) quando a despesa vence';
COMMENT ON COLUMN expense_forecasts.import_category IS 'Categoria para importação e mapeamento de dados externos';
`
  },
  {
    name: 'Criação da tabela revenue_forecasts',
    sql: `
-- Create revenue_forecasts table
-- This table stores monthly revenue forecasts (fixed and variable)

CREATE TABLE IF NOT EXISTS revenue_forecasts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  description text NOT NULL,
  amount numeric(10,2) NOT NULL,
  type text NOT NULL CHECK (type IN ('fixa', 'variavel')),
  category_id uuid REFERENCES financial_categories(id),
  due_day integer NOT NULL CHECK (due_day >= 1 AND due_day <= 31),
  is_active boolean DEFAULT true,
  notes text,
  import_category text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  created_by uuid REFERENCES profiles(id)
);

-- Create index for better performance
CREATE INDEX idx_revenue_forecasts_type ON revenue_forecasts(type);
CREATE INDEX idx_revenue_forecasts_category_id ON revenue_forecasts(category_id);
CREATE INDEX idx_revenue_forecasts_is_active ON revenue_forecasts(is_active);
CREATE INDEX idx_revenue_forecasts_created_at ON revenue_forecasts(created_at);
CREATE INDEX idx_revenue_forecasts_due_day ON revenue_forecasts(due_day);

-- Enable RLS
ALTER TABLE revenue_forecasts ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view all revenue forecasts" ON revenue_forecasts
  FOR SELECT USING (true);

CREATE POLICY "Users can insert revenue forecasts" ON revenue_forecasts
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update revenue forecasts" ON revenue_forecasts
  FOR UPDATE USING (true);

CREATE POLICY "Users can delete revenue forecasts" ON revenue_forecasts
  FOR DELETE USING (true);

-- Add comment for documentation
COMMENT ON TABLE revenue_forecasts IS 'Tabela para armazenar previsões de receitas mensais fixas e variáveis';
COMMENT ON COLUMN revenue_forecasts.category_id IS 'Referência para a categoria financeira na tabela financial_categories';
COMMENT ON COLUMN revenue_forecasts.due_day IS 'Dia do mês (1-31) quando a receita é esperada';
COMMENT ON COLUMN revenue_forecasts.import_category IS 'Categoria para importação e mapeamento de dados externos';
`
  },
  {
    name: 'Inserir dados de exemplo',
    sql: `
-- Inserir algumas categorias padrão se não existirem
INSERT INTO financial_categories (name, type, is_default) 
VALUES 
  ('Aluguel', 'despesa', true),
  ('Utilidades', 'despesa', true),
  ('Material de Escritório', 'despesa', true),
  ('Vendas de Veículos', 'receita', true),
  ('Serviços Adicionais', 'receita', true)
ON CONFLICT (name, type) DO NOTHING;

-- Inserir algumas previsões de exemplo (opcional)
INSERT INTO expense_forecasts (description, amount, type, category_id, due_day, notes)
SELECT 
  'Aluguel do Escritório',
  2500.00,
  'fixa',
  fc.id,
  5,
  'Pagamento mensal do aluguel do escritório'
FROM financial_categories fc 
WHERE fc.name = 'Aluguel' AND fc.type = 'despesa'
ON CONFLICT DO NOTHING;

INSERT INTO expense_forecasts (description, amount, type, category_id, due_day, notes)
SELECT 
  'Internet e Telefone',
  150.00,
  'fixa',
  fc.id,
  10,
  'Pacote empresarial de telecomunicações'
FROM financial_categories fc 
WHERE fc.name = 'Utilidades' AND fc.type = 'despesa'
ON CONFLICT DO NOTHING;

INSERT INTO revenue_forecasts (description, amount, type, category_id, due_day, notes)
SELECT 
  'Aluguel de Veículos',
  5000.00,
  'fixa',
  fc.id,
  1,
  'Receita média mensal de aluguel'
FROM financial_categories fc 
WHERE fc.name = 'Vendas de Veículos' AND fc.type = 'receita'
ON CONFLICT DO NOTHING;
`
  }
];

console.log('═══════════════════════════════════════════════════════════════');
console.log('');

migrations.forEach((migration, index) => {
  console.log(`🔹 MIGRAÇÃO ${index + 1}: ${migration.name}`);
  console.log('═══════════════════════════════════════════════════════════════');
  console.log(migration.sql.trim());
  console.log('');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('');
});

console.log('✅ APÓS EXECUTAR AS MIGRAÇÕES:');
console.log('1. Vá para Settings > API');
console.log('2. Regenere os types do TypeScript');
console.log('3. Atualize o arquivo src/integrations/supabase/types.ts');
console.log('4. Reinicie o servidor de desenvolvimento');
console.log('');
console.log('🎯 RESULTADO ESPERADO:');
console.log('- Tabelas expense_forecasts e revenue_forecasts criadas');
console.log('- Filtros funcionando corretamente');
console.log('- Sem erros de TypeScript');
console.log('- Dados carregados do Supabase em vez do localStorage'); 