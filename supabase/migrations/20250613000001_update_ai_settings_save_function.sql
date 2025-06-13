
-- Atualizar função para incluir card_image_instructions
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

-- Atualizar função get_ai_settings para incluir o novo campo
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
