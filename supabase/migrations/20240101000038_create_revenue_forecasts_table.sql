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
WHERE fc.name = 'Aluguel' AND fc.type = 'despesa';

INSERT INTO expense_forecasts (description, amount, type, category_id, due_day, notes)
SELECT
  'Internet e Telefone',
  150.00,
  'fixa',
  fc.id,
  10,
  'Pacote empresarial de telecomunicações'
FROM financial_categories fc
WHERE fc.name = 'Utilidades' AND fc.type = 'despesa';

INSERT INTO revenue_forecasts (description, amount, type, category_id, due_day, notes)
SELECT
  'Aluguel de Veículos',
  5000.00,
  'fixa',
  fc.id,
  1,
  'Receita média mensal de aluguel'
FROM financial_categories fc
WHERE fc.name = 'Vendas de Veículos' AND fc.type = 'receita';