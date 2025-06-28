
-- Criar bucket público para fotos de veículos se não existir
INSERT INTO storage.buckets (id, name, public) 
VALUES ('vehicle-photos', 'vehicle-photos', true)
ON CONFLICT (id) DO UPDATE SET 
  public = true;

-- Política para permitir upload de fotos (usuários autenticados)
DROP POLICY IF EXISTS "Allow authenticated users to upload vehicle photos" ON storage.objects;
CREATE POLICY "Allow authenticated users to upload vehicle photos" 
ON storage.objects FOR INSERT 
WITH CHECK (
  bucket_id = 'vehicle-photos' 
  AND auth.role() = 'authenticated'
);

-- Política para permitir visualização pública das fotos
DROP POLICY IF EXISTS "Allow public access to vehicle photos" ON storage.objects;
CREATE POLICY "Allow public access to vehicle photos" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'vehicle-photos');

-- Política para permitir atualização das fotos
DROP POLICY IF EXISTS "Allow users to update their own vehicle photos" ON storage.objects;
CREATE POLICY "Allow users to update their own vehicle photos" 
ON storage.objects FOR UPDATE 
USING (bucket_id = 'vehicle-photos' AND auth.role() = 'authenticated');

-- Política para permitir exclusão das fotos
DROP POLICY IF EXISTS "Allow users to delete their own vehicle photos" ON storage.objects;
CREATE POLICY "Allow users to delete their own vehicle photos" 
ON storage.objects FOR DELETE 
USING (bucket_id = 'vehicle-photos' AND auth.role() = 'authenticated');
