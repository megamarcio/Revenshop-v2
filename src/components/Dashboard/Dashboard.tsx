
import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import StatsCard from './StatsCard';
import { DollarSign, Car, ShoppingCart, Users, TrendingUp } from 'lucide-react';

const Dashboard = () => {
  const { t } = useLanguage();

  // Mock data - in real app, this would come from API
  const stats = {
    totalToSell: 450000,
    totalSold: 180000,
    carsForSale: 12,
    carsSold: 8,
    totalSellers: 5
  };

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
          title={t('totalToSell')}
          value={stats.totalToSell}
          icon={DollarSign}
          color="bg-green-500"
          prefix="R$ "
        />
        
        <StatsCard
          title={t('totalSold')}
          value={stats.totalSold}
          icon={TrendingUp}
          color="bg-blue-500"
          prefix="R$ "
        />
        
        <StatsCard
          title={t('carsForSale')}
          value={stats.carsForSale}
          icon={Car}
          color="bg-orange-500"
        />
        
        <StatsCard
          title={t('carsSold')}
          value={stats.carsSold}
          icon={ShoppingCart}
          color="bg-purple-500"
        />
        
        <StatsCard
          title={t('totalSellers')}
          value={stats.totalSellers}
          icon={Users}
          color="bg-revenshop-primary"
        />
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Atividade Recente</h2>
        <div className="space-y-3">
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="bg-green-100 p-2 rounded-full">
              <ShoppingCart className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium">Honda Civic 2020 - Vendido</p>
              <p className="text-xs text-gray-500">Por João Silva - R$ 65.000</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="bg-blue-100 p-2 rounded-full">
              <Car className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium">Toyota Corolla 2021 - Cadastrado</p>
              <p className="text-xs text-gray-500">Adicionado ao estoque - R$ 75.000</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="bg-purple-100 p-2 rounded-full">
              <Users className="h-4 w-4 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium">Novo vendedor cadastrado</p>
              <p className="text-xs text-gray-500">Maria Santos - Acesso liberado</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
