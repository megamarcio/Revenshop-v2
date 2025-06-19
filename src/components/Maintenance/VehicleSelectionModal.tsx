
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Car } from 'lucide-react';
import { useVehiclesOptimized } from '../../hooks/useVehiclesOptimized';

interface VehicleSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectVehicle: (vehicleId: string, vehicleName: string) => void;
}

const VehicleSelectionModal = ({ isOpen, onClose, onSelectVehicle }: VehicleSelectionModalProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const { vehicles, loading } = useVehiclesOptimized({ 
    category: 'forSale', 
    limit: 100, 
    searchTerm,
    minimal: true 
  });

  const handleSelectVehicle = (vehicle: any) => {
    const vehicleName = `${vehicle.name} - ${vehicle.year}`;
    onSelectVehicle(vehicle.id, vehicleName);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Car className="h-5 w-5" />
            Selecionar Veículo para Painel Técnico
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Campo de busca */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar por nome, modelo, VIN ou código interno..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Lista de veículos */}
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {loading ? (
              <div className="text-center py-8 text-gray-500">
                Carregando veículos...
              </div>
            ) : vehicles.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                {searchTerm ? 'Nenhum veículo encontrado' : 'Nenhum veículo disponível'}
              </div>
            ) : (
              vehicles.map((vehicle) => (
                <Card 
                  key={vehicle.id} 
                  className="cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => handleSelectVehicle(vehicle)}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <h3 className="font-medium">{vehicle.name}</h3>
                        <p className="text-sm text-gray-600">
                          {vehicle.model} - {vehicle.year}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>VIN: {vehicle.vin}</span>
                          <span>Código: {vehicle.internal_code}</span>
                          <span className="capitalize">{vehicle.color}</span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Selecionar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VehicleSelectionModal;
