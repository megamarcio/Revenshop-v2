# 🚀 Guia de Configuração do Supabase - Expense Forecasts

Este guia explica como configurar corretamente o Supabase para que os filtros do ExpenseForecast funcionem.

## 📋 Pré-requisitos

1. Projeto Supabase criado
2. Acesso ao dashboard do Supabase
3. Node.js instalado no projeto

## 🔧 Passo 1: Configurar as Credenciais

### 1.1 Criar arquivo .env
Crie um arquivo `.env` na raiz do projeto com:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anonima-aqui
```

### 1.2 Obter as credenciais
1. Vá para [Supabase Dashboard](https://supabase.com/dashboard)
2. Selecione seu projeto
3. Vá para **Settings** > **API**
4. Copie a **URL** e a **anon key**

## 💾 Passo 2: Executar as Migrações SQL

### 2.1 Acessar o SQL Editor
1. No dashboard do Supabase
2. Vá para **SQL Editor**
3. Clique em **New Query**

### 2.2 Executar Migração 1: expense_forecasts

```sql
-- Fix expense_forecasts table structure
-- This migration fixes the category column to use category_id as foreign key

-- Drop the existing table if it exists (only if empty or in development)
DROP TABLE IF EXISTS expense_forecasts CASCADE;

-- Create expense_forecasts table with correct structure
CREATE TABLE expense_forecasts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  description text NOT NULL,
  amount numeric(10,2) NOT NULL,
  type text NOT NULL CHECK (type IN ('fixa', 'variavel')),
  category_id uuid REFERENCES financial_categories(id),
  due_day integer NOT NULL CHECK (due_day >= 1 AND due_day <= 31),
  is_active boolean DEFAULT true,
  notes text,
  import_category text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  created_by uuid REFERENCES profiles(id)
);

-- Create index for better performance
CREATE INDEX idx_expense_forecasts_type ON expense_forecasts(type);
CREATE INDEX idx_expense_forecasts_category_id ON expense_forecasts(category_id);
CREATE INDEX idx_expense_forecasts_is_active ON expense_forecasts(is_active);
CREATE INDEX idx_expense_forecasts_created_at ON expense_forecasts(created_at);
CREATE INDEX idx_expense_forecasts_due_day ON expense_forecasts(due_day);

-- Enable RLS
ALTER TABLE expense_forecasts ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view all expense forecasts" ON expense_forecasts
  FOR SELECT USING (true);

CREATE POLICY "Users can insert expense forecasts" ON expense_forecasts
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update expense forecasts" ON expense_forecasts
  FOR UPDATE USING (true);

CREATE POLICY "Users can delete expense forecasts" ON expense_forecasts
  FOR DELETE USING (true);

-- Add comment for documentation
COMMENT ON TABLE expense_forecasts IS 'Tabela para armazenar previsões de despesas mensais fixas e variáveis';
COMMENT ON COLUMN expense_forecasts.category_id IS 'Referência para a categoria financeira na tabela financial_categories';
COMMENT ON COLUMN expense_forecasts.due_day IS 'Dia do mês (1-31) quando a despesa vence';
COMMENT ON COLUMN expense_forecasts.import_category IS 'Categoria para importação e mapeamento de dados externos';
```

### 2.3 Executar Migração 2: revenue_forecasts

```sql
-- Create revenue_forecasts table
-- This table stores monthly revenue forecasts (fixed and variable)

CREATE TABLE IF NOT EXISTS revenue_forecasts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  description text NOT NULL,
  amount numeric(10,2) NOT NULL,
  type text NOT NULL CHECK (type IN ('fixa', 'variavel')),
  category_id uuid REFERENCES financial_categories(id),
  due_day integer NOT NULL CHECK (due_day >= 1 AND due_day <= 31),
  is_active boolean DEFAULT true,
  notes text,
  import_category text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  created_by uuid REFERENCES profiles(id)
);

-- Create index for better performance
CREATE INDEX idx_revenue_forecasts_type ON revenue_forecasts(type);
CREATE INDEX idx_revenue_forecasts_category_id ON revenue_forecasts(category_id);
CREATE INDEX idx_revenue_forecasts_is_active ON revenue_forecasts(is_active);
CREATE INDEX idx_revenue_forecasts_created_at ON revenue_forecasts(created_at);
CREATE INDEX idx_revenue_forecasts_due_day ON revenue_forecasts(due_day);

-- Enable RLS
ALTER TABLE revenue_forecasts ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view all revenue forecasts" ON revenue_forecasts
  FOR SELECT USING (true);

CREATE POLICY "Users can insert revenue forecasts" ON revenue_forecasts
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update revenue forecasts" ON revenue_forecasts
  FOR UPDATE USING (true);

CREATE POLICY "Users can delete revenue forecasts" ON revenue_forecasts
  FOR DELETE USING (true);

