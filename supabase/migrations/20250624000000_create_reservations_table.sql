-- Cria a tabela reservations para armazenar dados customizados das reservas
CREATE TABLE IF NOT EXISTS reservations (
  id text PRIMARY KEY,
  temperature text NULL,
  notes text NULL,
  assigned_to uuid NULL,
  delegated_to_user_id uuid NULL,
  contact_stage text NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Cria um trigger para atualizar o campo updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_reservations_updated_at 
    BEFORE UPDATE ON reservations 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Cria índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_reservations_assigned_to ON reservations(assigned_to);
CREATE INDEX IF NOT EXISTS idx_reservations_delegated_to_user_id ON reservations(delegated_to_user_id);
CREATE INDEX IF NOT EXISTS idx_reservations_contact_stage ON reservations(contact_stage);
CREATE INDEX IF NOT EXISTS idx_reservations_created_at ON reservations(created_at);
CREATE INDEX IF NOT EXISTS idx_reservations_updated_at ON reservations(updated_at); 