
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const useCustomerAssignment = () => {
  const [loading, setLoading] = useState(false);

  const assignCustomerToSeller = async (customerId: string, sellerId: string) => {
    setLoading(true);
    try {
      console.log('Assigning customer to seller:', { customerId, sellerId });
      
      const { error } = await supabase
        .from('bhph_customers')
        .update({ responsible_seller_id: sellerId })
        .eq('id', customerId);

      if (error) {
        console.error('Error assigning customer to seller:', error);
        throw error;
      }

      console.log('Customer assigned successfully');
      toast({
        title: 'Sucesso',
        description: 'Cliente atribuído ao vendedor com sucesso!',
      });

      return true;
    } catch (error) {
      console.error('Error in assignCustomerToSeller:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao atribuir cliente ao vendedor',
        variant: 'destructive',
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateCustomer = async (customerId: string, customerData: any) => {
    setLoading(true);
    try {
      console.log('Updating customer:', { customerId, customerData });
      
      const { error } = await supabase
        .from('bhph_customers')
        .update(customerData)
        .eq('id', customerId);

      if (error) {
        console.error('Error updating customer:', error);
        throw error;
      }

      console.log('Customer updated successfully');
      toast({
        title: 'Sucesso',
        description: 'Cliente atualizado com sucesso!',
      });

      return true;
    } catch (error) {
      console.error('Error in updateCustomer:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao atualizar cliente',
        variant: 'destructive',
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    assignCustomerToSeller,
    updateCustomer,
    loading,
  };
};
