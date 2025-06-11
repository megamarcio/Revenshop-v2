
-- Criar tabela para localizações de título
CREATE TABLE public.title_locations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  is_default BOOLEAN NOT NULL DEFAULT false,
  allows_custom BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Inserir as opções de localização de título
INSERT INTO public.title_locations (code, name, is_default, allows_custom) VALUES
('em_maos', 'Em mãos', true, false),
('financeira_aguardando', 'Financeira (aguardando)', false, false),
('online_dmv', 'On Line (Dmv)', false, false),
('leilao_aguardando', 'Leilão (aguardando)', false, false),
('sem_titulo_junk', 'Sem Titulo (Junk)', false, false),
('outro', 'Outro', false, true);

-- Adicionar colunas na tabela vehicles
ALTER TABLE public.vehicles 
ADD COLUMN title_location_id UUID REFERENCES public.title_locations(id),
ADD COLUMN title_location_custom TEXT;

-- Definir o valor padrão para veículos existentes (Em mãos)
UPDATE public.vehicles 
SET title_location_id = (SELECT id FROM public.title_locations WHERE code = 'em_maos');

-- Criar índice para performance
CREATE INDEX idx_vehicles_title_location_id ON public.vehicles(title_location_id);
CREATE INDEX idx_title_locations_code ON public.title_locations(code);
