
import React from 'react';
import { useRecentActivities } from '../../hooks/useRecentActivities';
import { ShoppingCart, Car, Users } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const iconMap = {
  ShoppingCart: ShoppingCart,
  Car: Car,
  Users: Users,
};

const RecentActivities = () => {
  const { activities, loading } = useRecentActivities();

  if (loading) {
    return (
      <div className="bg-card rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-foreground mb-4">Atividade Recente</h2>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center space-x-3 p-3 bg-muted rounded-lg animate-pulse">
              <div className="bg-gray-300 p-2 rounded-full w-8 h-8"></div>
              <div className="flex-1">
                <div className="bg-gray-300 h-4 rounded mb-1"></div>
                <div className="bg-gray-300 h-3 rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="bg-card rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-foreground mb-4">Atividade Recente</h2>
        <div className="text-center py-8">
          <p className="text-muted-foreground">Nenhuma atividade recente encontrada</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold text-foreground mb-4">Atividade Recente</h2>
      <div className="space-y-3">
        {activities.map((activity) => {
          const IconComponent = iconMap[activity.icon as keyof typeof iconMap] || Car;
          
          return (
            <div key={activity.id} className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
              <div className={`p-2 rounded-full ${activity.color}`}>
                <IconComponent className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{activity.title}</p>
                <p className="text-xs text-muted-foreground">{activity.description}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatDistanceToNow(new Date(activity.timestamp), { 
                    addSuffix: true, 
                    locale: ptBR 
                  })}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecentActivities;
