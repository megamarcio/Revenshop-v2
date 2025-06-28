
-- Create the email_settings table
CREATE TABLE public.email_settings (
  id INTEGER PRIMARY KEY DEFAULT 1,
  smtp_host TEXT,
  smtp_port INTEGER DEFAULT 587,
  smtp_user TEXT,
  smtp_password TEXT,
  from_email TEXT,
  from_name TEXT DEFAULT 'Equipe de Vendas',
  company_logo TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add a constraint to ensure only one row exists
ALTER TABLE public.email_settings ADD CONSTRAINT email_settings_single_row CHECK (id = 1);

-- Enable RLS (optional, since this is configuration data)
ALTER TABLE public.email_settings ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (since this is configuration data)
CREATE POLICY "Allow all operations on email_settings" 
ON public.email_settings 
FOR ALL 
USING (true) 
WITH CHECK (true);
