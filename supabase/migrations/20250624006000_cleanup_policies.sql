-- Migração para limpar políticas conflitantes
-- Remove todas as políticas que podem estar causando conflito

-- Remove políticas da tabela ai_settings
DROP POLICY IF EXISTS "Allow read for authenticated users" ON ai_settings;
DROP POLICY IF EXISTS "Allow insert/update for admins and managers" ON ai_settings;

-- Remove políticas da tabela whatsapp_groups
DROP POLICY IF EXISTS "Allow read for authenticated users" ON whatsapp_groups;
DROP POLICY IF EXISTS "Allow CRUD for admins and managers" ON whatsapp_groups;

-- Remove políticas da tabela company_settings
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON company_settings;

-- Remove políticas da tabela color_theme_settings
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON color_theme_settings;

-- Remove políticas da tabela website_settings
DROP POLICY IF EXISTS "Allow read access for authenticated users" ON website_settings;
DROP POLICY IF EXISTS "Allow all operations for admin users" ON website_settings;

-- Remove políticas da tabela toll_records
DROP POLICY IF EXISTS "Allow read access for authenticated users" ON toll_records;
DROP POLICY IF EXISTS "Allow all operations for admin users" ON toll_records;

-- Remove políticas da tabela toll_imports
DROP POLICY IF EXISTS "Allow read access for authenticated users" ON toll_imports;
DROP POLICY IF EXISTS "Allow all operations for admin users" ON toll_imports;

-- Remove políticas da tabela vehicle_toll_tags
DROP POLICY IF EXISTS "Allow read access for authenticated users" ON vehicle_toll_tags;
DROP POLICY IF EXISTS "Allow all operations for admin users" ON vehicle_toll_tags;

-- Remove políticas da tabela revenue_forecasts
DROP POLICY IF EXISTS "Users can view own revenue forecasts" ON revenue_forecasts;
DROP POLICY IF EXISTS "Users can insert own revenue forecasts" ON revenue_forecasts;
DROP POLICY IF EXISTS "Users can update own revenue forecasts" ON revenue_forecasts;
DROP POLICY IF EXISTS "Users can delete own revenue forecasts" ON revenue_forecasts;
DROP POLICY IF EXISTS "Users can view all revenue forecasts" ON revenue_forecasts;
DROP POLICY IF EXISTS "Users can insert revenue forecasts" ON revenue_forecasts;
DROP POLICY IF EXISTS "Users can update revenue forecasts" ON revenue_forecasts;
DROP POLICY IF EXISTS "Users can delete revenue forecasts" ON revenue_forecasts;

-- Remove políticas da tabela expense_forecasts
DROP POLICY IF EXISTS "Users can view all expense forecasts" ON expense_forecasts;
DROP POLICY IF EXISTS "Users can insert expense forecasts" ON expense_forecasts;
DROP POLICY IF EXISTS "Users can update expense forecasts" ON expense_forecasts;
DROP POLICY IF EXISTS "Users can delete expense forecasts" ON expense_forecasts;

-- Remove políticas da tabela maintenance_records
DROP POLICY IF EXISTS "Users can view all maintenance records" ON maintenance_records;
DROP POLICY IF EXISTS "Authenticated users can insert maintenance records" ON maintenance_records;
DROP POLICY IF EXISTS "Users can update their own maintenance records" ON maintenance_records;
DROP POLICY IF EXISTS "Users can delete their own maintenance records" ON maintenance_records;

-- Remove políticas da tabela technical_items
DROP POLICY IF EXISTS "Users can view all technical items" ON technical_items;
DROP POLICY IF EXISTS "Authenticated users can insert technical items" ON technical_items;
DROP POLICY IF EXISTS "Authenticated users can update technical items" ON technical_items;
DROP POLICY IF EXISTS "Authenticated users can delete technical items" ON technical_items;

-- Remove políticas da tabela financial_categories
DROP POLICY IF EXISTS "Anyone can view financial categories" ON financial_categories;
DROP POLICY IF EXISTS "Anyone can create financial categories" ON financial_categories;
DROP POLICY IF EXISTS "Anyone can update financial categories" ON financial_categories;
DROP POLICY IF EXISTS "Anyone can delete financial categories" ON financial_categories;

-- Remove políticas da tabela revenues
DROP POLICY IF EXISTS "Users can view all revenues" ON revenues;
DROP POLICY IF EXISTS "Users can create revenues" ON revenues;
DROP POLICY IF EXISTS "Users can update revenues" ON revenues;
DROP POLICY IF EXISTS "Users can delete revenues" ON revenues;

-- Remove políticas da tabela expenses
DROP POLICY IF EXISTS "Users can view all expenses" ON expenses;
DROP POLICY IF EXISTS "Users can create expenses" ON expenses;
DROP POLICY IF EXISTS "Users can update expenses" ON expenses;
DROP POLICY IF EXISTS "Users can delete expenses" ON expenses;

-- Remove políticas da tabela bank_statements
DROP POLICY IF EXISTS "Users can view all bank statements" ON bank_statements;
DROP POLICY IF EXISTS "Users can create bank statements" ON bank_statements;
DROP POLICY IF EXISTS "Users can update bank statements" ON bank_statements;
DROP POLICY IF EXISTS "Users can delete bank statements" ON bank_statements;

-- Remove políticas da tabela company_software
DROP POLICY IF EXISTS "Users can view all software" ON company_software;
DROP POLICY IF EXISTS "Users can create software" ON company_software;
DROP POLICY IF EXISTS "Users can update software" ON company_software;
DROP POLICY IF EXISTS "Users can delete software" ON company_software;

-- Remove políticas da tabela role_permissions
DROP POLICY IF EXISTS "Admins e gerentes podem ver todas as permissões" ON role_permissions;
DROP POLICY IF EXISTS "Admins e gerentes podem criar permissões" ON role_permissions;
DROP POLICY IF EXISTS "Admins e gerentes podem editar permissões" ON role_permissions;
DROP POLICY IF EXISTS "Admins e gerentes podem deletar permissões" ON role_permissions;

-- Remove políticas da tabela email_settings
DROP POLICY IF EXISTS "Allow all operations on email_settings" ON email_settings;

-- Remove políticas da tabela vehicle_videos
DROP POLICY IF EXISTS "Enable all access for vehicle_videos" ON vehicle_videos;

-- Remove políticas da tabela vehicle_card_photos
DROP POLICY IF EXISTS "Allow all to view card photos" ON vehicle_card_photos;
DROP POLICY IF EXISTS "Allow authenticated to insert card photos" ON vehicle_card_photos;
DROP POLICY IF EXISTS "Allow authenticated to update card photos" ON vehicle_card_photos;
DROP POLICY IF EXISTS "Allow authenticated to delete card photos" ON vehicle_card_photos;

-- Remove políticas da tabela import_data
DROP POLICY IF EXISTS "Allow read access for authenticated users" ON import_data;
DROP POLICY IF EXISTS "Allow all operations for admin users" ON import_data;

-- Remove políticas da tabela vehicles
DROP POLICY IF EXISTS "Enable all access for authenticated users" ON vehicles; 