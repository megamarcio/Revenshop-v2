-- Adiciona as colunas para delegação e estágio de contato na tabela reservations
ALTER TABLE reservations
ADD COLUMN assigned_to uuid NULL,
ADD COLUMN contact_stage text NULL; 