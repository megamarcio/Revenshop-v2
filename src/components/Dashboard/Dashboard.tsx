
import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useDashboardStats } from '../../hooks/useDashboardStats';
import { useAuth } from '../../contexts/AuthContext';
import StatsCard from './StatsCard';
import DateFilter from './DateFilter';
import PendingTasks from './PendingTasks';
import { DollarSign, Car, ShoppingCart, FileText } from 'lucide-react';

const Dashboard = () => {
  const { t } = useLanguage();
  const { stats, dateFilter, setDateFilter, refetch } = useDashboardStats();
  const { user, isAdmin, isManager } = useAuth();

  const handleMonthChange = (month: number) => {
    setDateFilter(prev => ({ ...prev, month }));
  };

  const handleYearChange = (year: number) => {
    setDateFilter(prev => ({ ...prev, year }));
  };

  if (stats.loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="bg-gradient-to-r from-revenshop-primary to-revenshop-secondary rounded-lg p-6 text-white">
          <h1 className="text-3xl font-bold mb-2">{t('welcome')}</h1>
          <p className="text-revenshop-light/90">{t('subtitle')}</p>
        </div>

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

  // Customized welcome message based on user role
  const getWelcomeMessage = () => {
    if (isAdmin || isManager) {
      return `Bem-vindo, ${user?.first_name}! Visão geral do negócio`;
    } else {
      return `Bem-vindo, ${user?.first_name}! Suas estatísticas`;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="bg-gradient-to-r from-revenshop-primary to-revenshop-secondary rounded-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">{getWelcomeMessage()}</h1>
        <p className="text-revenshop-light/90">
          {isAdmin || isManager ? 'Acompanhe o desempenho da empresa' : 'Acompanhe seu desempenho'}
        </p>
      </div>

      {(isAdmin || isManager) && (
        <DateFilter 
          month={dateFilter.month}
          year={dateFilter.year}
          onMonthChange={handleMonthChange}
          onYearChange={handleYearChange}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title={isAdmin || isManager ? "Carros à Venda" : "Carros Disponíveis"}
          value={stats.vehiclesForSale}
          icon={Car}
          color="bg-blue-500"
        />
        
        <StatsCard
          title={isAdmin || isManager ? "Carros Vendidos" : "Suas Vendas"}
          value={stats.vehiclesSold}
          icon={ShoppingCart}
          color="bg-green-500"
        />
        
        <StatsCard
          title={isAdmin || isManager ? "Valor Total Vendido" : "Sua Receita"}
          value={stats.totalSoldValue}
          icon={DollarSign}
          color="bg-purple-500"
          prefix="$ "
        />
        
        <StatsCard
          title={isAdmin || isManager ? "Valor Total Orçado" : "Seus Orçamentos"}
          value={stats.totalBudgetValue}
          icon={FileText}
          color="bg-orange-500"
          prefix="$ "
        />
      </div>

      <PendingTasks />
    </div>
  );
};

export default Dashboard;