-- Add comment for documentation
COMMENT ON TABLE revenue_forecasts IS 'Tabela para armazenar previsões de receitas mensais fixas e variáveis';
COMMENT ON COLUMN revenue_forecasts.category_id IS 'Referência para a categoria financeira na tabela financial_categories';
COMMENT ON COLUMN revenue_forecasts.due_day IS 'Dia do mês (1-31) quando a receita é esperada';
COMMENT ON COLUMN revenue_forecasts.import_category IS 'Categoria para importação e mapeamento de dados externos';
```

### 2.4 Inserir Dados de Exemplo (Opcional)

```sql
-- Inserir algumas categorias padrão se não existirem
INSERT INTO financial_categories (name, type, is_default) 
VALUES 
  ('Aluguel', 'despesa', true),
  ('Utilidades', 'despesa', true),
  ('Material de Escritório', 'despesa', true),
  ('Vendas de Veículos', 'receita', true),
  ('Serviços Adicionais', 'receita', true)
ON CONFLICT (name, type) DO NOTHING;

-- Inserir algumas previsões de exemplo
INSERT INTO expense_forecasts (description, amount, type, category_id, due_day, notes)
SELECT 
  'Aluguel do Escritório',
  2500.00,
  'fixa',
  fc.id,
  5,
  'Pagamento mensal do aluguel do escritório'
FROM financial_categories fc 
WHERE fc.name = 'Aluguel' AND fc.type = 'despesa'
ON CONFLICT DO NOTHING;

INSERT INTO expense_forecasts (description, amount, type, category_id, due_day, notes)
SELECT 
  'Internet e Telefone',
  150.00,
  'fixa',
  fc.id,
  10,
  'Pacote empresarial de telecomunicações'
FROM financial_categories fc 
WHERE fc.name = 'Utilidades' AND fc.type = 'despesa'
ON CONFLICT DO NOTHING;

INSERT INTO revenue_forecasts (description, amount, type, category_id, due_day, notes)
SELECT 
  'Aluguel de Veículos',
  5000.00,
  'fixa',
  fc.id,
  1,
  'Receita média mensal de aluguel'
FROM financial_categories fc 
WHERE fc.name = 'Vendas de Veículos' AND fc.type = 'receita'
ON CONFLICT DO NOTHING;
```

## 🔄 Passo 3: Regenerar os Types do TypeScript

### 3.1 Acessar a página de API
1. No dashboard do Supabase
2. Vá para **Settings** > **API**
3. Role até encontrar **TypeScript Types**

### 3.2 Copiar os novos types
1. Clique em **Generate Types**
2. Copie todo o conteúdo gerado
3. Substitua o conteúdo do arquivo `src/integrations/supabase/types.ts`

## 🚀 Passo 4: Testar a Aplicação

### 4.1 Reiniciar o servidor
```bash
npm run dev
```

### 4.2 Verificar o funcionamento
1. Abra `http://localhost:8081`
2. Navegue para **Financeiro** > **Previsões**
3. Verifique se os dados carregam corretamente
4. Teste os filtros:
   - Pesquisa por texto
   - Filtro de tipo (Fixa/Variável)
   - Filtro de categoria
   - Modos de visualização

## ✅ Resultado Esperado

Após completar todos os passos:

- ✅ Tabelas `expense_forecasts` e `revenue_forecasts` criadas
- ✅ Filtros funcionando corretamente
- ✅ Sem erros de TypeScript
- ✅ Dados carregados do Supabase (não do localStorage)
- ✅ Logs no console: `URL: true KEY: true`

## 🔍 Troubleshooting

### Erro: "expense_forecasts não encontrada"
- Verifique se executou a migração 1 corretamente
- Confirme que a tabela foi criada no dashboard

### Erro: "category_id não pode ser nulo"
- Execute a migração 2.4 para criar categorias
- Ou crie categorias manualmente

### Erro: "URL: false KEY: false"
- Verifique o arquivo `.env`
- Confirme que as credenciais estão corretas
- Reinicie o servidor

### Tipos do TypeScript não atualizados
- Regenere os types no dashboard
- Substitua completamente o arquivo `types.ts`
- Reinicie o servidor

## 📊 Estrutura das Tabelas

### expense_forecasts
- `id`: UUID (Primary Key)
- `description`: TEXT (Descrição da despesa)
- `amount`: NUMERIC (Valor)
- `type`: TEXT ('fixa' ou 'variavel')
- `category_id`: UUID (Foreign Key para financial_categories)
- `due_day`: INTEGER (Dia do vencimento 1-31)
- `is_active`: BOOLEAN (Se está ativa)
- `notes`: TEXT (Observações)
- `import_category`: TEXT (Categoria para importação)

### revenue_forecasts
- `id`: UUID (Primary Key)
- `description`: TEXT (Descrição da receita)
- `amount`: NUMERIC (Valor)
- `type`: TEXT ('fixa' ou 'variavel')
- `category_id`: UUID (Foreign Key para financial_categories)
- `due_day`: INTEGER (Dia do recebimento 1-31)
- `is_active`: BOOLEAN (Se está ativa)
- `notes`: TEXT (Observações)
- `import_category`: TEXT (Categoria para importação)

## 🎯 Funcionalidades dos Filtros

Após a configuração, os seguintes filtros estarão disponíveis:

1. **Pesquisa por texto**: Busca em descrição, observações e nome da categoria
2. **Filtro de tipo**: Fixa ou Variável
3. **Filtro de categoria**: Dropdown com todas as categorias disponíveis
4. **Visualização**: Lista, Compacto ou Ultra-compacto
5. **Separação por abas**: Receitas e Despesas separadas
6. **Totalizadores**: Valores totais por tipo e fluxo de caixa 