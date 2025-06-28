-- Script de migração manual para todas as configurações
-- Execute este script diretamente no editor SQL do Supabase se as migrações automáticas não funcionaram

-- 1. CONFIGURAÇÕES DA EMPRESA
-- Criar tabela company_settings
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

-- Constraint para garantir apenas uma linha
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

-- RLS e políticas
ALTER TABLE public.company_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON public.company_settings;
CREATE POLICY "Allow all operations for authenticated users" 
ON public.company_settings FOR ALL USING (auth.role() = 'authenticated');

-- Função e trigger para updated_at
CREATE OR REPLACE FUNCTION public.update_company_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_company_settings_updated_at ON public.company_settings;
CREATE TRIGGER update_company_settings_updated_at
  BEFORE UPDATE ON public.company_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_company_settings_updated_at();

-- Inserir registro padrão
INSERT INTO public.company_settings (id, company_name) 
VALUES (1, '') 
ON CONFLICT (id) DO NOTHING;

-- 2. CONFIGURAÇÕES DE SITES
-- Criar tabela website_settings
CREATE TABLE IF NOT EXISTS public.website_settings (
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

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_website_settings_category ON public.website_settings(category);
CREATE INDEX IF NOT EXISTS idx_website_settings_active ON public.website_settings(is_active);
CREATE INDEX IF NOT EXISTS idx_website_settings_sort ON public.website_settings(sort_order);

-- RLS e políticas
ALTER TABLE public.website_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow read access for authenticated users" ON public.website_settings;
DROP POLICY IF EXISTS "Allow all operations for admin users" ON public.website_settings;

CREATE POLICY "Allow read access for authenticated users" ON public.website_settings
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all operations for authenticated users" ON public.website_settings
  FOR ALL USING (auth.role() = 'authenticated');

-- Função e trigger para updated_at
CREATE OR REPLACE FUNCTION public.update_website_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_website_settings_updated_at ON public.website_settings;
CREATE TRIGGER update_website_settings_updated_at
  BEFORE UPDATE ON public.website_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_website_settings_updated_at();

-- Inserir sites padrão
INSERT INTO public.website_settings (name, url, category, description, icon, sort_order, is_active) VALUES
  ('DETRAN SP', 'https://www.detran.sp.gov.br/', 'government', 'Departamento de Trânsito de São Paulo', 'Building2', 1, true),
  ('DENATRAN', 'https://www.gov.br/infraestrutura/pt-br/assuntos/transito', 'government', 'Departamento Nacional de Trânsito', 'Shield', 2, true),
  ('Tabela FIPE', 'https://veiculos.fipe.org.br/', 'tools', 'Consulta de preços de veículos', 'Calculator', 3, true),
  ('SINTEGRA', 'http://www.sintegra.gov.br/', 'government', 'Sistema Integrado de Informações sobre Operações Interestaduais', 'FileText', 4, true),
  ('Receita Federal', 'https://www.gov.br/receitafederal/pt-br', 'government', 'Portal da Receita Federal do Brasil', 'Building', 5, true),
  ('WebMotors', 'https://www.webmotors.com.br/', 'commercial', 'Portal de veículos usados e novos', 'Car', 6, true),
  ('MercadoLivre Veículos', 'https://carros.mercadolivre.com.br/', 'commercial', 'Marketplace de veículos', 'ShoppingCart', 7, true)
ON CONFLICT (id) DO NOTHING;

-- 3. CONFIGURAÇÕES DE CORES/TEMAS
-- Criar tabela color_theme_settings
CREATE TABLE IF NOT EXISTS public.color_theme_settings (
  id INTEGER PRIMARY KEY DEFAULT 1,
  current_theme_id TEXT NOT NULL DEFAULT 'blue-white',
  custom_themes JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Constraint para garantir apenas uma linha
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'color_theme_settings_single_row'
    ) THEN
        ALTER TABLE public.color_theme_settings 
        ADD CONSTRAINT color_theme_settings_single_row CHECK (id = 1);
    END IF;
END $$;

-- RLS e políticas
ALTER TABLE public.color_theme_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON public.color_theme_settings;
CREATE POLICY "Allow all operations for authenticated users" 
ON public.color_theme_settings FOR ALL USING (auth.role() = 'authenticated');

-- Função e trigger para updated_at
CREATE OR REPLACE FUNCTION public.update_color_theme_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_color_theme_settings_updated_at ON public.color_theme_settings;
CREATE TRIGGER update_color_theme_settings_updated_at
  BEFORE UPDATE ON public.color_theme_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_color_theme_settings_updated_at();

-- Inserir configuração padrão
INSERT INTO public.color_theme_settings (id, current_theme_id) 
VALUES (1, 'blue-white') 
ON CONFLICT (id) DO NOTHING;

-- 4. FUNÇÕES RPC AUXILIARES (OPCIONAL)
-- Função para obter configurações de cores
CREATE OR REPLACE FUNCTION public.get_color_theme_settings()
RETURNS TABLE (
  current_theme_id TEXT,
  custom_themes JSONB
) AS $$
BEGIN
  RETURN QUERY
  SELECT cts.current_theme_id, cts.custom_themes
  FROM public.color_theme_settings cts
  WHERE cts.id = 1
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para salvar configurações de cores
CREATE OR REPLACE FUNCTION public.save_color_theme_settings(
  p_current_theme_id TEXT,
  p_custom_themes TEXT DEFAULT '[]'
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO public.color_theme_settings (id, current_theme_id, custom_themes)
  VALUES (1, p_current_theme_id, p_custom_themes::jsonb)
  ON CONFLICT (id)
  DO UPDATE SET
    current_theme_id = p_current_theme_id,
    custom_themes = p_custom_themes::jsonb,
    updated_at = timezone('utc'::text, now());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Garantir permissões para usuários autenticados
GRANT EXECUTE ON FUNCTION public.get_color_theme_settings() TO authenticated;
GRANT EXECUTE ON FUNCTION public.save_color_theme_settings(TEXT, TEXT) TO authenticated;

-- 5. VERIFICAÇÃO FINAL
-- Verificar se as tabelas foram criadas
DO $$
DECLARE
  table_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO table_count
  FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name IN ('company_settings', 'website_settings', 'color_theme_settings');
  
  RAISE NOTICE 'Tabelas criadas: % de 3', table_count;
  
  IF table_count = 3 THEN
    RAISE NOTICE '✅ Todas as tabelas de configurações foram criadas com sucesso!';
  ELSE
    RAISE NOTICE '⚠️ Algumas tabelas podem não ter sido criadas. Verifique os erros acima.';
  END IF;
END $$; 