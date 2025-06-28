
-- Limpar dados existentes da tabela vehicle_card_photos para começar do zero
DELETE FROM public.vehicle_card_photos;

-- Recriar as políticas de storage para o bucket vehicles-photos-new
DROP POLICY IF EXISTS "Allow authenticated users to upload new vehicle photos" ON storage.objects;
DROP POLICY IF EXISTS "Allow public access to new vehicle photos" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to update their own new vehicle photos" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to delete their own new vehicle photos" ON storage.objects;

-- Criar políticas corretas para o bucket
CREATE POLICY "Allow authenticated users to upload card photos" 
ON storage.objects FOR INSERT 
WITH CHECK (
  bucket_id = 'vehicles-photos-new' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Allow public access to card photos" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'vehicles-photos-new');

CREATE POLICY "Allow users to update card photos" 
ON storage.objects FOR UPDATE 
USING (bucket_id = 'vehicles-photos-new' AND auth.role() = 'authenticated');

CREATE POLICY "Allow users to delete card photos" 
ON storage.objects FOR DELETE 
USING (bucket_id = 'vehicles-photos-new' AND auth.role() = 'authenticated');

-- Garantir que a tabela vehicle_card_photos tenha a estrutura correta
DROP TABLE IF EXISTS public.vehicle_card_photos CASCADE;

CREATE TABLE public.vehicle_card_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
  photo_url TEXT NOT NULL,
  prompt_used TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.vehicle_card_photos ENABLE ROW LEVEL SECURITY;

-- Políticas para a tabela
CREATE POLICY "Allow all to view card photos" ON public.vehicle_card_photos
FOR SELECT USING (true);

CREATE POLICY "Allow authenticated to insert card photos" ON public.vehicle_card_photos
FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated to update card photos" ON public.vehicle_card_photos
FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated to delete card photos" ON public.vehicle_card_photos
FOR DELETE USING (auth.role() = 'authenticated');

-- Criar índice para performance
CREATE INDEX IF NOT EXISTS idx_vehicle_card_photos_vehicle_id ON public.vehicle_card_photos(vehicle_id);
