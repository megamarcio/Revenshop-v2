-- Migração para criar a tabela de papéis de usuário (user_roles)

-- 1. Criar um tipo ENUM para os papéis, se ele não existir.
-- Isso garante que apenas valores de papéis válidos possam ser atribuídos.
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role_enum') THEN
        CREATE TYPE user_role_enum AS ENUM (
            'admin', 
            'super_admin', 
            'manager', 
            'staff',
            'user'
        );
    END IF;
END$$;

-- 2. Criar a tabela 'user_roles' se ela não existir.
CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role user_role_enum NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),

    -- Garante que um usuário não possa ter o mesmo papel duas vezes.
    UNIQUE (user_id, role)
);

-- 3. Habilitar Row Level Security (RLS) para a tabela.
-- É uma boa prática de segurança para tabelas que contêm dados sensíveis.
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 4. Criar Políticas de RLS para a tabela 'user_roles'.

-- Remover políticas existentes para evitar conflitos (idempotência)
DROP POLICY IF EXISTS "Usuários podem ver seus próprios papéis" ON public.user_roles;
DROP POLICY IF EXISTS "Admins podem gerenciar todos os papéis" ON public.user_roles;

-- Política 1: Usuários podem ver seus próprios papéis.
CREATE POLICY "Usuários podem ver seus próprios papéis"
ON public.user_roles
FOR SELECT
USING (auth.uid() = user_id);

-- Política 2: Apenas Admins ou Super Admins podem gerenciar (ver, criar, editar, deletar) todos os papéis.
-- Esta é uma política recursiva: para gerenciar papéis, você mesmo precisa ter o papel de admin.
CREATE POLICY "Admins podem gerenciar todos os papéis"
ON public.user_roles
FOR ALL
USING (
    EXISTS (
        SELECT 1
        FROM public.user_roles
        WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin')
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1
        FROM public.user_roles
        WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin')
    )
);

-- 5. Adicionar comentários para documentação.
COMMENT ON TABLE public.user_roles IS 'Armazena os papéis (roles) para cada usuário do sistema.';
COMMENT ON COLUMN public.user_roles.user_id IS 'Referência ao usuário na tabela auth.users.';
COMMENT ON COLUMN public.user_roles.role IS 'O papel atribuído ao usuário (ex: admin, manager).'; 