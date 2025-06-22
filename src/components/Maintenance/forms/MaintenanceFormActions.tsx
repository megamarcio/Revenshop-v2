import React from 'react';
import { Button } from '@/components/ui/button';

interface MaintenanceFormActionsProps {
  onCancel: () => void;
  loading: boolean;
  vehiclesLoading: boolean;
  isEditing: boolean;
}

const MaintenanceFormActions = ({ onCancel, loading, vehiclesLoading, isEditing }: MaintenanceFormActionsProps) => {
  return (
    <div className="flex flex-col sm:flex-row justify-end gap-2 w-full">
      <Button 
        type="button" 
        variant="outline" 
        onClick={onCancel}
        className="w-full sm:w-auto h-12 sm:h-10 text-base sm:text-sm font-medium"
      >
        Cancelar
      </Button>
      <Button 
        type="submit" 
        disabled={loading || vehiclesLoading}
        className="w-full sm:w-auto h-12 sm:h-10 text-base sm:text-sm font-medium"
      >
        {loading ? 'Salvando...' : 'Salvar Manutenção'}
      </Button>
    </div>
  );
};

export default MaintenanceFormActions;
