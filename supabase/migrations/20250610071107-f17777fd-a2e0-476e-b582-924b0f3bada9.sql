
-- Remover a função existente primeiro
DROP FUNCTION IF EXISTS get_ai_settings();

-- Remover a função save_ai_settings existente também
DROP FUNCTION IF EXISTS save_ai_settings(TEXT, TEXT);

-- Criar tabela para armazenar registros de manutenção
CREATE TABLE public.maintenance_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE CASCADE NOT NULL,
  detection_date DATE NOT NULL,
  repair_date DATE NOT NULL,
  maintenance_type TEXT NOT NULL CHECK (maintenance_type IN ('preventive', 'corrective', 'bodyshop')),
  maintenance_items TEXT[] NOT NULL DEFAULT '{}',
  custom_maintenance TEXT,
  details TEXT,
  mechanic_name TEXT NOT NULL,
  mechanic_phone TEXT NOT NULL,
  parts JSONB NOT NULL DEFAULT '[]',
  labor JSONB NOT NULL DEFAULT '[]',
  total_amount NUMERIC NOT NULL DEFAULT 0,
  receipt_urls TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS na tabela de manutenção
ALTER TABLE public.maintenance_records ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para maintenance_records
CREATE POLICY "Users can view all maintenance records" 
  ON public.maintenance_records 
  FOR SELECT 
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert maintenance records" 
  ON public.maintenance_records 
  FOR INSERT 
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own maintenance records" 
  ON public.maintenance_records 
  FOR UPDATE 
  TO authenticated
  USING (auth.uid() = created_by);

CREATE POLICY "Users can delete their own maintenance records" 
  ON public.maintenance_records 
  FOR DELETE 
  TO authenticated
  USING (auth.uid() = created_by);

-- Adicionar campos openai_key e gemini_key na tabela ai_settings
ALTER TABLE public.ai_settings 
ADD COLUMN IF NOT EXISTS openai_key TEXT,
ADD COLUMN IF NOT EXISTS gemini_key TEXT;

-- Criar função para buscar configurações de IA incluindo as chaves
CREATE OR REPLACE FUNCTION get_ai_settings()
RETURNS TABLE (
  image_instructions TEXT,
  description_instructions TEXT,
  openai_key TEXT,
  gemini_key TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT ai.image_instructions, ai.description_instructions, ai.openai_key, ai.gemini_key
  FROM ai_settings ai
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Criar função para salvar configurações de IA incluindo as chaves
CREATE OR REPLACE FUNCTION save_ai_settings(
  p_image_instructions TEXT,
  p_description_instructions TEXT,
  p_openai_key TEXT DEFAULT NULL,
  p_gemini_key TEXT DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO ai_settings (image_instructions, description_instructions, openai_key, gemini_key)
  VALUES (p_image_instructions, p_description_instructions, p_openai_key, p_gemini_key)
  ON CONFLICT ((true))
  DO UPDATE SET
    image_instructions = p_image_instructions,
    description_instructions = p_description_instructions,
    openai_key = COALESCE(p_openai_key, ai_settings.openai_key),
    gemini_key = COALESCE(p_gemini_key, ai_settings.gemini_key),
    updated_at = timezone('utc'::text, now());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_maintenance_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER maintenance_records_updated_at
    BEFORE UPDATE ON public.maintenance_records
    FOR EACH ROW
    EXECUTE FUNCTION update_maintenance_updated_at();

-- Conceder permissões
GRANT ALL ON public.maintenance_records TO authenticated;
GRANT EXECUTE ON FUNCTION get_ai_settings() TO authenticated;
GRANT EXECUTE ON FUNCTION save_ai_settings(TEXT, TEXT, TEXT, TEXT) TO authenticated;
