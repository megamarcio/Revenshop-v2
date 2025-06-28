-- Ativa o RLS na tabela reservations
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;

-- Remove policies antigas se existirem
DROP POLICY IF EXISTS "Allow all for authenticated users" ON reservations;
DROP POLICY IF EXISTS "Allow insert/update for authenticated users" ON reservations;
DROP POLICY IF EXISTS "Allow update for authenticated users" ON reservations;
DROP POLICY IF EXISTS "Allow upsert for authenticated users" ON reservations;

-- Permite SELECT, INSERT, UPDATE e UPSERT para usuários autenticados
CREATE POLICY "Allow all for authenticated users" ON reservations
  FOR ALL
  USING (auth.role() = 'authenticated'); 