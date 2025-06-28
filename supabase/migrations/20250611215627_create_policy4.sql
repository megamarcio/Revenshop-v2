
-- Criar bucket para novas fotos de veículos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types) 
VALUES (
  'vehicles-photos-new', 
  'vehicles-photos-new', 
  true, 
  1048576, -- 1MB em bytes
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
);

-- Política para permitir upload de fotos (usuários autenticados)
CREATE POLICY "Allow authenticated users to upload new vehicle photos" 
ON storage.objects FOR INSERT 
WITH CHECK (
  bucket_id = 'vehicles-photos-new' 
  AND auth.role() = 'authenticated'
);

-- Política para permitir visualização pública das fotos
CREATE POLICY "Allow public access to new vehicle photos" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'vehicles-photos-new');

-- Política para permitir atualização das fotos
CREATE POLICY "Allow users to update their own new vehicle photos" 
ON storage.objects FOR UPDATE 
USING (bucket_id = 'vehicles-photos-new' AND auth.role() = 'authenticated');

-- Política para permitir exclusão das fotos
CREATE POLICY "Allow users to delete their own new vehicle photos" 
ON storage.objects FOR DELETE 
USING (bucket_id = 'vehicles-photos-new' AND auth.role() = 'authenticated');
