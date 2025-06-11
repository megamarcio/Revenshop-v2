
import { useState, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';
import { CustomerBankStatement, CustomerPaymentDocument } from './types';
import * as operations from './operations';

export * from './types';

export const useCustomerDocuments = (customerId?: string) => {
  const [bankStatements, setBankStatements] = useState<CustomerBankStatement[]>([]);
  const [paymentDocuments, setPaymentDocuments] = useState<CustomerPaymentDocument[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const fetchBankStatements = useCallback(async () => {
    if (!customerId) return;
    
    try {
      const data = await operations.fetchBankStatements(customerId);
      setBankStatements(data);
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
      const data = await operations.fetchPaymentDocuments(customerId);
      setPaymentDocuments(data);
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
      const result = await operations.uploadBankStatement(file, customerId);
      if (result) {
        setBankStatements(prev => [result, ...prev]);
      }
      return result;
    } finally {
      setUploading(false);
    }
  };

  const uploadPaymentDocument = async (file: File): Promise<CustomerPaymentDocument | null> => {
    if (!customerId) return null;

    try {
      setUploading(true);
      const result = await operations.uploadPaymentDocument(file, customerId);
      if (result) {
        setPaymentDocuments(prev => [result, ...prev]);
      }
      return result;
    } finally {
      setUploading(false);
    }
  };

  const removeBankStatement = useCallback(async (id: string) => {
    try {
      await operations.removeBankStatement(id, bankStatements);
      setBankStatements(prev => prev.filter(doc => doc.id !== id));
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
      await operations.removePaymentDocument(id, paymentDocuments);
      setPaymentDocuments(prev => prev.filter(doc => doc.id !== id));
    } catch (error) {
      console.error('Error removing payment document:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao remover documento de pagamento.',
        variant: 'destructive',
      });
    }
  }, [paymentDocuments]);

  return {
    bankStatements,
    paymentDocuments,
    loading,
    uploading,
    fetchBankStatements,
    fetchPaymentDocuments,
    uploadBankStatement,
    uploadPaymentDocument,
    removeBankStatement,
    removePaymentDocument,
  };
};
