-- Remove os campos return_date e pick_up_date da tabela reservations
-- Esses campos não deveriam estar nesta tabela, pois são dados da API externa
-- A tabela reservations deve conter apenas dados customizados (temperature, notes, etc.)

ALTER TABLE reservations 
DROP COLUMN IF EXISTS return_date,
DROP COLUMN IF EXISTS pick_up_date; 