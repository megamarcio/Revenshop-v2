-- Create view_preferences table for user interface preferences
CREATE TABLE IF NOT EXISTS view_preferences (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  component_name text NOT NULL,
  view_mode text NOT NULL DEFAULT 'card',
  preferences jsonb DEFAULT '{}',
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  
  -- Unique constraint to ensure one preference per user per component
  UNIQUE(user_id, component_name)
);

-- Create index for better performance
CREATE INDEX idx_view_preferences_user_id ON view_preferences(user_id);
CREATE INDEX idx_view_preferences_component ON view_preferences(component_name);

-- Enable RLS
ALTER TABLE view_preferences ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view own view preferences" ON view_preferences
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own view preferences" ON view_preferences
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own view preferences" ON view_preferences
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own view preferences" ON view_preferences
  FOR DELETE USING (auth.uid() = user_id);

-- Add comments for documentation
COMMENT ON TABLE view_preferences IS 'Tabela para armazenar preferências de visualização dos usuários por componente';
COMMENT ON COLUMN view_preferences.component_name IS 'Nome do componente (ex: external_apis, vehicles, etc)';
COMMENT ON COLUMN view_preferences.view_mode IS 'Modo de visualização (card, list, table)';
COMMENT ON COLUMN view_preferences.preferences IS 'Configurações adicionais específicas do componente';

-- Insert some default view modes
INSERT INTO view_preferences (user_id, component_name, view_mode, preferences)
SELECT 
  id as user_id,
  'external_apis' as component_name,
  'card' as view_mode,
  '{"sortBy": "name", "sortOrder": "asc"}' as preferences
FROM profiles
WHERE id IS NOT NULL
ON CONFLICT (user_id, component_name) DO NOTHING; 