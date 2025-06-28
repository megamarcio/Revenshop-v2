-- Create RPC function to get AI settings
DROP FUNCTION IF EXISTS get_ai_settings();
CREATE OR REPLACE FUNCTION get_ai_settings()
RETURNS TABLE (
  image_instructions TEXT,
  description_instructions TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT ai.image_instructions, ai.description_instructions
  FROM ai_settings ai
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create RPC function to save AI settings
CREATE OR REPLACE FUNCTION save_ai_settings(
  p_image_instructions TEXT,
  p_description_instructions TEXT
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO ai_settings (image_instructions, description_instructions)
  VALUES (p_image_instructions, p_description_instructions)
  ON CONFLICT ((true))
  DO UPDATE SET
    image_instructions = p_image_instructions,
    description_instructions = p_description_instructions,
    updated_at = timezone('utc'::text, now());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION get_ai_settings() TO authenticated;
GRANT EXECUTE ON FUNCTION save_ai_settings(TEXT, TEXT) TO authenticated;
