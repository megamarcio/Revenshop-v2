-- Criar tabela para configurações de temas de cores
CREATE TABLE IF NOT EXISTS color_theme_settings (
  id INTEGER PRIMARY KEY DEFAULT 1,
  current_theme_id TEXT NOT NULL DEFAULT 'blue-white',
  custom_themes JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Garantir que apenas uma linha exista
ALTER TABLE color_theme_settings ADD CONSTRAINT color_theme_settings_single_row CHECK (id = 1);

-- Habilitar RLS
ALTER TABLE color_theme_settings ENABLE ROW LEVEL SECURITY;

-- Política para permitir todas as operações para usuários autenticados
CREATE POLICY "Allow all operations for authenticated users" ON color_theme_settings
  FOR ALL USING (auth.role() = 'authenticated');

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_color_theme_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar updated_at
CREATE TRIGGER update_color_theme_settings_updated_at
  BEFORE UPDATE ON color_theme_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_color_theme_settings_updated_at();

-- Inserir configuração padrão se não existir
INSERT INTO color_theme_settings (id, current_theme_id) 
VALUES (1, 'blue-white') 
ON CONFLICT (id) DO NOTHING; 