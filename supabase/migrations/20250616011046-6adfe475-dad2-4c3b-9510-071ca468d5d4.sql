
-- Adicionar campos Placa e Sunpass na tabela vehicles
ALTER TABLE vehicles 
ADD COLUMN IF NOT EXISTS plate text,
ADD COLUMN IF NOT EXISTS sunpass text;
