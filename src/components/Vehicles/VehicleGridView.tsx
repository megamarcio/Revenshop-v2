
import React from 'react';
import VehicleCard from './VehicleCard';
import { Vehicle as VehicleCardType } from './VehicleCardTypes';

interface VehicleGridViewProps {
  vehicles: VehicleCardType[];
  onEdit: (vehicle: VehicleCardType) => void;
  onDuplicate: (vehicle: VehicleCardType) => void;
  onDelete: (vehicle: VehicleCardType) => void;
}

const VehicleGridView = ({ vehicles, onEdit, onDuplicate, onDelete }: VehicleGridViewProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-2 sm:gap-3 md:gap-4 p-1 sm:p-0">
      {vehicles.map((vehicle) => (
        <VehicleCard
          key={vehicle.id}
          vehicle={vehicle}
          onEdit={() => onEdit(vehicle)}
          onDuplicate={() => onDuplicate(vehicle)}
          onDelete={() => onDelete(vehicle)}
        />
      ))}
    </div>
  );
};

export default VehicleGridView;
