-- Remove todas as policies da tabela reservations
DROP POLICY IF EXISTS "Allow all for authenticated users" ON reservations;
DROP POLICY IF EXISTS "Allow insert/update for authenticated users" ON reservations;
DROP POLICY IF EXISTS "Allow update for authenticated users" ON reservations;
DROP POLICY IF EXISTS "Allow upsert for authenticated users" ON reservations;
DROP POLICY IF EXISTS "Allow select for authenticated users" ON reservations;

-- Remove constraints, triggers ou índices ligados à coluna return_date
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT constraint_name FROM information_schema.constraint_column_usage WHERE table_name = 'reservations' AND column_name = 'return_date') LOOP
        EXECUTE 'ALTER TABLE reservations DROP CONSTRAINT ' || r.constraint_name || ' CASCADE';
    END LOOP;
END $$;

-- Remove a coluna return_date se existir
ALTER TABLE reservations DROP COLUMN IF EXISTS return_date;
-- Remove a coluna pick_up_date se existir
ALTER TABLE reservations DROP COLUMN IF EXISTS pick_up_date;

-- Recria a policy de acesso para usuários autenticados
CREATE POLICY "Allow all for authenticated users" ON reservations
  FOR ALL
  USING (auth.role() = 'authenticated'); 