
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Activity {
  id: string;
  type: 'vehicle_added' | 'vehicle_sold' | 'user_created';
  title: string;
  description: string;
  icon: string;
  color: string;
  timestamp: string;
}

export const useRecentActivities = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRecentActivities = async () => {
    try {
      console.log('Fetching recent activities...');
      
      const activities: Activity[] = [];

      // Fetch recent vehicle additions
      const { data: recentVehicles, error: vehiclesError } = await supabase
        .from('vehicles')
        .select('id, name, created_at, category')
        .order('created_at', { ascending: false })
        .limit(5);

      if (vehiclesError) {
        console.error('Error fetching recent vehicles:', vehiclesError);
      } else if (recentVehicles) {
        recentVehicles.forEach(vehicle => {
          if (vehicle.category === 'sold') {
            activities.push({
              id: `vehicle-sold-${vehicle.id}`,
              type: 'vehicle_sold',
              title: `${vehicle.name} - Vendido`,
              description: `Veículo vendido com sucesso`,
              icon: 'ShoppingCart',
              color: 'bg-green-100 text-green-600',
              timestamp: vehicle.created_at
            });
          } else {
            activities.push({
              id: `vehicle-added-${vehicle.id}`,
              type: 'vehicle_added',
              title: `${vehicle.name} - Cadastrado`,
              description: `Adicionado ao estoque`,
              icon: 'Car',
              color: 'bg-blue-100 text-blue-600',
              timestamp: vehicle.created_at
            });
          }
        });
      }

      // Fetch recent user creations
      const { data: recentUsers, error: usersError } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, created_at, role')
        .order('created_at', { ascending: false })
        .limit(3);

      if (usersError) {
        console.error('Error fetching recent users:', usersError);
      } else if (recentUsers) {
        recentUsers.forEach(user => {
          activities.push({
            id: `user-created-${user.id}`,
            type: 'user_created',
            title: `Novo ${user.role} cadastrado`,
            description: `${user.first_name} ${user.last_name} - Acesso liberado`,
            icon: 'Users',
            color: 'bg-purple-100 text-purple-600',
            timestamp: user.created_at
          });
        });
      }

      // Sort activities by timestamp (most recent first)
      activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

      console.log('Recent activities fetched:', activities.length);
      setActivities(activities.slice(0, 10)); // Limit to 10 most recent
      
    } catch (error) {
      console.error('Error fetching recent activities:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecentActivities();
  }, []);

  return { activities, loading, refetch: fetchRecentActivities };
};
