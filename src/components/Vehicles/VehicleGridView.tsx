
import React from 'react';
import VehicleCard from './VehicleCard';
import { Vehicle } from './VehicleCardTypes';

interface VehicleGridViewProps {
  vehicles: Vehicle[];
  onEdit: (vehicle: Vehicle) => void;
  onDuplicate: (vehicle: Vehicle) => void;
  onDelete?: (vehicle: Vehicle) => void;
}

const VehicleGridView = ({ vehicles, onEdit, onDuplicate, onDelete }: VehicleGridViewProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {vehicles.map((vehicle) => (
        <div key={vehicle.id} className="vehicle-card-container">
          <VehicleCard
            vehicle={vehicle}
            onEdit={onEdit}
            onDuplicate={onDuplicate}
            onDelete={onDelete}
          />
        </div>
      ))}
    </div>
  );
};

export default VehicleGridView;
