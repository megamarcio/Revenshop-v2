
import React from 'react';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface MaintenanceFormHeaderProps {
  isEditing: boolean;
  status: string;
  statusColor: string;
  statusText: string;
}

const MaintenanceFormHeader = ({ isEditing, status, statusColor, statusText }: MaintenanceFormHeaderProps) => {
  return (
    <>
      {/* Status no canto superior esquerdo */}
      <div className="absolute top-4 left-4 flex items-center gap-2 z-10">
        <div className={`w-3 h-3 ${statusColor} rounded-full`}></div>
        <span className="text-xs font-medium text-gray-700">{statusText}</span>
      </div>

      <DialogHeader className="pt-8">
        <DialogTitle>
          {isEditing ? 'Editar Manutenção' : 'Nova Manutenção'}
        </DialogTitle>
      </DialogHeader>
    </>
  );
};

export default MaintenanceFormHeader;
