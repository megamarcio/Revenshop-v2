
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

  const addBankStatement = useCallback(async (url: string) => {
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

  const removeBankStatement = useCallback(async (id: string) => {
    try {
      const { error } = await supabase
        .from('customer_bank_statements')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setBankStatements(prev => prev.filter(doc => doc.id !== id));
    } catch (error) {
      console.error('Error removing bank statement:', error);
      throw error;
    }
  }, []);

  const removePaymentDocument = useCallback(async (id: string) => {
    try {
      const { error } = await supabase
        .from('customer_payment_documents')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setPaymentDocuments(prev => prev.filter(doc => doc.id !== id));
    } catch (error) {
      console.error('Error removing payment document:', error);
      throw error;
    }
  }, []);

  return {
    bankStatements,
    paymentDocuments,
    loading,
    fetchBankStatements,
    fetchPaymentDocuments,
    addBankStatement,
    addPaymentDocument,
    removeBankStatement,
    removePaymentDocument,
  };
};
