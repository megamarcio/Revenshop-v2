
import React from 'react';
import VehicleGridView from './VehicleGridView';
import { Vehicle as VehicleCardType } from './VehicleCardTypes';

interface VehicleListProps {
  vehicles: VehicleCardType[];
  onEdit: (vehicle: VehicleCardType) => void;
  onDuplicate: (vehicle: VehicleCardType) => void;
  onDelete: (vehicle: VehicleCardType) => void;
}

const VehicleList = ({ vehicles, onEdit, onDuplicate, onDelete }: VehicleListProps) => {
  return (
    <VehicleGridView
      vehicles={vehicles}
      onEdit={onEdit}
      onDuplicate={onDuplicate}
      onDelete={onDelete}
    />
  );
};

export default VehicleList;
