-- Verifica e corrige a estrutura da tabela reservations
-- Remove qualquer campo que não deveria estar na tabela

-- Primeiro, vamos verificar se existem campos desnecessários e removê-los
DO $$
BEGIN
    -- Remove return_date se existir
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'reservations' AND column_name = 'return_date'
    ) THEN
        ALTER TABLE reservations DROP COLUMN return_date;
        RAISE NOTICE 'Campo return_date removido da tabela reservations';
    END IF;

    -- Remove pick_up_date se existir
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'reservations' AND column_name = 'pick_up_date'
    ) THEN
        ALTER TABLE reservations DROP COLUMN pick_up_date;
        RAISE NOTICE 'Campo pick_up_date removido da tabela reservations';
    END IF;

    -- Remove qualquer outro campo de data que não deveria estar aqui
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'reservations' AND column_name = 'pickup_date'
    ) THEN
        ALTER TABLE reservations DROP COLUMN pickup_date;
        RAISE NOTICE 'Campo pickup_date removido da tabela reservations';
    END IF;

    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'reservations' AND column_name = 'pick_up_datetime'
    ) THEN
        ALTER TABLE reservations DROP COLUMN pick_up_datetime;
        RAISE NOTICE 'Campo pick_up_datetime removido da tabela reservations';
    END IF;

    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'reservations' AND column_name = 'return_datetime'
    ) THEN
        ALTER TABLE reservations DROP COLUMN return_datetime;
        RAISE NOTICE 'Campo return_datetime removido da tabela reservations';
    END IF;

    -- Garante que os campos necessários existem
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'reservations' AND column_name = 'temperature'
    ) THEN
        ALTER TABLE reservations ADD COLUMN temperature text NULL;
        RAISE NOTICE 'Campo temperature adicionado à tabela reservations';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'reservations' AND column_name = 'notes'
    ) THEN
        ALTER TABLE reservations ADD COLUMN notes text NULL;
        RAISE NOTICE 'Campo notes adicionado à tabela reservations';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'reservations' AND column_name = 'assigned_to'
    ) THEN
        ALTER TABLE reservations ADD COLUMN assigned_to uuid NULL;
        RAISE NOTICE 'Campo assigned_to adicionado à tabela reservations';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'reservations' AND column_name = 'delegated_to_user_id'
    ) THEN
        ALTER TABLE reservations ADD COLUMN delegated_to_user_id uuid NULL;
        RAISE NOTICE 'Campo delegated_to_user_id adicionado à tabela reservations';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'reservations' AND column_name = 'contact_stage'
    ) THEN
        ALTER TABLE reservations ADD COLUMN contact_stage text NULL;
        RAISE NOTICE 'Campo contact_stage adicionado à tabela reservations';
    END IF;

END $$; 