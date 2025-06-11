
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface CustomerBankStatement {
  id: string;
  customer_id: string;
  url: string;
  uploaded_at: string;
}

export interface CustomerPaymentDocument {
  id: string;
  customer_id: string;
  url: string;
  uploaded_at: string;
}

export const useCustomerDocuments = (customerId?: string) => {
  const [bankStatements, setBankStatements] = useState<CustomerBankStatement[]>([]);
  const [paymentDocuments, setPaymentDocuments] = useState<CustomerPaymentDocument[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const fetchBankStatements = useCallback(async () => {
    if (!customerId) return;
    
    try {
      const { data, error } = await supabase
        .from('customer_bank_statements')
        .select('*')
        .eq('customer_id', customerId)
        .order('uploaded_at', { ascending: false });

      if (error) throw error;
      setBankStatements(data || []);
    } catch (error) {
      console.error('Error fetching bank statements:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao carregar extratos bancários',
        variant: 'destructive',
      });
    }
  }, [customerId]);

  const fetchPaymentDocuments = useCallback(async () => {
    if (!customerId) return;
    
    try {
      const { data, error } = await supabase
        .from('customer_payment_documents')
        .select('*')
        .eq('customer_id', customerId)
        .order('uploaded_at', { ascending: false });

      if (error) throw error;
      setPaymentDocuments(data || []);
    } catch (error) {
      console.error('Error fetching payment documents:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao carregar documentos de pagamento',
        variant: 'destructive',
      });
    }
  }, [customerId]);

  const uploadBankStatement = async (file: File): Promise<CustomerBankStatement | null> => {
    if (!customerId) return null;

    try {
      setUploading(true);
      
      // Validar arquivo
      const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        throw new Error('Apenas arquivos PDF, JPG e PNG são permitidos.');
      }

      if (file.size > 10 * 1024 * 1024) {
        throw new Error('O arquivo deve ter no máximo 10MB.');
      }

      // Gerar nome único para o arquivo
      const fileExt = file.name.split('.').pop();
      const fileName = `${customerId}-bank-${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `bank-statements/${customerId}/${fileName}`;

      // Upload para Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
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
      
      setBankStatements(prev => [docData, ...prev]);
      
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
    } finally {
      setUploading(false);
    }
  };

  const uploadPaymentDocument = async (file: File): Promise<CustomerPaymentDocument | null> => {
    if (!customerId) return null;

    try {
      setUploading(true);
      
      // Validar arquivo
      const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        throw new Error('Apenas arquivos PDF, JPG, PNG, DOC e DOCX são permitidos.');
      }

      if (file.size > 10 * 1024 * 1024) {
        throw new Error('O arquivo deve ter no máximo 10MB.');
      }

      // Gerar nome único para o arquivo
      const fileExt = file.name.split('.').pop();
      const fileName = `${customerId}-payment-${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `payment-documents/${customerId}/${fileName}`;

      // Upload para Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
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
      
      setPaymentDocuments(prev => [docData, ...prev]);
      
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
    } finally {
      setUploading(false);
    }
  };

  const removeBankStatement = useCallback(async (id: string) => {
    try {
      const statement = bankStatements.find(s => s.id === id);
      if (!statement) return;

      // Extrair path do storage da URL
      const url = new URL(statement.url);
      const pathSegments = url.pathname.split('/');
      const bucketIndex = pathSegments.findIndex(segment => segment === 'customer-documents');
      if (bucketIndex !== -1 && bucketIndex < pathSegments.length - 1) {
        const storagePath = pathSegments.slice(bucketIndex + 1).join('/');
        
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
      setBankStatements(prev => prev.filter(doc => doc.id !== id));
      
      toast({
        title: 'Sucesso',
        description: 'Extrato bancário removido com sucesso.',
      });
    } catch (error) {
      console.error('Error removing bank statement:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao remover extrato bancário.',
        variant: 'destructive',
      });
    }
  }, [bankStatements]);

  const removePaymentDocument = useCallback(async (id: string) => {
    try {
      const document = paymentDocuments.find(d => d.id === id);
      if (!document) return;

      // Extrair path do storage da URL
      const url = new URL(document.url);
      const pathSegments = url.pathname.split('/');
      const bucketIndex = pathSegments.findIndex(segment => segment === 'customer-documents');
      if (bucketIndex !== -1 && bucketIndex < pathSegments.length - 1) {
        const storagePath = pathSegments.slice(bucketIndex + 1).join('/');
        
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
      setPaymentDocuments(prev => prev.filter(doc => doc.id !== id));
      
      toast({
        title: 'Sucesso',
        description: 'Documento de pagamento removido com sucesso.',
      });
    } catch (error) {
      console.error('Error removing payment document:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao remover documento de pagamento.',
        variant: 'destructive',
      });
    }
  }, [paymentDocuments]);

  // Função de conveniência para usar como onUpload
  const addBankStatement = useCallback(async (url: string) => {
    // Esta função é mantida para compatibilidade, mas agora só será usada se for uma URL externa
    if (!customerId) return;

    try {
      const { data, error } = await supabase
        .from('customer_bank_statements')
        .insert({ customer_id: customerId, url })
        .select()
        .single();

      if (error) throw error;
      setBankStatements(prev => [data, ...prev]);
      return data;
    } catch (error) {
      console.error('Error adding bank statement:', error);
      throw error;
    }
  }, [customerId]);

  const addPaymentDocument = useCallback(async (url: string) => {
    // Esta função é mantida para compatibilidade, mas agora só será usada se for uma URL externa
    if (!customerId) return;

    try {
      const { data, error } = await supabase
        .from('customer_payment_documents')
        .insert({ customer_id: customerId, url })
        .select()
        .single();

      if (error) throw error;
      setPaymentDocuments(prev => [data, ...prev]);
      return data;
    } catch (error) {
      console.error('Error adding payment document:', error);
      throw error;
    }
  }, [customerId]);

  return {
    bankStatements,
    paymentDocuments,
    loading,
    uploading,
    fetchBankStatements,
    fetchPaymentDocuments,
    uploadBankStatement,
    uploadPaymentDocument,
    addBankStatement,
    addPaymentDocument,
    removeBankStatement,
    removePaymentDocument,
  };
};
