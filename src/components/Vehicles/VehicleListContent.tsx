
import React from 'react';
import VehicleCard from './VehicleCard';
import VehicleListView from './VehicleListView';
import EmptyVehicleState from './EmptyVehicleState';
import { convertVehicleForCard } from './VehicleDataProcessor';

interface VehicleListContentProps {
  viewMode: 'grid' | 'list';
  vehicles: any[];
  loading: boolean;
  onEdit: (vehicle: any) => void;
  onDuplicate: (vehicle: any) => void;
  onDelete: (vehicle: any) => void;
}

export const VehicleListContent = ({ 
  viewMode, 
  vehicles, 
  loading, 
  onEdit, 
  onDuplicate, 
  onDelete 
}: VehicleListContentProps) => {
  if (vehicles.length === 0 && !loading) {
    return <EmptyVehicleState />;
  }

  if (viewMode === 'grid') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
        {vehicles.map((vehicle) => (
          <VehicleCard
            key={vehicle.id}
            vehicle={convertVehicleForCard(vehicle)}
            onEdit={() => onEdit(vehicle)}
            onDuplicate={() => onDuplicate(vehicle)}
            onDelete={() => onDelete(vehicle)}
          />
        ))}
      </div>
    );
  }

  return (
    <VehicleListView
      vehicles={vehicles.map(convertVehicleForCard)}
      onEdit={(vehicle) => {
        const originalVehicle = vehicles.find(v => v.id === vehicle.id);
        if (originalVehicle) onEdit(originalVehicle);
      }}
      onDuplicate={(vehicle) => {
        const originalVehicle = vehicles.find(v => v.id === vehicle.id);
        if (originalVehicle) onDuplicate(originalVehicle);
      }}
      onDelete={(vehicle) => {
        const originalVehicle = vehicles.find(v => v.id === vehicle.id);
        if (originalVehicle) onDelete(originalVehicle);
      }}
    />
  );
};
