import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Settings } from 'lucide-react';

interface MaintenanceHeaderProps {
  totalMaintenances: number;
  openMaintenances: number;
  totalCost: number;
  onNewMaintenance: () => void;
  onOpenTechnicalPanel: () => void;
}

const MaintenanceHeader = ({ 
  totalMaintenances, 
  openMaintenances, 
  totalCost, 
  onNewMaintenance,
  onOpenTechnicalPanel
}: MaintenanceHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Sistema de Manutenção</h1>
        <p className="text-sm sm:text-base text-gray-600">Gerenciar manutenções e reparos dos veículos</p>
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-2 text-xs sm:text-sm text-gray-500">
          <span>{totalMaintenances} manutenções cadastradas</span>
          <span>{openMaintenances} em aberto/pendentes</span>
          <span>$ {totalCost.toFixed(2)} em custos</span>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
        <Button 
          onClick={onOpenTechnicalPanel} 
          variant="outline"
          size="sm"
          className="border-revenshop-primary text-revenshop-primary hover:bg-revenshop-primary hover:text-white"
        >
          <Settings className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Painel Técnico</span>
          <span className="sm:hidden">Técnico</span>
        </Button>
        <Button 
          onClick={onNewMaintenance} 
          size="sm"
          className="bg-revenshop-primary hover:bg-revenshop-primary/90"
        >
          <Plus className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Nova Manutenção</span>
          <span className="sm:hidden">Nova</span>
        </Button>
      </div>
    </div>
  );
};

export default MaintenanceHeader;
