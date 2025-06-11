
-- Remove the CR, title type and title status columns from vehicles table
ALTER TABLE vehicles DROP COLUMN IF EXISTS ca_note;
ALTER TABLE vehicles DROP COLUMN IF EXISTS title_type;
ALTER TABLE vehicles DROP COLUMN IF EXISTS title_status;

-- Drop the enum types that are no longer needed
DROP TYPE IF EXISTS title_type;
DROP TYPE IF EXISTS title_status;
