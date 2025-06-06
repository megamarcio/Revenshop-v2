
import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useDashboardStats } from '../../hooks/useDashboardStats';
import StatsCard from './StatsCard';
import DateFilter from './DateFilter';
import PendingTasks from './PendingTasks';
import { DollarSign, Car, ShoppingCart, FileText } from 'lucide-react';

const Dashboard = () => {
  const { t } = useLanguage();
  const { stats, dateFilter, setDateFilter, refetch } = useDashboardStats();

  const handleMonthChange = (month: number) => {
    setDateFilter(prev => ({ ...prev, month }));
  };

  const handleYearChange = (year: number) => {
    setDateFilter(prev => ({ ...prev, year }));
  };

  if (stats.loading) {
    return (
      <div className="p-6 space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-revenshop-primary to-revenshop-secondary rounded-lg p-6 text-white">
          <h1 className="text-3xl font-bold mb-2">{t('welcome')}</h1>
          <p className="text-revenshop-light/90">{t('subtitle')}</p>
        </div>

        {/* Stats Grid - Loading state */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-card rounded-lg shadow p-4 animate-pulse">
              <div className="flex items-center justify-between mb-2">
                <div className="bg-gray-300 h-3 rounded w-16"></div>
                <div className="bg-gray-300 w-6 h-6 rounded-lg"></div>
              </div>
              <div className="bg-gray-300 h-6 rounded w-12"></div>
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

      {/* Date Filter */}
      <DateFilter 
        month={dateFilter.month}
        year={dateFilter.year}
        onMonthChange={handleMonthChange}
        onYearChange={handleYearChange}
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Carros à Venda"
          value={stats.vehiclesForSale}
          icon={Car}
          color="bg-blue-500"
        />
        
        <StatsCard
          title="Carros Vendidos"
          value={stats.vehiclesSold}
          icon={ShoppingCart}
          color="bg-green-500"
        />
        
        <StatsCard
          title="Valor Total Vendido"
          value={stats.totalSoldValue}
          icon={DollarSign}
          color="bg-purple-500"
          prefix="$ "
        />
        
        <StatsCard
          title="Valor Total Orçado"
          value={stats.totalBudgetValue}
          icon={FileText}
          color="bg-orange-500"
          prefix="$ "
        />
      </div>

      {/* Pending Tasks - Replaced Recent Activity */}
      <PendingTasks />
    </div>
  );
};

export default Dashboard;
