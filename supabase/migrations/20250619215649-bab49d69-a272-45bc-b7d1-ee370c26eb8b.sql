
-- Adicionar campos para despesas recorrentes na tabela expenses
ALTER TABLE expenses 
ADD COLUMN is_recurring boolean NOT NULL DEFAULT false,
ADD COLUMN recurring_interval integer DEFAULT 1,
ADD COLUMN recurring_start_date date,
ADD COLUMN recurring_end_date date,
ADD COLUMN parent_expense_id uuid REFERENCES expenses(id),
ADD COLUMN is_active_recurring boolean NOT NULL DEFAULT true;

-- Criar índices para otimizar consultas de despesas recorrentes
CREATE INDEX idx_expenses_recurring ON expenses(is_recurring, is_active_recurring) WHERE is_recurring = true;
CREATE INDEX idx_expenses_parent ON expenses(parent_expense_id) WHERE parent_expense_id IS NOT NULL;

-- Habilitar extensões necessárias para cron jobs
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;
