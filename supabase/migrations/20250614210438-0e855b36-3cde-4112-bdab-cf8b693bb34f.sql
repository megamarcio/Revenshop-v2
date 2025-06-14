
-- Primeiro remove a versão antiga da função get_ai_settings
DROP FUNCTION IF EXISTS public.get_ai_settings;

-- Adiciona a coluna rapidapi_key à tabela ai_settings
ALTER TABLE public.ai_settings ADD COLUMN IF NOT EXISTS rapidapi_key text;

-- Recria a função get_ai_settings com rapidapi_key
CREATE OR REPLACE FUNCTION public.get_ai_settings()
RETURNS TABLE(
  image_instructions text,
  description_instructions text,
  card_image_instructions text,
  video_instructions text,
  openai_key text,
  gemini_key text,
  rapidapi_key text
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ai.image_instructions, 
    ai.description_instructions, 
    ai.card_image_instructions, 
    ai.video_instructions, 
    ai.openai_key, 
    ai.gemini_key,
    ai.rapidapi_key
  FROM ai_settings ai
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Atualiza a função save_ai_settings para aceitar a rapidapi_key
CREATE OR REPLACE FUNCTION public.save_ai_settings(
  p_image_instructions text,
  p_description_instructions text,
  p_card_image_instructions text DEFAULT NULL::text,
  p_video_instructions text DEFAULT NULL::text,
  p_openai_key text DEFAULT NULL::text,
  p_gemini_key text DEFAULT NULL::text,
  p_rapidapi_key text DEFAULT NULL::text
)
RETURNS void AS $$
BEGIN
  INSERT INTO ai_settings (
    image_instructions, 
    description_instructions, 
    card_image_instructions, 
    video_instructions, 
    openai_key, 
    gemini_key,
    rapidapi_key
  )
  VALUES (
    p_image_instructions, 
    p_description_instructions, 
    p_card_image_instructions, 
    p_video_instructions, 
    p_openai_key, 
    p_gemini_key,
    p_rapidapi_key
  )
  ON CONFLICT ((true))
  DO UPDATE SET
    image_instructions = p_image_instructions,
    description_instructions = p_description_instructions,
    card_image_instructions = COALESCE(p_card_image_instructions, ai_settings.card_image_instructions),
    video_instructions = COALESCE(p_video_instructions, ai_settings.video_instructions),
    openai_key = COALESCE(p_openai_key, ai_settings.openai_key),
    gemini_key = COALESCE(p_gemini_key, ai_settings.gemini_key),
    rapidapi_key = COALESCE(p_rapidapi_key, ai_settings.rapidapi_key),
    updated_at = timezone('utc'::text, now());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
