
-- Corrigir o tipo do campo due_date para text (representa o dia do mês como string)
ALTER TABLE vehicles ALTER COLUMN due_date TYPE text;

-- Verificar se há storage bucket para fotos de veículos
INSERT INTO storage.buckets (id, name, public)
VALUES ('vehicle-photos', 'vehicle-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Remover políticas existentes se houver
DROP POLICY IF EXISTS "Allow authenticated users to upload vehicle photos" ON storage.objects;
DROP POLICY IF EXISTS "Allow public access to vehicle photos" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to update their own vehicle photos" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to delete their own vehicle photos" ON storage.objects;

-- Criar políticas RLS corretas para o bucket de fotos de veículos
CREATE POLICY "Allow authenticated users to upload vehicle photos" 
ON storage.objects FOR INSERT 
WITH CHECK (
  bucket_id = 'vehicle-photos' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Allow public access to vehicle photos" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'vehicle-photos');

CREATE POLICY "Allow users to update their own vehicle photos" 
ON storage.objects FOR UPDATE 
USING (bucket_id = 'vehicle-photos' AND auth.role() = 'authenticated');

CREATE POLICY "Allow users to delete their own vehicle photos" 
ON storage.objects FOR DELETE 
USING (bucket_id = 'vehicle-photos' AND auth.role() = 'authenticated');

-- Garantir que a tabela vehicle_photos tenha a estrutura correta
CREATE TABLE IF NOT EXISTS vehicle_photos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  position INTEGER DEFAULT 1,
  is_main BOOLEAN DEFAULT false
);

-- Verificar se há índices necessários
CREATE INDEX IF NOT EXISTS idx_vehicle_photos_vehicle_id ON vehicle_photos(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_vehicle_photos_position ON vehicle_photos(vehicle_id, position);
