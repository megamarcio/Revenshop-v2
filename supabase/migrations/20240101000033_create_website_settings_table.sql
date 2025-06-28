-- Criar tabela para configurações de sites
CREATE TABLE IF NOT EXISTS website_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  url TEXT NOT NULL,
  category VARCHAR(50) NOT NULL CHECK (category IN ('government', 'commercial', 'tools', 'other')),
  description TEXT,
  icon VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Inserir sites padrão
INSERT INTO website_settings (name, url, category, description, icon, sort_order) VALUES
  ('DETRAN SP', 'https://www.detran.sp.gov.br/', 'government', 'Departamento de Trânsito de São Paulo', 'Building2', 1),
  ('DENATRAN', 'https://www.gov.br/infraestrutura/pt-br/assuntos/transito', 'government', 'Departamento Nacional de Trânsito', 'Shield', 2),
  ('Tabela FIPE', 'https://veiculos.fipe.org.br/', 'tools', 'Consulta de preços de veículos', 'Calculator', 3),
  ('SINTEGRA', 'http://www.sintegra.gov.br/', 'government', 'Sistema Integrado de Informações sobre Operações Interestaduais', 'FileText', 4),
  ('Receita Federal', 'https://www.gov.br/receitafederal/pt-br', 'government', 'Portal da Receita Federal do Brasil', 'Building', 5),
  ('WebMotors', 'https://www.webmotors.com.br/', 'commercial', 'Portal de veículos usados e novos', 'Car', 6),
  ('MercadoLivre Veículos', 'https://carros.mercadolivre.com.br/', 'commercial', 'Marketplace de veículos', 'ShoppingCart', 7);

-- Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_website_settings_category ON website_settings(category);
CREATE INDEX IF NOT EXISTS idx_website_settings_active ON website_settings(is_active);
CREATE INDEX IF NOT EXISTS idx_website_settings_sort ON website_settings(sort_order);

-- Habilitar RLS (Row Level Security)
ALTER TABLE website_settings ENABLE ROW LEVEL SECURITY;

-- Política para permitir leitura para todos os usuários autenticados
CREATE POLICY "Allow read access for authenticated users" ON website_settings
  FOR SELECT USING (auth.role() = 'authenticated');

-- Política para permitir todas as operações para usuários admin
CREATE POLICY "Allow all operations for admin users" ON website_settings
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_website_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar updated_at
CREATE TRIGGER update_website_settings_updated_at
  BEFORE UPDATE ON website_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_website_settings_updated_at(); 