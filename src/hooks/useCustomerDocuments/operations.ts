
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { CustomerBankStatement, CustomerPaymentDocument } from './types';
import { validateFile, generateFileName, extractStoragePath } from './utils';

export const fetchBankStatements = async (customerId: string): Promise<CustomerBankStatement[]> => {
  const { data, error } = await supabase
    .from('customer_bank_statements')
    .select('*')
    .eq('customer_id', customerId)
    .order('uploaded_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const fetchPaymentDocuments = async (customerId: string): Promise<CustomerPaymentDocument[]> => {
  const { data, error } = await supabase
    .from('customer_payment_documents')
    .select('*')
    .eq('customer_id', customerId)
    .order('uploaded_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const uploadBankStatement = async (file: File, customerId: string): Promise<CustomerBankStatement | null> => {
  try {
    // Validar arquivo
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    validateFile(file, allowedTypes);

    // Gerar nome único para o arquivo
    const fileName = generateFileName(customerId, 'bank', file);
    const filePath = `bank-statements/${customerId}/${fileName}`;

    // Upload para Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('customer-documents')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    // Obter URL pública
    const { data: { publicUrl } } = supabase.storage
      .from('customer-documents')
      .getPublicUrl(filePath);

    // Salvar no banco de dados
    const { data: docData, error: dbError } = await supabase
      .from('customer_bank_statements')
      .insert({
        customer_id: customerId,
        url: publicUrl
      })
      .select()
      .single();

    if (dbError) throw dbError;
    
    toast({
      title: 'Sucesso',
      description: 'Extrato bancário adicionado com sucesso.',
    });
    
    return docData;
  } catch (error) {
    console.error('Error uploading bank statement:', error);
    toast({
      title: 'Erro',
      description: error instanceof Error ? error.message : 'Erro ao adicionar extrato bancário.',
      variant: 'destructive',
    });
    return null;
  }
};

export const uploadPaymentDocument = async (file: File, customerId: string): Promise<CustomerPaymentDocument | null> => {
  try {
    // Validar arquivo
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    validateFile(file, allowedTypes);

    // Gerar nome único para o arquivo
    const fileName = generateFileName(customerId, 'payment', file);
    const filePath = `payment-documents/${customerId}/${fileName}`;

    // Upload para Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('customer-documents')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    // Obter URL pública
    const { data: { publicUrl } } = supabase.storage
      .from('customer-documents')
      .getPublicUrl(filePath);

    // Salvar no banco de dados
    const { data: docData, error: dbError } = await supabase
      .from('customer_payment_documents')
      .insert({
        customer_id: customerId,
        url: publicUrl
      })
      .select()
      .single();

    if (dbError) throw dbError;
    
    toast({
      title: 'Sucesso',
      description: 'Documento de pagamento adicionado com sucesso.',
    });
    
    return docData;
  } catch (error) {
    console.error('Error uploading payment document:', error);
    toast({
      title: 'Erro',
      description: error instanceof Error ? error.message : 'Erro ao adicionar documento de pagamento.',
      variant: 'destructive',
    });
    return null;
  }
};

export const removeBankStatement = async (id: string, statements: CustomerBankStatement[]): Promise<void> => {
  const statement = statements.find(s => s.id === id);
  if (!statement) return;

  // Extrair path do storage da URL
  const storagePath = extractStoragePath(statement.url, 'customer-documents');
  
  if (storagePath) {
    // Remover do Storage
    const { error: storageError } = await supabase.storage
      .from('customer-documents')
      .remove([storagePath]);

    if (storageError) {
      console.warn('Error removing from storage:', storageError);
    }
  }

  // Remover do banco de dados
  const { error } = await supabase
    .from('customer_bank_statements')
    .delete()
    .eq('id', id);

  if (error) throw error;
  
  toast({
    title: 'Sucesso',
    description: 'Extrato bancário removido com sucesso.',
  });
};

export const removePaymentDocument = async (id: string, documents: CustomerPaymentDocument[]): Promise<void> => {
  const document = documents.find(d => d.id === id);
  if (!document) return;

  // Extrair path do storage da URL
  const storagePath = extractStoragePath(document.url, 'customer-documents');
  
  if (storagePath) {
    // Remover do Storage
    const { error: storageError } = await supabase.storage
      .from('customer-documents')
      .remove([storagePath]);

    if (storageError) {
      console.warn('Error removing from storage:', storageError);
    }
  }

  // Remover do banco de dados
  const { error } = await supabase
    .from('customer_payment_documents')
    .delete()
    .eq('id', id);

  if (error) throw error;
  
  toast({
    title: 'Sucesso',
    description: 'Documento de pagamento removido com sucesso.',
  });
};
