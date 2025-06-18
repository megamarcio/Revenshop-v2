
import React from 'react';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertTriangle } from 'lucide-react';

interface UrgentMaintenanceSectionProps {
  isUrgent: boolean;
  onUrgentChange: (urgent: boolean) => void;
}

const UrgentMaintenanceSection = ({
  isUrgent,
  onUrgentChange
}: UrgentMaintenanceSectionProps) => {
  return (
    <div className="space-y-3">
      <Label className="text-base font-medium">Prioridade da Manutenção</Label>
      <div className="flex items-center space-x-3 p-3 border rounded-lg bg-orange-50 border-orange-200">
        <Checkbox
          id="urgent-maintenance"
          checked={isUrgent}
          onCheckedChange={onUrgentChange}
        />
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-orange-600" />
          <Label 
            htmlFor="urgent-maintenance" 
            className="text-orange-800 font-medium cursor-pointer"
          >
            Marcar como Manutenção Urgente
          </Label>
        </div>
      </div>
      {isUrgent && (
        <p className="text-sm text-orange-700 ml-6">
          Esta manutenção será destacada na lista principal e terá prioridade no sistema.
        </p>
      )}
    </div>
  );
};

export default UrgentMaintenanceSection;
