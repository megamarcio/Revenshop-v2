
import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useDashboardStats } from '../../hooks/useDashboardStats';
import StatsCard from './StatsCard';
import RecentActivities from './RecentActivities';
import { DollarSign, Car, ShoppingCart, Users, TrendingUp } from 'lucide-react';

const Dashboard = () => {
  const { t } = useLanguage();
  const { stats, refetch } = useDashboardStats();

  if (stats.loading) {
    return (
      <div className="p-6 space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-revenshop-primary to-revenshop-secondary rounded-lg p-6 text-white">
          <h1 className="text-3xl font-bold mb-2">{t('welcome')}</h1>
          <p className="text-revenshop-light/90">{t('subtitle')}</p>
        </div>

        {/* Stats Grid - Loading state */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="bg-card rounded-lg shadow p-6 animate-pulse">
              <div className="flex items-center justify-between mb-2">
                <div className="bg-gray-300 h-4 rounded w-20"></div>
                <div className="bg-gray-300 w-8 h-8 rounded-lg"></div>
              </div>
              <div className="bg-gray-300 h-8 rounded w-16"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-revenshop-primary to-revenshop-secondary rounded-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">{t('welcome')}</h1>
        <p className="text-revenshop-light/90">{t('subtitle')}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        <StatsCard
          title="Total para Vender"
          value={stats.vehiclesForSale * 50000} // Estimativa baseada no número de veículos
          icon={DollarSign}
          color="bg-green-500"
          prefix="$ "
        />
        
        <StatsCard
          title="Total Vendido"
          value={stats.totalRevenue}
          icon={TrendingUp}
          color="bg-blue-500"
          prefix="$ "
        />
        
        <StatsCard
          title="Carros à Venda"
          value={stats.vehiclesForSale}
          icon={Car}
          color="bg-orange-500"
        />
        
        <StatsCard
          title="Carros Vendidos"
          value={stats.vehiclesSold}
          icon={ShoppingCart}
          color="bg-purple-500"
        />
        
        <StatsCard
          title="Total de Vendedores"
          value={stats.totalSellers}
          icon={Users}
          color="bg-revenshop-primary"
        />
      </div>

      {/* Recent Activity */}
      <RecentActivities />
    </div>
  );
};

export default Dashboard;
