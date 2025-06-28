-- Create expense_forecasts table
CREATE TABLE IF NOT EXISTS expense_forecasts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  description text NOT NULL,
  amount numeric(10,2) NOT NULL,
  type text NOT NULL CHECK (type IN ('fixa', 'variavel')),
  category text NOT NULL,
  due_day integer NOT NULL CHECK (due_day >= 1 AND due_day <= 31),
  is_active boolean DEFAULT true,
  notes text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  created_by uuid REFERENCES profiles(id)
);

-- Create index for better performance
CREATE INDEX idx_expense_forecasts_type ON expense_forecasts(type);
CREATE INDEX idx_expense_forecasts_is_active ON expense_forecasts(is_active);
CREATE INDEX idx_expense_forecasts_created_at ON expense_forecasts(created_at);

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