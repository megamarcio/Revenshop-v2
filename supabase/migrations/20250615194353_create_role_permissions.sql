
-- Cria tabela onde cada linha define acesso de uma role a uma tela
CREATE TABLE public.role_permissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  role text NOT NULL, -- admin, manager, seller, internal_seller
  screen_id text NOT NULL, -- ex: 'dashboard', 'users', etc
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(role, screen_id)
);

-- RLS: só admin/manager podem ver/editar permissões
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;

-- Permite SELECT apenas para usuários admin/manager
CREATE POLICY "Admins e gerentes podem ver todas as permissões"
  ON public.role_permissions
  FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin','manager'))
  );

-- Permite INSERT apenas admin/manager
CREATE POLICY "Admins e gerentes podem criar permissões"
  ON public.role_permissions
  FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin','manager'))
  );

-- Permite UPDATE apenas admin/manager
CREATE POLICY "Admins e gerentes podem editar permissões"
  ON public.role_permissions
  FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin','manager'))
  );

-- Permite DELETE apenas admin/manager
CREATE POLICY "Admins e gerentes podem deletar permissões"
  ON public.role_permissions
  FOR DELETE
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin','manager'))
  );
