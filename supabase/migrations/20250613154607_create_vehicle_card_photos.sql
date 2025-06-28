
-- Criar bucket para imagens geradas pela IA
INSERT INTO storage.buckets (id, name, public)
VALUES ('imagens-ia', 'imagens-ia', true)
ON CONFLICT (id) DO NOTHING;

-- Criar bucket para vídeos gerados pela IA  
INSERT INTO storage.buckets (id, name, public)
VALUES ('videos-ia', 'videos-ia', true)
ON CONFLICT (id) DO NOTHING;

-- Política para permitir upload de imagens
CREATE POLICY "Allow authenticated users to upload images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'imagens-ia' AND 
  auth.role() = 'authenticated'
);

-- Política para permitir acesso público às imagens
CREATE POLICY "Allow public access to images" ON storage.objects
FOR SELECT USING (bucket_id = 'imagens-ia');

-- Política para permitir upload de vídeos
CREATE POLICY "Allow authenticated users to upload videos" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'videos-ia' AND 
  auth.role() = 'authenticated'
);

-- Política para permitir acesso público aos vídeos
CREATE POLICY "Allow public access to videos" ON storage.objects
FOR SELECT USING (bucket_id = 'videos-ia');

-- Criar tabela para fotos do card dos veículos se não existir
CREATE TABLE IF NOT EXISTS public.vehicle_card_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
  photo_url TEXT NOT NULL,
  prompt_used TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Adicionar RLS à tabela vehicle_card_photos
ALTER TABLE public.vehicle_card_photos ENABLE ROW LEVEL SECURITY;

-- Política para visualizar fotos do card
CREATE POLICY "Allow all to view card photos" ON public.vehicle_card_photos
FOR SELECT USING (true);

-- Política para inserir fotos do card (autenticados)
CREATE POLICY "Allow authenticated to insert card photos" ON public.vehicle_card_photos
FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Política para atualizar fotos do card (autenticados)
CREATE POLICY "Allow authenticated to update card photos" ON public.vehicle_card_photos
FOR UPDATE USING (auth.role() = 'authenticated');

-- Política para deletar fotos do card (autenticados)
CREATE POLICY "Allow authenticated to delete card photos" ON public.vehicle_card_photos
FOR DELETE USING (auth.role() = 'authenticated');
