-- Manual migration for company_settings table
-- Execute this directly in your Supabase SQL editor if needed

-- Create the company_settings table
CREATE TABLE IF NOT EXISTS public.company_settings (
  id INTEGER PRIMARY KEY DEFAULT 1,
  company_name TEXT,
  company_logo TEXT,
  trade_name TEXT,
  cnpj TEXT,
  address TEXT,
  city TEXT,
  phone TEXT,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add constraint to ensure only one row exists
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'company_settings_single_row'
    ) THEN
        ALTER TABLE public.company_settings 
        ADD CONSTRAINT company_settings_single_row CHECK (id = 1);
    END IF;
END $$;

-- Enable Row Level Security
ALTER TABLE public.company_settings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON public.company_settings;

-- Create policy to allow all operations for authenticated users
CREATE POLICY "Allow all operations for authenticated users" 
ON public.company_settings
FOR ALL 
USING (auth.role() = 'authenticated');

-- Create or replace function to update updated_at
CREATE OR REPLACE FUNCTION public.update_company_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS update_company_settings_updated_at ON public.company_settings;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_company_settings_updated_at
  BEFORE UPDATE ON public.company_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_company_settings_updated_at();

-- Insert default row if it doesn't exist
INSERT INTO public.company_settings (id, company_name) 
VALUES (1, '') 
ON CONFLICT (id) DO NOTHING;

-- Grant permissions
GRANT ALL ON public.company_settings TO authenticated;
GRANT ALL ON public.company_settings TO service_role; 