
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface DashboardStats {
  totalVehicles: number;
  vehiclesForSale: number;
  vehiclesSold: number;
  totalRevenue: number;
  totalProfit: number;
  totalSellers: number;
  loading: boolean;
}

export const useDashboardStats = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalVehicles: 0,
    vehiclesForSale: 0,
    vehiclesSold: 0,
    totalRevenue: 0,
    totalProfit: 0,
    totalSellers: 0,
    loading: true,
  });

  const fetchStats = async () => {
    try {
      console.log('Fetching dashboard stats...');
      
      // Fetch vehicles data
      const { data: vehicles, error: vehiclesError } = await supabase
        .from('vehicles')
        .select('category, purchase_price, sale_price');

      if (vehiclesError) {
        console.error('Error fetching vehicles:', vehiclesError);
        throw vehiclesError;
      }

      // Fetch sales data
      const { data: sales, error: salesError } = await supabase
        .from('sales')
        .select('final_sale_price');

      if (salesError) {
        console.error('Error fetching sales:', salesError);
        throw salesError;
      }

      // Fetch sellers count
      const { data: sellers, error: sellersError } = await supabase
        .from('profiles')
        .select('id')
        .eq('role', 'seller');

      if (sellersError) {
        console.error('Error fetching sellers:', sellersError);
        throw sellersError;
      }

      const totalVehicles = vehicles?.length || 0;
      const vehiclesForSale = vehicles?.filter(v => v.category === 'forSale').length || 0;
      const vehiclesSold = vehicles?.filter(v => v.category === 'sold').length || 0;
      
      const totalRevenue = sales?.reduce((sum, sale) => sum + (sale.final_sale_price || 0), 0) || 0;
      
      const soldVehicles = vehicles?.filter(v => v.category === 'sold') || [];
      const totalProfit = soldVehicles.reduce((sum, vehicle) => {
        return sum + (vehicle.sale_price - vehicle.purchase_price);
      }, 0);
      
      const totalSellers = sellers?.length || 0;

      console.log('Dashboard stats calculated:', {
        totalVehicles,
        vehiclesForSale,
        vehiclesSold,
        totalRevenue,
        totalProfit,
        totalSellers
      });

      setStats({
        totalVehicles,
        vehiclesForSale,
        vehiclesSold,
        totalRevenue,
        totalProfit,
        totalSellers,
        loading: false,
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      setStats(prev => ({ ...prev, loading: false }));
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return { stats, refetch: fetchStats };
};
