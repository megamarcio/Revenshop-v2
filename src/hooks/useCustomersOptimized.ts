
import { useState, useEffect, useCallback } from 'react';
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

interface UseCustomersOptions {
  limit?: number;
  searchTerm?: string;
  sellerId?: string;
}

export const useCustomersOptimized = (options: UseCustomersOptions = {}) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);

  const { limit = 20, searchTerm, sellerId } = options;

  const fetchCustomers = useCallback(async (offset = 0) => {
    try {
      console.log('Fetching customers with options:', { limit, offset, searchTerm, sellerId });
      
      let query = supabase
        .from('bhph_customers')
        .select('id, name, email, phone, address, created_at, updated_at')
        .order('created_at', { ascending: false });

      // Filtrar por vendedor se especificado
      if (sellerId) {
        query = query.eq('responsible_seller_id', sellerId);
      }

      // Adicionar busca por termo se especificado
      if (searchTerm && searchTerm.length > 0) {
        query = query.or(`name.ilike.%${searchTerm}%,phone.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`);
      }

      // Adicionar paginação
      query = query.range(offset, offset + limit - 1);

      const { data, error } = await query;

      if (error) {
        console.error('Supabase error fetching customers:', error);
        throw error;
      }
      
      console.log('Customers fetched successfully:', data?.length || 0, 'customers');
      
      if (offset === 0) {
        setCustomers(data || []);
      } else {
        setCustomers(prev => [...prev, ...data || []]);
      }

      setHasMore((data || []).length === limit);
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
  }, [limit, searchTerm, sellerId]);

  const createCustomer = useCallback(async (customerData: {
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
  }, []);

  const loadMore = useCallback(() => {
    fetchCustomers(customers.length);
  }, [fetchCustomers, customers.length]);

  const refetch = useCallback(() => {
    setLoading(true);
    fetchCustomers();
  }, [fetchCustomers]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  return {
    customers,
    loading,
    hasMore,
    loadMore,
    createCustomer,
    refetch,
  };
};
