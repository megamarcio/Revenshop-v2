
-- Alterar a coluna repair_date para permitir valores nulos
ALTER TABLE public.maintenance_records 
ALTER COLUMN repair_date DROP NOT NULL;

-- Também adicionar uma nova coluna promised_date que estava faltando
ALTER TABLE public.maintenance_records 
ADD COLUMN IF NOT EXISTS promised_date date;
