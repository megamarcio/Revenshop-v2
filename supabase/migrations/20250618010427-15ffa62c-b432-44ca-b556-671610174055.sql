
-- Adicionar campo is_urgent à tabela maintenance_records
ALTER TABLE public.maintenance_records 
ADD COLUMN is_urgent BOOLEAN NOT NULL DEFAULT FALSE;

-- Criar índice para consultas de manutenções urgentes
CREATE INDEX idx_maintenance_records_urgent ON public.maintenance_records(is_urgent) WHERE is_urgent = TRUE;
