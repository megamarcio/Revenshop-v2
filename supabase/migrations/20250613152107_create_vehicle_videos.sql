
-- Primeiro, remover a função existente
DROP FUNCTION IF EXISTS public.get_ai_settings();

-- Recriar a função com o tipo de retorno correto
CREATE OR REPLACE FUNCTION public.get_ai_settings()
RETURNS TABLE(image_instructions text, description_instructions text, card_image_instructions text, openai_key text, gemini_key text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'pg_catalog'
AS $function$
BEGIN
  RETURN QUERY
  SELECT ai.image_instructions, ai.description_instructions, ai.card_image_instructions, ai.openai_key, ai.gemini_key
  FROM ai_settings ai
  LIMIT 1;
END;
$function$;

-- Agora atualizar a função save_ai_settings
DROP FUNCTION IF EXISTS public.save_ai_settings(text, text, text, text);

CREATE OR REPLACE FUNCTION public.save_ai_settings(
  p_image_instructions text, 
  p_description_instructions text, 
  p_card_image_instructions text DEFAULT NULL::text,
  p_openai_key text DEFAULT NULL::text, 
  p_gemini_key text DEFAULT NULL::text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  INSERT INTO ai_settings (image_instructions, description_instructions, card_image_instructions, openai_key, gemini_key)
  VALUES (p_image_instructions, p_description_instructions, p_card_image_instructions, p_openai_key, p_gemini_key)
  ON CONFLICT ((true))
  DO UPDATE SET
    image_instructions = p_image_instructions,
    description_instructions = p_description_instructions,
    card_image_instructions = COALESCE(p_card_image_instructions, ai_settings.card_image_instructions),
    openai_key = COALESCE(p_openai_key, ai_settings.openai_key),
    gemini_key = COALESCE(p_gemini_key, ai_settings.gemini_key),
    updated_at = timezone('utc'::text, now());
END;
$function$;

-- Criar tabela para vídeos dos veículos
CREATE TABLE IF NOT EXISTS public.vehicle_videos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
  video_url TEXT NOT NULL,
  prompt_used TEXT,
  file_name TEXT,
  file_size BIGINT,
  is_main BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar índice para performance
CREATE INDEX IF NOT EXISTS idx_vehicle_videos_vehicle_id ON public.vehicle_videos(vehicle_id);

-- Habilitar RLS (Row Level Security)
ALTER TABLE public.vehicle_videos ENABLE ROW LEVEL SECURITY;

-- Criar política para permitir acesso completo
DROP POLICY IF EXISTS "Enable all access for vehicle_videos" ON public.vehicle_videos;
CREATE POLICY "Enable all access for vehicle_videos" ON public.vehicle_videos
FOR ALL USING (true);

-- Criar bucket para vídeos se não existir
INSERT INTO storage.buckets (id, name, public)
VALUES ('vehicle-videos', 'vehicle-videos', true)
ON CONFLICT (id) DO NOTHING;

-- Adicionar coluna card_image_instructions na tabela ai_settings se não existir
ALTER TABLE public.ai_settings 
ADD COLUMN IF NOT EXISTS card_image_instructions TEXT;
