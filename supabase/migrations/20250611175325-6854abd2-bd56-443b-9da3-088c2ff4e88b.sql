
-- Criar bucket para documentos de clientes (extratos bancários e comprovantes de pagamento)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('customer-documents', 'customer-documents', true);

-- Criar bucket para recibos e comprovantes de manutenção
INSERT INTO storage.buckets (id, name, public) 
VALUES ('maintenance-receipts', 'maintenance-receipts', true);

-- Políticas para bucket customer-documents
CREATE POLICY "Allow authenticated users to upload customer documents" 
ON storage.objects FOR INSERT 
WITH CHECK (
  bucket_id = 'customer-documents' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Allow public access to customer documents" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'customer-documents');

CREATE POLICY "Allow users to update customer documents" 
ON storage.objects FOR UPDATE 
USING (bucket_id = 'customer-documents' AND auth.role() = 'authenticated');

CREATE POLICY "Allow users to delete customer documents" 
ON storage.objects FOR DELETE 
USING (bucket_id = 'customer-documents' AND auth.role() = 'authenticated');

-- Políticas para bucket maintenance-receipts
CREATE POLICY "Allow authenticated users to upload maintenance receipts" 
ON storage.objects FOR INSERT 
WITH CHECK (
  bucket_id = 'maintenance-receipts' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Allow public access to maintenance receipts" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'maintenance-receipts');

CREATE POLICY "Allow users to update maintenance receipts" 
ON storage.objects FOR UPDATE 
USING (bucket_id = 'maintenance-receipts' AND auth.role() = 'authenticated');

CREATE POLICY "Allow users to delete maintenance receipts" 
ON storage.objects FOR DELETE 
USING (bucket_id = 'maintenance-receipts' AND auth.role() = 'authenticated');
