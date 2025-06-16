
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, AlertTriangle, Wrench } from 'lucide-react';

interface MaintenanceStatsProps {
  openMaintenances: number;
  vehiclesWithIssues: number;
  totalVehicles: number;
}

const MaintenanceStats = ({ 
  openMaintenances, 
  vehiclesWithIssues, 
  totalVehicles 
}: MaintenanceStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-yellow-100">
              <Calendar className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Manutenções Pendentes</p>
              <p className="text-2xl font-bold text-gray-900">{openMaintenances}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-red-100">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Itens para Trocar</p>
              <p className="text-2xl font-bold text-gray-900">{vehiclesWithIssues}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-100">
              <Wrench className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total de Veículos</p>
              <p className="text-2xl font-bold text-gray-900">{totalVehicles}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MaintenanceStats;
