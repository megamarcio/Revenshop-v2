
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone: string;
  address?: string;
  created_at: string;
  updated_at: string;
}

export const useCustomers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCustomers = async () => {
    try {
      console.log('Fetching customers from database...');
      const { data, error } = await supabase
        .from('bhph_customers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error fetching customers:', error);
        throw error;
      }
      
      console.log('Customers fetched successfully:', data?.length || 0, 'customers');
      setCustomers(data || []);
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

  const createCustomer = async (customerData: {
    name: string;
    email?: string;
    phone: string;
    address?: string;
  }) => {
    try {
      console.log('Creating customer with data:', customerData);
      
      const { data, error } = await supabase
        .from('bhph_customers')
        .insert({
          name: customerData.name,
          email: customerData.email || null,
          phone: customerData.phone,
          address: customerData.address || null,
        })
        .select()
        .single();

      if (error) {
        console.error('Supabase error creating customer:', error);
        throw error;
      }
      
      console.log('Customer created successfully:', data);
      setCustomers(prev => [data, ...prev]);
      return data;
    } catch (error) {
      console.error('Error creating customer:', error);
      throw error;
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
    payment_method?: string;
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
    createSaleRecord,
    refetch: fetchCustomers,
  };
};
