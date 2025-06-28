-- Migração: Criar tabela view_preferences
-- Criado em: 2025-01-07
-- Descrição: Tabela para armazenar preferências de visualização dos usuários

-- Criar tabela view_preferences
CREATE TABLE IF NOT EXISTS public.view_preferences (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    component_name TEXT NOT NULL,
    view_mode TEXT NOT NULL CHECK (view_mode IN ('card', 'list', 'table')),
    preferences JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, component_name)
);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_view_preferences_user_id ON public.view_preferences(user_id);
CREATE INDEX IF NOT EXISTS idx_view_preferences_component ON public.view_preferences(component_name);
CREATE INDEX IF NOT EXISTS idx_view_preferences_user_component ON public.view_preferences(user_id, component_name);

-- Habilitar RLS (Row Level Security)
ALTER TABLE public.view_preferences ENABLE ROW LEVEL SECURITY;

-- Política: Usuários podem ver apenas suas próprias preferências
CREATE POLICY IF NOT EXISTS "Users can view own preferences" ON public.view_preferences
    FOR SELECT USING (auth.uid() = user_id);

-- Política: Usuários podem inserir suas próprias preferências
CREATE POLICY IF NOT EXISTS "Users can insert own preferences" ON public.view_preferences
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Política: Usuários podem atualizar suas próprias preferências
CREATE POLICY IF NOT EXISTS "Users can update own preferences" ON public.view_preferences
    FOR UPDATE USING (auth.uid() = user_id);

-- Política: Usuários podem deletar suas próprias preferências
CREATE POLICY IF NOT EXISTS "Users can delete own preferences" ON public.view_preferences
    FOR DELETE USING (auth.uid() = user_id);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar updated_at
DROP TRIGGER IF EXISTS handle_updated_at ON public.view_preferences;
CREATE TRIGGER handle_updated_at
    BEFORE UPDATE ON public.view_preferences
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Comentários para documentação
COMMENT ON TABLE public.view_preferences IS 'Armazena preferências de visualização dos usuários para diferentes componentes';
COMMENT ON COLUMN public.view_preferences.user_id IS 'ID do usuário (referência para auth.users)';
COMMENT ON COLUMN public.view_preferences.component_name IS 'Nome do componente (ex: external_api_management)';
COMMENT ON COLUMN public.view_preferences.view_mode IS 'Modo de visualização: card, list ou table';
COMMENT ON COLUMN public.view_preferences.preferences IS 'Preferências adicionais em formato JSON'; 