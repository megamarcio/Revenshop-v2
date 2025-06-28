-- Criar tabela de previsões de receitas
CREATE TABLE IF NOT EXISTS public.revenue_forecasts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    description TEXT NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    type TEXT CHECK (type IN ('fixa', 'variavel')) NOT NULL DEFAULT 'fixa',
    category_id UUID REFERENCES public.financial_categories(id),
    due_day INTEGER CHECK (due_day >= 1 AND due_day <= 31) NOT NULL DEFAULT 1,
    is_active BOOLEAN NOT NULL DEFAULT true,
    notes TEXT,
    import_category TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_revenue_forecasts_type ON public.revenue_forecasts(type);
CREATE INDEX IF NOT EXISTS idx_revenue_forecasts_is_active ON public.revenue_forecasts(is_active);
CREATE INDEX IF NOT EXISTS idx_revenue_forecasts_category_id ON public.revenue_forecasts(category_id);
CREATE INDEX IF NOT EXISTS idx_revenue_forecasts_due_day ON public.revenue_forecasts(due_day);

-- Adicionar RLS (Row Level Security)
ALTER TABLE public.revenue_forecasts ENABLE ROW LEVEL SECURITY;

-- Criar políticas de segurança
CREATE POLICY "Users can view own revenue forecasts" ON public.revenue_forecasts
    FOR SELECT USING (true);

CREATE POLICY "Users can insert own revenue forecasts" ON public.revenue_forecasts
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update own revenue forecasts" ON public.revenue_forecasts
    FOR UPDATE USING (true);

CREATE POLICY "Users can delete own revenue forecasts" ON public.revenue_forecasts
    FOR DELETE USING (true);

-- Comentários
COMMENT ON TABLE public.revenue_forecasts IS 'Tabela para previsões de receitas fixas e variáveis';
COMMENT ON COLUMN public.revenue_forecasts.description IS 'Descrição da previsão de receita';
COMMENT ON COLUMN public.revenue_forecasts.amount IS 'Valor da receita prevista';
COMMENT ON COLUMN public.revenue_forecasts.type IS 'Tipo da receita: fixa ou variável';
COMMENT ON COLUMN public.revenue_forecasts.category_id IS 'Categoria financeira da receita';
COMMENT ON COLUMN public.revenue_forecasts.due_day IS 'Dia do mês para recebimento (1-31)';
COMMENT ON COLUMN public.revenue_forecasts.is_active IS 'Se a previsão está ativa';
COMMENT ON COLUMN public.revenue_forecasts.notes IS 'Observações sobre a previsão';
COMMENT ON COLUMN public.revenue_forecasts.import_category IS 'Categoria para importação de dados'; 