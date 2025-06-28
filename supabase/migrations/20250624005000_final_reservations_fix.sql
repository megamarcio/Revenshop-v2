-- Migração final para corrigir a tabela reservations
-- Força a recriação da tabela com estrutura limpa

-- Remove a tabela existente completamente
DROP TABLE IF EXISTS reservations CASCADE;

-- Recria a tabela com estrutura correta
CREATE TABLE reservations (
  id text PRIMARY KEY,
  temperature text NULL,
  notes text NULL,
  assigned_to uuid NULL,
  delegated_to_user_id uuid NULL,
  contact_stage text NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Recria o trigger para updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_reservations_updated_at ON reservations;
CREATE TRIGGER update_reservations_updated_at 
    BEFORE UPDATE ON reservations 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Recria os índices
DROP INDEX IF EXISTS idx_reservations_assigned_to;
DROP INDEX IF EXISTS idx_reservations_delegated_to_user_id;
DROP INDEX IF EXISTS idx_reservations_contact_stage;
DROP INDEX IF EXISTS idx_reservations_created_at;
DROP INDEX IF EXISTS idx_reservations_updated_at;

CREATE INDEX idx_reservations_assigned_to ON reservations(assigned_to);
CREATE INDEX idx_reservations_delegated_to_user_id ON reservations(delegated_to_user_id);
CREATE INDEX idx_reservations_contact_stage ON reservations(contact_stage);
CREATE INDEX idx_reservations_created_at ON reservations(created_at);
CREATE INDEX idx_reservations_updated_at ON reservations(updated_at); 