-- Criar tabela para registros de pedágios
CREATE TABLE IF NOT EXISTS toll_records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  vehicle_id UUID REFERENCES vehicles(id) ON DELETE SET NULL,
  vehicle_plate VARCHAR(20),
  toll_tag VARCHAR(50),
  toll_location VARCHAR(255),
  toll_amount DECIMAL(10,2) NOT NULL,
  toll_date TIMESTAMP WITH TIME ZONE NOT NULL,
  transaction_id VARCHAR(100),
  operator_name VARCHAR(100),
  lane_number VARCHAR(20),
  vehicle_class VARCHAR(50),
  payment_method VARCHAR(50),
  is_reconciled BOOLEAN DEFAULT false,
  reconciled_at TIMESTAMP WITH TIME ZONE,
  reconciled_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Criar tabela para importação de dados CSV
CREATE TABLE IF NOT EXISTS toll_imports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  filename VARCHAR(255) NOT NULL,
  total_records INTEGER DEFAULT 0,
  processed_records INTEGER DEFAULT 0,
  failed_records INTEGER DEFAULT 0,
  import_status VARCHAR(50) DEFAULT 'pending' CHECK (import_status IN ('pending', 'processing', 'completed', 'failed')),
  error_log TEXT,
  imported_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Criar tabela para configurações de tags de pedágio por veículo
CREATE TABLE IF NOT EXISTS vehicle_toll_tags (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  vehicle_id UUID REFERENCES vehicles(id) ON DELETE CASCADE,
  tag_number VARCHAR(50) NOT NULL,
  tag_type VARCHAR(50),
  is_active BOOLEAN DEFAULT true,
  start_date DATE,
  end_date DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(vehicle_id, tag_number)
);

-- Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_toll_records_vehicle_id ON toll_records(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_toll_records_plate ON toll_records(vehicle_plate);
CREATE INDEX IF NOT EXISTS idx_toll_records_tag ON toll_records(toll_tag);
CREATE INDEX IF NOT EXISTS idx_toll_records_date ON toll_records(toll_date);
CREATE INDEX IF NOT EXISTS idx_toll_records_reconciled ON toll_records(is_reconciled);
CREATE INDEX IF NOT EXISTS idx_vehicle_toll_tags_vehicle ON vehicle_toll_tags(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_vehicle_toll_tags_tag ON vehicle_toll_tags(tag_number);

-- Habilitar RLS (Row Level Security)
ALTER TABLE toll_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE toll_imports ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicle_toll_tags ENABLE ROW LEVEL SECURITY;

-- Políticas para toll_records
CREATE POLICY "Allow read access for authenticated users" ON toll_records
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all operations for admin users" ON toll_records
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('admin', 'manager')
    )
  );

-- Políticas para toll_imports
CREATE POLICY "Allow read access for authenticated users" ON toll_imports
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all operations for admin users" ON toll_imports
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('admin', 'manager')
    )
  );

-- Políticas para vehicle_toll_tags
CREATE POLICY "Allow read access for authenticated users" ON vehicle_toll_tags
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all operations for admin users" ON vehicle_toll_tags
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('admin', 'manager')
    )
  );

-- Funções para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_toll_records_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_toll_imports_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_vehicle_toll_tags_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para atualizar updated_at
CREATE TRIGGER update_toll_records_updated_at
  BEFORE UPDATE ON toll_records
  FOR EACH ROW
  EXECUTE FUNCTION update_toll_records_updated_at();

CREATE TRIGGER update_toll_imports_updated_at
  BEFORE UPDATE ON toll_imports
  FOR EACH ROW
  EXECUTE FUNCTION update_toll_imports_updated_at();

CREATE TRIGGER update_vehicle_toll_tags_updated_at
  BEFORE UPDATE ON vehicle_toll_tags
  FOR EACH ROW
  EXECUTE FUNCTION update_vehicle_toll_tags_updated_at();

-- Inserir alguns dados de exemplo para teste
INSERT INTO vehicle_toll_tags (vehicle_id, tag_number, tag_type, notes)
SELECT 
  v.id,
  'TAG' || LPAD((ROW_NUMBER() OVER())::text, 6, '0'),
  'SEM_PARAR',
  'Tag configurada automaticamente'
FROM vehicles v
LIMIT 5; 