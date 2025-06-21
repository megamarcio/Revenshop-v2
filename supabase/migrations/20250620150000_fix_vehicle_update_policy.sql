-- Habilita RLS na tabela vehicles se ainda não estiver habilitado
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;

-- Remove políticas antigas para evitar conflitos
DROP POLICY IF EXISTS "Enable all access for authenticated users" ON public.vehicles;

-- Cria uma política que permite acesso total (SELECT, INSERT, UPDATE, DELETE)
-- para qualquer usuário autenticado na tabela de veículos.
-- Isso inclui especificamente os campos plate e sunpass
CREATE POLICY "Enable all access for authenticated users"
ON public.vehicles
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Garantir que não há políticas restritivas específicas para plate/sunpass
DROP POLICY IF EXISTS "plate_update_policy" ON public.vehicles;
DROP POLICY IF EXISTS "sunpass_update_policy" ON public.vehicles;

-- Verifica se a política foi criada corretamente
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'vehicles' 
        AND policyname = 'Enable all access for authenticated users'
    ) THEN
        RAISE EXCEPTION 'Failed to create vehicle access policy';
    END IF;
END $$; 