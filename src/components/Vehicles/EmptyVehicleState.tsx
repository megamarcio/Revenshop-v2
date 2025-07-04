
import React from 'react';
import { Car } from 'lucide-react';

interface EmptyVehicleStateProps {
  hasVehicles?: boolean;
  onAddVehicle?: () => void;
}

const EmptyVehicleState = ({ hasVehicles, onAddVehicle }: EmptyVehicleStateProps) => {
  return (
    <div className="text-center py-12">
      <Car className="h-12 w-12 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum veículo encontrado</h3>
      <p className="text-gray-500">
        {hasVehicles 
          ? "Tente ajustar os filtros de busca ou adicione um novo veículo."
          : "Comece adicionando seu primeiro veículo ao sistema."
        }
      </p>
    </div>
  );
};

export default EmptyVehicleState;
