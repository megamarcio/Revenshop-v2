-- Fix expense_forecasts table structure
-- This migration fixes the category column to use category_id as foreign key

-- Drop the existing table if it exists (only if empty or in development)
DROP TABLE IF EXISTS expense_forecasts CASCADE;

-- Create expense_forecasts table with correct structure
CREATE TABLE IF NOT EXISTS expense_forecasts (
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