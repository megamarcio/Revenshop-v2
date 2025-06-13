
import React from 'react';
import VehicleGridView from './VehicleGridView';
import VehicleListView from './VehicleListView';
import EmptyVehicleState from './EmptyVehicleState';
import { Vehicle as VehicleCardType } from './VehicleCardTypes';

interface VehicleListContentProps {
  isLoading: boolean;
  vehicles: VehicleCardType[];
  viewMode: 'grid' | 'list';
  onEdit: (vehicle: VehicleCardType) => void;
  onDuplicate: (vehicle: VehicleCardType) => void;
  onDelete: (vehicle: VehicleCardType) => void;
}

const VehicleListContent = ({
  isLoading,
  vehicles,
  viewMode,
  onEdit,
  onDuplicate,
  onDelete,
}: VehicleListContentProps) => {
  if (isLoading) {
    return (
      <div className="text-center py-8">
        <p>Carregando veículos...</p>
      </div>
    );
  }

  if (vehicles.length === 0) {
    return <EmptyVehicleState />;
  }

  if (viewMode === 'grid') {
    return (
      <VehicleGridView
        vehicles={vehicles}
        onEdit={onEdit}
        onDuplicate={onDuplicate}
        onDelete={onDelete}
      />
    );
  }

  return (
    <VehicleListView
      vehicles={vehicles}
      onEdit={onEdit}
      onDuplicate={onDuplicate}
      onDelete={onDelete}
    />
  );
};

export default VehicleListContent;
