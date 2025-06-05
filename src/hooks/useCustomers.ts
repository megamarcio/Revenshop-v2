
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Customer } from '../types/customer';

export const useCustomers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCustomers = async () => {
    try {
      console.log('Fetching customers from database...');
      const { data, error } = await supabase
        .from('bhph_customers')
        .select(`
          *,
          assigned_user:profiles!assigned_to(first_name, last_name, email)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error fetching customers:', error);
        throw error;
      }
      
      console.log('Customers fetched successfully:', data?.length || 0, 'customers');
      
      // Transform the data to match our Customer interface
      const transformedCustomers: Customer[] = data?.map(customer => ({
        id: customer.id,
        first_name: customer.name?.split(' ')[0] || '',
        last_name: customer.name?.split(' ').slice(1).join(' ') || '',
        email: customer.email || '',
        phone: customer.phone || '',
        address: customer.address || '',
        city: '',
        state: '',
        zip_code: '',
        assigned_to: customer.responsible_seller_id,
        credit_score: customer.credit_score,
        income: customer.income,
        down_payment: 0,
        notes: '',
        created_at: customer.created_at,
        updated_at: customer.updated_at,
        assigned_user: Array.isArray(customer.assigned_user) ? customer.assigned_user[0] : customer.assigned_user
      })) || [];
      
      setCustomers(transformedCustomers);
    } catch (error) {
      console.error('Error fetching customers:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao carregar clientes',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const createCustomer = async (customerData: Omit<Customer, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      console.log('Creating customer with data:', customerData);
      
      const { data, error } = await supabase
        .from('bhph_customers')
        .insert({
          name: `${customerData.first_name} ${customerData.last_name}`.trim(),
          email: customerData.email || null,
          phone: customerData.phone,
          address: customerData.address || null,
          responsible_seller_id: customerData.assigned_to || null,
          credit_score: customerData.credit_score || null,
          income: customerData.income || null,
        })
        .select()
        .single();

      if (error) {
        console.error('Supabase error creating customer:', error);
        throw error;
      }
      
      console.log('Customer created successfully:', data);
      await fetchCustomers();
      
      toast({
        title: 'Sucesso',
        description: 'Cliente criado com sucesso!',
      });
      
      return true;
    } catch (error) {
      console.error('Error creating customer:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao criar cliente',
        variant: 'destructive',
      });
      return false;
    }
  };

  const updateCustomer = async (customerId: string, customerData: Omit<Customer, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      console.log('Updating customer with data:', customerData);
      
      const { data, error } = await supabase
        .from('bhph_customers')
        .update({
          name: `${customerData.first_name} ${customerData.last_name}`.trim(),
          email: customerData.email || null,
          phone: customerData.phone,
          address: customerData.address || null,
          responsible_seller_id: customerData.assigned_to || null,
          credit_score: customerData.credit_score || null,
          income: customerData.income || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', customerId)
        .select()
        .single();

      if (error) {
        console.error('Supabase error updating customer:', error);
        throw error;
      }
      
      console.log('Customer updated successfully:', data);
      await fetchCustomers();
      
      toast({
        title: 'Sucesso',
        description: 'Cliente atualizado com sucesso!',
      });
      
      return true;
    } catch (error) {
      console.error('Error updating customer:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao atualizar cliente',
        variant: 'destructive',
      });
      return false;
    }
  };

  const deleteCustomer = async (customerId: string) => {
    try {
      console.log('Deleting customer:', customerId);
      
      const { error } = await supabase
        .from('bhph_customers')
        .delete()
        .eq('id', customerId);

      if (error) {
        console.error('Supabase error deleting customer:', error);
        throw error;
      }
      
      console.log('Customer deleted successfully');
      await fetchCustomers();
      
      toast({
        title: 'Sucesso',
        description: 'Cliente excluído com sucesso!',
      });
      
      return true;
    } catch (error) {
      console.error('Error deleting customer:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao excluir cliente',
        variant: 'destructive',
      });
      return false;
    }
  };

  const createSaleRecord = async (saleData: {
    customer_id: string;
    vehicle_id: string;
    seller_id?: string;
    final_sale_price: number;
    sale_date: string;
    customer_name: string;
    customer_phone: string;
    payment_method?: 'cash' | 'financing' | 'bhph' | 'check' | 'other';
    financing_company?: string;
    check_details?: string;
    other_payment_details?: string;
    seller_commission?: number;
    sale_notes?: string;
  }) => {
    try {
      console.log('Creating sale record with data:', saleData);
      
      const { data, error } = await supabase
        .from('sales')
        .insert(saleData)
        .select()
        .single();

      if (error) {
        console.error('Supabase error creating sale:', error);
        throw error;
      }
      
      console.log('Sale record created successfully:', data);
      return data;
    } catch (error) {
      console.error('Error creating sale record:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return {
    customers,
    loading,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    createSaleRecord,
    refetch: fetchCustomers,
  };
};
