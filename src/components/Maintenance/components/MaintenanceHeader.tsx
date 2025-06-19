
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
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Sistema de Manutenção</h1>
        <p className="text-gray-600">Gerenciar manutenções e reparos dos veículos</p>
        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
          <span>{totalMaintenances} manutenções cadastradas</span>
          <span>{openMaintenances} em aberto/pendentes</span>
          <span>$ {totalCost.toFixed(2)} em custos</span>
        </div>
      </div>
      <div className="flex gap-3">
        <Button 
          onClick={onOpenTechnicalPanel} 
          variant="outline"
          className="border-revenshop-primary text-revenshop-primary hover:bg-revenshop-primary hover:text-white"
        >
          <Settings className="h-4 w-4 mr-2" />
          Painel Técnico
        </Button>
        <Button onClick={onNewMaintenance} className="bg-revenshop-primary hover:bg-revenshop-primary/90">
          <Plus className="h-4 w-4 mr-2" />
          Nova Manutenção
        </Button>
      </div>
    </div>
  );
};

export default MaintenanceHeader;
