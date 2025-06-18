
-- Criar tabela de categorias financeiras
CREATE TABLE financial_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('receita', 'despesa')),
  is_default BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de receitas
CREATE TABLE revenues (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  description TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  category_id UUID REFERENCES financial_categories(id),
  type TEXT NOT NULL CHECK (type IN ('padrao', 'estimada')),
  date DATE NOT NULL,
  is_confirmed BOOLEAN NOT NULL DEFAULT false,
  notes TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de despesas
CREATE TABLE expenses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  description TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  category_id UUID REFERENCES financial_categories(id),
  type TEXT NOT NULL CHECK (type IN ('fixa', 'variavel', 'sazonal', 'investimento')),
  date DATE NOT NULL,
  is_paid BOOLEAN NOT NULL DEFAULT false,
  due_date DATE,
  notes TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de extratos bancários
CREATE TABLE bank_statements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  transaction_date DATE NOT NULL,
  description TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  balance NUMERIC,
  reference_number TEXT,
  is_processed BOOLEAN NOT NULL DEFAULT false,
  linked_expense_id UUID REFERENCES expenses(id),
  linked_revenue_id UUID REFERENCES revenues(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de software/ferramentas
CREATE TABLE company_software (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  cost NUMERIC NOT NULL,
  payment_type TEXT NOT NULL CHECK (payment_type IN ('unico', 'mensal', 'anual', 'bianual', 'trianual')),
  purchase_date DATE,
  next_payment_date DATE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  vendor TEXT,
  license_key TEXT,
  notes TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Adicionar RLS (Row Level Security)
ALTER TABLE financial_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE revenues ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE bank_statements ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_software ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para financial_categories (todos podem ver e criar)
CREATE POLICY "Anyone can view financial categories" ON financial_categories FOR SELECT USING (true);
CREATE POLICY "Anyone can create financial categories" ON financial_categories FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update financial categories" ON financial_categories FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete financial categories" ON financial_categories FOR DELETE USING (true);

-- Políticas RLS para revenues
CREATE POLICY "Users can view all revenues" ON revenues FOR SELECT USING (true);
CREATE POLICY "Users can create revenues" ON revenues FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update revenues" ON revenues FOR UPDATE USING (true);
CREATE POLICY "Users can delete revenues" ON revenues FOR DELETE USING (true);

-- Políticas RLS para expenses
CREATE POLICY "Users can view all expenses" ON expenses FOR SELECT USING (true);
CREATE POLICY "Users can create expenses" ON expenses FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update expenses" ON expenses FOR UPDATE USING (true);
CREATE POLICY "Users can delete expenses" ON expenses FOR DELETE USING (true);

-- Políticas RLS para bank_statements
CREATE POLICY "Users can view all bank statements" ON bank_statements FOR SELECT USING (true);
CREATE POLICY "Users can create bank statements" ON bank_statements FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update bank statements" ON bank_statements FOR UPDATE USING (true);
CREATE POLICY "Users can delete bank statements" ON bank_statements FOR DELETE USING (true);

-- Políticas RLS para company_software
CREATE POLICY "Users can view all software" ON company_software FOR SELECT USING (true);
CREATE POLICY "Users can create software" ON company_software FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update software" ON company_software FOR UPDATE USING (true);
CREATE POLICY "Users can delete software" ON company_software FOR DELETE USING (true);

-- Inserir categorias padrão
INSERT INTO financial_categories (name, type, is_default) VALUES
('Vendas de Veículos', 'receita', true),
('Serviços', 'receita', true),
('Outras Receitas', 'receita', true),
('Aluguel', 'despesa', true),
('Salários', 'despesa', true),
('Combustível', 'despesa', true),
('Manutenção', 'despesa', true),
('Marketing', 'despesa', true),
('Seguros', 'despesa', true),
('Software/Licenças', 'despesa', true),
('Equipamentos', 'despesa', true),
('Outras Despesas', 'despesa', true);

-- Criar triggers para updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_financial_categories_updated_at BEFORE UPDATE ON financial_categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_revenues_updated_at BEFORE UPDATE ON revenues FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_expenses_updated_at BEFORE UPDATE ON expenses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_company_software_updated_at BEFORE UPDATE ON company_software FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
