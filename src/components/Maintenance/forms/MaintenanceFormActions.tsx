
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
    <div className="flex justify-end gap-2 pt-4">
      <Button type="button" variant="outline" onClick={onCancel}>
        Cancelar
      </Button>
      <Button type="submit" disabled={loading || vehiclesLoading}>
        {loading ? 'Salvando...' : 'Salvar Manutenção'}
      </Button>
    </div>
  );
};

export default MaintenanceFormActions;
