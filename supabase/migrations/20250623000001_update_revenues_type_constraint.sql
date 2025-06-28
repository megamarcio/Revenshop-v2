-- Atualizar constraint da tabela revenues para incluir todos os tipos
ALTER TABLE public.revenues DROP CONSTRAINT IF EXISTS revenues_type_check;
ALTER TABLE public.revenues ADD CONSTRAINT revenues_type_check 
  CHECK (type IN ('padrao', 'estimada', 'venda', 'comissao', 'servico', 'financiamento'));

-- Comentário explicativo
COMMENT ON COLUMN public.revenues.type IS 'Tipo da receita: padrao, estimada, venda, comissao, servico, financiamento'; 