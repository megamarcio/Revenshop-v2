-- Migration: Corrige problemas com os campos plate e sunpass
-- Esta migração garante que os campos funcionem corretamente

-- Primeiro, vamos verificar se os campos existem e recriá-los se necessário
DO $$
BEGIN
    -- Verifica se o campo plate existe
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public' 
                   AND table_name = 'vehicles' 
                   AND column_name = 'plate') THEN
        ALTER TABLE public.vehicles ADD COLUMN plate TEXT;
    END IF;
    
    -- Verifica se o campo sunpass existe
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public' 
                   AND table_name = 'vehicles' 
                   AND column_name = 'sunpass') THEN
        ALTER TABLE public.vehicles ADD COLUMN sunpass TEXT;
    END IF;
END $$;

-- Garante que os campos sejam nullable (podem ser NULL)
ALTER TABLE public.vehicles 
ALTER COLUMN plate DROP NOT NULL,
ALTER COLUMN sunpass DROP NOT NULL;

-- Remove e recria os índices para garantir que funcionem
DROP INDEX IF EXISTS idx_vehicles_plate;
DROP INDEX IF EXISTS idx_vehicles_sunpass;

CREATE INDEX idx_vehicles_plate ON public.vehicles(plate) WHERE plate IS NOT NULL;
CREATE INDEX idx_vehicles_sunpass ON public.vehicles(sunpass) WHERE sunpass IS NOT NULL;

-- Adiciona/atualiza comentários
COMMENT ON COLUMN public.vehicles.plate IS 'Placa do veículo (campo opcional)';
COMMENT ON COLUMN public.vehicles.sunpass IS 'Tag de pedágio SunPass do veículo (campo opcional)';

-- Testa se é possível inserir/atualizar dados nos campos
DO $$
DECLARE
    test_vehicle_id UUID;
    test_count INTEGER;
BEGIN
    -- Cria um veículo de teste
    INSERT INTO public.vehicles (
        name, vin, year, model, miles, internal_code, color, 
        purchase_price, sale_price, plate, sunpass
    ) VALUES (
        'Test Vehicle', 'TEST123456789', 2023, 'Test Model', 0, 'TEST001', 'Test Color',
        1000, 1500, 'TEST-123', 'TESTPASS123'
    ) RETURNING id INTO test_vehicle_id;
    
    -- Verifica se os dados foram inseridos corretamente
    SELECT COUNT(*) INTO test_count
    FROM public.vehicles 
    WHERE id = test_vehicle_id 
    AND plate = 'TEST-123' 
    AND sunpass = 'TESTPASS123';
    
    IF test_count = 0 THEN
        RAISE EXCEPTION 'Failed to insert test data with plate and sunpass';
    END IF;
    
    -- Testa atualização
    UPDATE public.vehicles 
    SET plate = 'TEST-456', sunpass = 'TESTPASS456'
    WHERE id = test_vehicle_id;
    
    -- Verifica se a atualização funcionou
    SELECT COUNT(*) INTO test_count
    FROM public.vehicles 
    WHERE id = test_vehicle_id 
    AND plate = 'TEST-456' 
    AND sunpass = 'TESTPASS456';
    
    IF test_count = 0 THEN
        RAISE EXCEPTION 'Failed to update test data with plate and sunpass';
    END IF;
    
    -- Remove o veículo de teste
    DELETE FROM public.vehicles WHERE id = test_vehicle_id;
    
    RAISE NOTICE 'Plate and sunpass fields are working correctly';
END $$; 