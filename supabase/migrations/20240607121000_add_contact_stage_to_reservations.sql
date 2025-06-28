-- Adiciona a coluna contact_stage para estágio de contato na tabela reservations
ALTER TABLE reservations
ADD COLUMN IF NOT EXISTS contact_stage text NULL; 