
-- Criar tabela para armazenar itens técnicos dos veículos
CREATE TABLE public.technical_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('oil', 'electrical', 'filter', 'suspension', 'brakes', 'fluids', 'tuneup', 'tires')),
  month TEXT,
  year TEXT,
  miles TEXT,
  next_change DATE,
  status TEXT NOT NULL CHECK (status IN ('em-dia', 'proximo-troca', 'trocar')) DEFAULT 'em-dia',
  extra_info TEXT,
  tire_brand TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS na tabela technical_items
ALTER TABLE public.technical_items ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para technical_items
CREATE POLICY "Users can view all technical items" 
  ON public.technical_items 
  FOR SELECT 
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert technical items" 
  ON public.technical_items 
  FOR INSERT 
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update technical items" 
  ON public.technical_items 
  FOR UPDATE 
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete technical items" 
  ON public.technical_items 
  FOR DELETE 
  TO authenticated
  USING (true);

-- Trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_technical_items_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER technical_items_updated_at
    BEFORE UPDATE ON public.technical_items
    FOR EACH ROW
    EXECUTE FUNCTION update_technical_items_updated_at();

-- Conceder permissões
GRANT ALL ON public.technical_items TO authenticated;
