-- Migration: Adiciona os campos plate e sunpass na tabela vehicles
-- Esta migração garante que os campos sejam criados corretamente

-- Adiciona os campos se não existirem
ALTER TABLE public.vehicles
ADD COLUMN IF NOT EXISTS plate TEXT,
ADD COLUMN IF NOT EXISTS sunpass TEXT;

-- Cria índices para melhor performance nas consultas (opcional)
CREATE INDEX IF NOT EXISTS idx_vehicles_plate ON public.vehicles(plate);
CREATE INDEX IF NOT EXISTS idx_vehicles_sunpass ON public.vehicles(sunpass);

-- Adiciona comentários para documentação
COMMENT ON COLUMN public.vehicles.plate IS 'Placa do veículo';
COMMENT ON COLUMN public.vehicles.sunpass IS 'Tag de pedágio SunPass do veículo'; 
