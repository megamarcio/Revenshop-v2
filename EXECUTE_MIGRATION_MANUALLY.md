# Executar Migração Manualmente no Painel Supabase

## Problema
A migração via CLI não está funcionando devido a problemas com nomes de arquivos de migrações antigas. A tabela `import_data` foi marcada como criada, mas não existe fisicamente no banco.

## Solução
Execute o SQL abaixo diretamente no **SQL Editor** do painel Supabase:

### 1. Acesse o Painel Supabase
- URL: https://supabase.com/dashboard/project/ctdajbfmgmkhqueskjvk
- Vá em **SQL Editor**

### 2. Execute o SQL Completo

```sql
-- Criar tabela para armazenar dados de importação pendentes
CREATE TABLE IF NOT EXISTS import_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  original_date DATE NOT NULL,
  original_amount DECIMAL(12,2) NOT NULL,
  original_business TEXT NOT NULL,
  original_category TEXT,
  transaction_id TEXT,
  account TEXT,
  status TEXT CHECK (status IN ('Fixa', 'Variavel')),
  -- Campos de classificação
  classified_type TEXT CHECK (classified_type IN ('receita', 'despesa')),
  classified_destination TEXT CHECK (classified_destination IN ('pontual', 'previsao')),
  category_id UUID REFERENCES financial_categories(id) ON DELETE SET NULL,
  due_day INTEGER CHECK (due_day BETWEEN 1 AND 31),
  -- Campos de IA
  ai_summary TEXT,
  ai_summary_applied BOOLEAN DEFAULT false,
  -- Campos de controle
  is_imported BOOLEAN DEFAULT false,
  imported_at TIMESTAMP WITH TIME ZONE,
  imported_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Adicionar campo para instruções de resumo de IA na tabela ai_settings
ALTER TABLE public.ai_settings 
ADD COLUMN IF NOT EXISTS summary_instructions TEXT DEFAULT 'Resuma esta descrição financeira em até 50 caracteres, mantendo as informações mais importantes e removendo detalhes desnecessários. Seja conciso e claro.';

-- Atualizar função get_ai_settings para incluir summary_instructions
DROP FUNCTION IF EXISTS public.get_ai_settings();

CREATE OR REPLACE FUNCTION public.get_ai_settings()
RETURNS TABLE(
  image_instructions text,
  description_instructions text,
  card_image_instructions text,
  video_instructions text,
  summary_instructions text,
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
    ai.summary_instructions,
    ai.openai_key, 
    ai.gemini_key,
    ai.rapidapi_key
  FROM ai_settings ai
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Atualizar função save_ai_settings para incluir summary_instructions
CREATE OR REPLACE FUNCTION public.save_ai_settings(
  p_image_instructions text,
  p_description_instructions text,
  p_card_image_instructions text DEFAULT NULL::text,
  p_video_instructions text DEFAULT NULL::text,
  p_summary_instructions text DEFAULT NULL::text,
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
    summary_instructions,
    openai_key, 
    gemini_key,
    rapidapi_key
  )
  VALUES (
    p_image_instructions, 
    p_description_instructions, 
    p_card_image_instructions, 
    p_video_instructions, 
    p_summary_instructions,
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
    summary_instructions = COALESCE(p_summary_instructions, ai_settings.summary_instructions),
    openai_key = COALESCE(p_openai_key, ai_settings.openai_key),
    gemini_key = COALESCE(p_gemini_key, ai_settings.gemini_key),
    rapidapi_key = COALESCE(p_rapidapi_key, ai_settings.rapidapi_key),
    updated_at = timezone('utc'::text, now());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_import_data_status ON import_data(status);
CREATE INDEX IF NOT EXISTS idx_import_data_type ON import_data(classified_type);
CREATE INDEX IF NOT EXISTS idx_import_data_destination ON import_data(classified_destination);
CREATE INDEX IF NOT EXISTS idx_import_data_imported ON import_data(is_imported);
CREATE INDEX IF NOT EXISTS idx_import_data_date ON import_data(original_date);

-- Habilitar RLS
ALTER TABLE import_data ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
CREATE POLICY "Allow read access for authenticated users" ON import_data
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all operations for admin users" ON import_data
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('admin', 'manager')
    )
  );

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_import_data_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER import_data_updated_at
    BEFORE UPDATE ON public.import_data
    FOR EACH ROW
    EXECUTE FUNCTION update_import_data_updated_at();

-- Comentários
COMMENT ON TABLE public.import_data IS 'Armazena dados de importação pendentes para processamento posterior';
COMMENT ON COLUMN public.import_data.ai_summary IS 'Resumo gerado pela IA para a descrição';
COMMENT ON COLUMN public.import_data.ai_summary_applied IS 'Indica se o resumo da IA foi aplicado à descrição';
```

### 3. Verificar se foi aplicado
Após executar, teste se a tabela foi criada executando:

```sql
SELECT COUNT(*) FROM import_data;
```

### 4. Testar função AI Settings
```sql
SELECT * FROM get_ai_settings();
```

## Status
- ✅ Migração criada via CLI: `20250622235242_create_import_data_table.sql`
- ✅ Migração marcada como aplicada no histórico
- ❌ Tabela não existe fisicamente (precisa executar SQL manualmente)
- ❌ Campo `summary_instructions` não existe na tabela `ai_settings`

## Próximos Passos
1. Executar SQL no painel Supabase
2. Testar funcionalidades de importação e IA
3. Verificar se sistema funciona completamente 