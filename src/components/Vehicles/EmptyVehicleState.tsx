
import React from 'react';
import { Button } from '@/components/ui/button';
import { Car, Plus } from 'lucide-react';

interface EmptyVehicleStateProps {
  hasVehicles: boolean;
  searchTerm: string;
  onAddVehicle: () => void;
}

const EmptyVehicleState = ({ hasVehicles, searchTerm, onAddVehicle }: EmptyVehicleStateProps) => {
  if (!hasVehicles && !searchTerm) {
    return (
      <div className="text-center py-12">
        <Car className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum veículo cadastrado</h3>
        <p className="mt-1 text-sm text-gray-500">Comece adicionando seu primeiro veículo.</p>
        <div className="mt-6">
          <Button onClick={onAddVehicle}>
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Veículo
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center py-12">
      <Car className="mx-auto h-12 w-12 text-gray-400" />
      <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum veículo encontrado</h3>
      <p className="mt-1 text-sm text-gray-500">
        {searchTerm ? `Nenhum veículo corresponde ao termo "${searchTerm}".` : 'Nenhum veículo encontrado com os filtros aplicados.'}
      </p>
    </div>
  );
};

export default EmptyVehicleState;
