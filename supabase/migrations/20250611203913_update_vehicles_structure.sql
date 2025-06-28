
-- Verificar a estrutura atual da tabela vehicles
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'vehicles' 
ORDER BY ordinal_position;

-- Adicionar campos de financiamento que estão faltando na tabela vehicles
ALTER TABLE vehicles 
ADD COLUMN IF NOT EXISTS financing_bank text,
ADD COLUMN IF NOT EXISTS financing_type text,
ADD COLUMN IF NOT EXISTS original_financed_name text,
ADD COLUMN IF NOT EXISTS purchase_date date,
ADD COLUMN IF NOT EXISTS due_date date,
ADD COLUMN IF NOT EXISTS installment_value numeric,
ADD COLUMN IF NOT EXISTS down_payment numeric,
ADD COLUMN IF NOT EXISTS financed_amount numeric,
ADD COLUMN IF NOT EXISTS total_installments integer,
ADD COLUMN IF NOT EXISTS paid_installments integer,
ADD COLUMN IF NOT EXISTS remaining_installments integer,
ADD COLUMN IF NOT EXISTS total_to_pay numeric,
ADD COLUMN IF NOT EXISTS payoff_value numeric,
ADD COLUMN IF NOT EXISTS payoff_date date,
ADD COLUMN IF NOT EXISTS interest_rate numeric,
ADD COLUMN IF NOT EXISTS custom_financing_bank text;
