
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface DashboardStats {
  vehiclesForSale: number;
  vehiclesSold: number;
  totalSoldValue: number;
  totalBudgetValue: number;
  loading: boolean;
}

export interface DateFilter {
  month: number;
  year: number;
}

export const useDashboardStats = () => {
  const currentDate = new Date();
  const [dateFilter, setDateFilter] = useState<DateFilter>({
    month: currentDate.getMonth() + 1,
    year: currentDate.getFullYear()
  });

  const [stats, setStats] = useState<DashboardStats>({
    vehiclesForSale: 0,
    vehiclesSold: 0,
    totalSoldValue: 0,
    totalBudgetValue: 0,
    loading: true,
  });

  const fetchStats = async () => {
    try {
      console.log('Fetching dashboard stats for:', dateFilter);
      setStats(prev => ({ ...prev, loading: true }));
      
      // Fetch vehicles data
      const { data: vehicles, error: vehiclesError } = await supabase
        .from('vehicles')
        .select('category, purchase_price, sale_price');

      if (vehiclesError) {
        console.error('Error fetching vehicles:', vehiclesError);
        throw vehiclesError;
      }

      // Fetch sales data with date filter
      const startDate = new Date(dateFilter.year, dateFilter.month - 1, 1);
      const endDate = new Date(dateFilter.year, dateFilter.month, 0);
      
      const { data: sales, error: salesError } = await supabase
        .from('sales')
        .select('final_sale_price, sale_date')
        .gte('sale_date', startDate.toISOString().split('T')[0])
        .lte('sale_date', endDate.toISOString().split('T')[0]);

      if (salesError) {
        console.error('Error fetching sales:', salesError);
        throw salesError;
      }

      // Fetch customer deals for budget calculations
      const { data: deals, error: dealsError } = await supabase
        .from('customer_deals')
        .select('total_amount, created_at, status')
        .gte('created_at', startDate.toISOString())
        .lt('created_at', new Date(dateFilter.year, dateFilter.month, 1).toISOString());

      if (dealsError) {
        console.error('Error fetching deals:', dealsError);
        throw dealsError;
      }

      const vehiclesForSale = vehicles?.filter(v => v.category === 'forSale').length || 0;
      const vehiclesSold = sales?.length || 0;
      const totalSoldValue = sales?.reduce((sum, sale) => sum + (sale.final_sale_price || 0), 0) || 0;
      const totalBudgetValue = deals?.reduce((sum, deal) => sum + (deal.total_amount || 0), 0) || 0;

      console.log('Dashboard stats calculated:', {
        vehiclesForSale,
        vehiclesSold,
        totalSoldValue,
        totalBudgetValue
      });

      setStats({
        vehiclesForSale,
        vehiclesSold,
        totalSoldValue,
        totalBudgetValue,
        loading: false,
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      setStats(prev => ({ ...prev, loading: false }));
    }
  };

  useEffect(() => {
    fetchStats();
  }, [dateFilter]);

  return { 
    stats, 
    dateFilter, 
    setDateFilter, 
    refetch: fetchStats 
  };
};
