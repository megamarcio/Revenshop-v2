
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface DashboardStats {
  totalVehicles: number;
  vehiclesForSale: number;
  vehiclesSold: number;
  totalRevenue: number;
  totalProfit: number;
  averageProfit: number;
  loading: boolean;
}

export const useDashboardStats = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalVehicles: 0,
    vehiclesForSale: 0,
    vehiclesSold: 0,
    totalRevenue: 0,
    totalProfit: 0,
    averageProfit: 0,
    loading: true,
  });

  const fetchStats = async () => {
    try {
      // Fetch vehicles data
      const { data: vehicles, error: vehiclesError } = await supabase
        .from('vehicles')
        .select('category, purchase_price, sale_price');

      if (vehiclesError) throw vehiclesError;

      // Fetch sales data
      const { data: sales, error: salesError } = await supabase
        .from('sales')
        .select('final_sale_price');

      if (salesError) throw salesError;

      const totalVehicles = vehicles?.length || 0;
      const vehiclesForSale = vehicles?.filter(v => v.category === 'forSale').length || 0;
      const vehiclesSold = vehicles?.filter(v => v.category === 'sold').length || 0;
      
      const totalRevenue = sales?.reduce((sum, sale) => sum + (sale.final_sale_price || 0), 0) || 0;
      
      const soldVehicles = vehicles?.filter(v => v.category === 'sold') || [];
      const totalProfit = soldVehicles.reduce((sum, vehicle) => {
        return sum + (vehicle.sale_price - vehicle.purchase_price);
      }, 0);
      
      const averageProfit = vehiclesSold > 0 ? totalProfit / vehiclesSold : 0;

      setStats({
        totalVehicles,
        vehiclesForSale,
        vehiclesSold,
        totalRevenue,
        totalProfit,
        averageProfit,
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
