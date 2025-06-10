import React from 'react';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';
interface MaintenanceFormHeaderProps {
  isEditing: boolean;
  status: string;
  statusColor: string;
  statusText: string;
}
const MaintenanceFormHeader = ({
  isEditing,
  status,
  statusColor,
  statusText
}: MaintenanceFormHeaderProps) => {
  return <>
      {/* Status no canto superior esquerdo */}
      <div className="absolute top-4 left-4 flex items-center gap-2 z-10">
        <div className={`w-3 h-3 ${statusColor} rounded-full`}></div>
        <span className="text-xs text-gray-700 px-0 text-center font-bold">{statusText}</span>
      </div>

      <DialogHeader className="pt-8">
        <DialogTitle className="mx-0 text-left">
          {isEditing ? 'Editar Manutenção' : 'Nova Manutenção'}
        </DialogTitle>
      </DialogHeader>
    </>;
};
export default MaintenanceFormHeader;