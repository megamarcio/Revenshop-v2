
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '../contexts/AuthContext';

export interface UserStats {
  vehiclesListed: number;
  totalSalesValue: number;
  totalSalesCount: number;
  avgSaleTime: number;
  memberSince: string;
  monthsActive: number;
  recentActivities: Array<{
    action: string;
    detail: string;
    time: string;
  }>;
}

export const useUserStats = () => {
  const { user, isAdmin, isManager } = useAuth();
  const [stats, setStats] = useState<UserStats>({
    vehiclesListed: 0,
    totalSalesValue: 0,
    totalSalesCount: 0,
    avgSaleTime: 0,
    memberSince: new Date().toISOString(),
    monthsActive: 0,
    recentActivities: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchUserStats = async () => {
      try {
        setLoading(true);
        
        // Fetch vehicles data
        let vehiclesQuery = supabase
          .from('vehicles')
          .select('id, category, sale_date, created_at');

        // For non-admin/manager users, filter by their own vehicles
        if (!isAdmin && !isManager) {
          vehiclesQuery = vehiclesQuery.eq('seller_id', user.id);
        }

        const { data: vehicles, error: vehiclesError } = await vehiclesQuery;

        if (vehiclesError) {
          console.error('Error fetching vehicles:', vehiclesError);
          throw vehiclesError;
        }

        // Fetch sales data
        let salesQuery = supabase
          .from('sales')
          .select('id, final_sale_price, sale_date, vehicle_id');

        const { data: sales, error: salesError } = await salesQuery;

        if (salesError) {
          console.error('Error fetching sales:', salesError);
          throw salesError;
        }

        // Filter sales for non-admin/manager users
        let userSales = sales || [];
        if (!isAdmin && !isManager && vehicles) {
          const userVehicleIds = vehicles.map(v => v.id);
          userSales = sales?.filter(sale => userVehicleIds.includes(sale.vehicle_id)) || [];
        }

        // Calculate statistics
        const vehiclesForSale = vehicles?.filter(v => v.category === 'forSale').length || 0;
        const totalSalesValue = userSales.reduce((sum, sale) => sum + (sale.final_sale_price || 0), 0);
        const totalSalesCount = userSales.length;

        // Calculate average sale time
        let avgSaleTime = 0;
        if (userSales.length > 0 && vehicles) {
          const salesWithDuration = userSales
            .map(sale => {
              const vehicle = vehicles.find(v => v.id === sale.vehicle_id);
              if (vehicle && vehicle.created_at && sale.sale_date) {
                const listDate = new Date(vehicle.created_at);
                const saleDate = new Date(sale.sale_date);
                return Math.floor((saleDate.getTime() - listDate.getTime()) / (1000 * 60 * 60 * 24));
              }
              return null;
            })
            .filter(duration => duration !== null) as number[];

          if (salesWithDuration.length > 0) {
            avgSaleTime = Math.round(salesWithDuration.reduce((sum, duration) => sum + duration, 0) / salesWithDuration.length);
          }
        }

        // Get user creation date from profile
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('created_at')
          .eq('id', user.id)
          .single();

        if (profileError) {
          console.error('Error fetching profile:', profileError);
        }

        const memberSince = profile?.created_at || new Date().toISOString();
        const monthsActive = Math.floor((Date.now() - new Date(memberSince).getTime()) / (1000 * 60 * 60 * 24 * 30));

        // Mock recent activities for now - could be enhanced to fetch real data
        const recentActivities = [
          { action: 'Perfil visualizado', detail: 'Página de estatísticas', time: 'Agora' },
          { action: 'Login realizado', detail: 'Acesso ao sistema', time: 'Hoje' }
        ];

        setStats({
          vehiclesListed: vehiclesForSale,
          totalSalesValue,
          totalSalesCount,
          avgSaleTime,
          memberSince,
          monthsActive,
          recentActivities
        });

      } catch (error) {
        console.error('Error fetching user stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserStats();
  }, [user, isAdmin, isManager]);

  return { stats, loading };
};
