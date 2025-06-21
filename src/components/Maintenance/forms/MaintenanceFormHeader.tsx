import React from 'react';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Wrench, RotateCcw } from 'lucide-react';

interface MaintenanceFormHeaderProps {
  isEditing: boolean;
  status: string;
  statusColor: string;
  statusText: string;
  isReopened?: boolean;
}

const MaintenanceFormHeader = ({
  isEditing,
  status,
  statusColor,
  statusText,
  isReopened = false
}: MaintenanceFormHeaderProps) => {
  return <>
      {/* Status no canto superior esquerdo */}
      <div className="absolute top-4 left-4 flex items-center gap-2 z-10">
        <div className={`w-3 h-3 ${statusColor} rounded-full`}></div>
        <span className="text-xs text-gray-700 px-0 text-center font-bold">{statusText}</span>
      </div>

      <DialogHeader className="pt-8">
        <DialogTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wrench className="h-5 w-5 text-revenshop-primary" />
            <span>
              {isEditing ? 'Editar' : 'Nova'} Manutenção
              {isReopened && (
                <Badge className="ml-2 bg-green-100 text-green-800 border-green-300">
                  <RotateCcw className="h-3 w-3 mr-1" />
                  Reaberta
                </Badge>
              )}
            </span>
          </div>
          <Badge className={`${statusColor} text-xs`}>
            {statusText}
          </Badge>
        </DialogTitle>
      </DialogHeader>
    </>;
};

export default MaintenanceFormHeader;