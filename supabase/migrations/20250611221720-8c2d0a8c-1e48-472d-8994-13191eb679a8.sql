
-- Criar tabela para tipos de título
CREATE TABLE public.title_types (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  is_default BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Inserir os tipos de título em ordem alfabética
INSERT INTO public.title_types (code, name, description, is_default) VALUES
('bonded', 'Bonded Title', 'título vinculado: usado quando faltam documentos originais de propriedade; comprador obtém uma garantia (bond) para cobrir disputas futuras', false),
('buyback_lemon', 'Buyback/Lemon Law Title', 'título de recompra: veículos recomprados pelo fabricante por defeitos recorrentes, com marcação "lemon" ou similar', false),
('certificate_destruction', 'Certificate of Destruction', 'certificado de destruição: declaração de que o veículo é irreparável, não pode ser registrado para uso em via pública', false),
('clean_clear', 'Clean/Clear Title', 'título limpo: veículo sem histórico de perda total, pronto para financiar e revender facilmente', true),
('fire_damage', 'Fire Damage Title', 'título de fogo: veículos danificados por incêndio, avaliados caso a caso para reparo ou desmontagem', false),
('flood_damaged', 'Flood Damaged Title', 'título de inundação: dano causado por alagamento, normalmente vendido para desmanche ou restauração, se possível', false),
('junk_irreparable', 'Junk/Irreparable Title', 'título de sucata: só serve para peças ou sucata, sem possibilidade de reparo para uso em via pública', false),
('rebuilt_certified', 'Rebuilt/Certified Rebuilt Title', 'título reconstruído: antigo salvage que passou por vistoria e ganhou autorização para circular, mas mantém a marcação histórica no documento', false),
('salvage', 'Salvage Title', 'título de salvamento: quando o custo de reparo supera o valor do carro, sinalizando perda total pelo seguro', false),
('theft_recovery', 'Theft Recovery Title', 'título de roubo recuperado: carros que foram roubados e recuperados; podem ter danos ou faltas de peças', false);

-- Adicionar coluna title_type_id na tabela vehicles
ALTER TABLE public.vehicles 
ADD COLUMN title_type_id UUID REFERENCES public.title_types(id);

-- Definir o valor padrão para veículos existentes (Clean/Clear Title)
UPDATE public.vehicles 
SET title_type_id = (SELECT id FROM public.title_types WHERE code = 'clean_clear');

-- Criar índice para performance
CREATE INDEX idx_vehicles_title_type_id ON public.vehicles(title_type_id);
CREATE INDEX idx_title_types_code ON public.title_types(code);
