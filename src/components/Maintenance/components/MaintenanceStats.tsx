import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, AlertTriangle, Wrench } from 'lucide-react';
import { useMaintenanceCosts } from '../../../hooks/useMaintenanceCosts';
import MaintenanceCostsChart from './MaintenanceCostsChart';
import MaintenanceCostsSummary from './MaintenanceCostsSummary';

interface MaintenanceStatsProps {
  openMaintenances: number;
  vehiclesWithIssues: number;
  totalVehicles: number;
  technicalItemsCount?: number;
}

const MaintenanceStats = ({ 
  openMaintenances, 
  vehiclesWithIssues, 
  totalVehicles,
  technicalItemsCount = 0
}: MaintenanceStatsProps) => {
  const { last3MonthsCosts } = useMaintenanceCosts();

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Stats Cards com contadores separados */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-2 rounded-lg bg-yellow-100">
                <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Manutenções Pendentes</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">{openMaintenances}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-2 rounded-lg bg-red-100">
                <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-red-600" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Itens para Trocar</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">{technicalItemsCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="sm:col-span-2 lg:col-span-1">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-2 rounded-lg bg-blue-100">
                <Wrench className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Total de Veículos</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">{totalVehicles}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Nova Seção de Custos por Mês */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-1">
          <MaintenanceCostsChart data={last3MonthsCosts} />
        </div>
        <div className="lg:col-span-2">
          <MaintenanceCostsSummary />
        </div>
      </div>
    </div>
  );
};

export default MaintenanceStats;
