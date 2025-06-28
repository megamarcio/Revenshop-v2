-- Criar tabela para grupos do WhatsApp
CREATE TABLE IF NOT EXISTS whatsapp_groups (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  phone VARCHAR(50) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Índices
CREATE INDEX IF NOT EXISTS whatsapp_groups_name_idx ON whatsapp_groups(name);
CREATE INDEX IF NOT EXISTS whatsapp_groups_phone_idx ON whatsapp_groups(phone);

-- RLS policies
ALTER TABLE whatsapp_groups ENABLE ROW LEVEL SECURITY;

-- Política para permitir leitura para usuários autenticados
DROP POLICY IF EXISTS "Allow read for authenticated users" ON whatsapp_groups;
CREATE POLICY "Allow read for authenticated users" ON whatsapp_groups
  FOR SELECT USING (auth.role() = 'authenticated');

-- Política para permitir operações CRUD para admins e managers
DROP POLICY IF EXISTS "Allow CRUD for admins and managers" ON whatsapp_groups;
CREATE POLICY "Allow CRUD for admins and managers" ON whatsapp_groups
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('admin', 'manager')
    )
  );

-- Trigger para atualizar updated_at
DROP TRIGGER IF EXISTS update_whatsapp_groups_updated_at ON whatsapp_groups;
CREATE TRIGGER update_whatsapp_groups_updated_at
    BEFORE UPDATE ON whatsapp_groups
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
