-- Adicionar coluna import_category na tabela de receitas
ALTER TABLE public.revenues 
ADD COLUMN IF NOT EXISTS import_category TEXT;

-- Adicionar coluna import_category na tabela de despesas
ALTER TABLE public.expenses 
ADD COLUMN IF NOT EXISTS import_category TEXT;

-- Adicionar coluna import_category na tabela de previsões de despesas
ALTER TABLE public.expense_forecasts 
ADD COLUMN IF NOT EXISTS import_category TEXT;

-- Comentários explicativos
COMMENT ON COLUMN public.revenues.import_category IS 'Categoria para importação e mapeamento de dados externos';
COMMENT ON COLUMN public.expenses.import_category IS 'Categoria para importação e mapeamento de dados externos';
COMMENT ON COLUMN public.expense_forecasts.import_category IS 'Categoria para importação e mapeamento de dados externos'; 