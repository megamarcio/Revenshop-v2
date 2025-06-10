
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Wrench, Search, Car } from 'lucide-react';
import { useTechnicalItems } from '../../../hooks/useTechnicalItems';
import { useVehiclesOptimized } from '../../../hooks/useVehiclesOptimized';
import NoVehicleSelected from './NoVehicleSelected';
import MainItemsSection from './MainItemsSection';
import OtherItemsSection from './OtherItemsSection';

interface TechnicalPanelRedesignedProps {
  isOpen: boolean;
  onClose: () => void;
  vehicleId?: string;
  vehicleName?: string;
}

const TechnicalPanelRedesigned = ({ 
  isOpen, 
  onClose, 
  vehicleId: initialVehicleId, 
  vehicleName: initialVehicleName 
}: TechnicalPanelRedesignedProps) => {
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>(initialVehicleId || '');
  const [vehicleCodeFilter, setVehicleCodeFilter] = useState('');
  const [editingItem, setEditingItem] = useState<string | null>(null);

  const { vehicles } = useVehiclesOptimized({ category: 'forSale', limit: 100, minimal: true });
  const { items, loading, updateItem, createDefaultItems, refresh } = useTechnicalItems(selectedVehicleId);

  // Update selected vehicle when initial props change
  useEffect(() => {
    if (initialVehicleId) {
      setSelectedVehicleId(initialVehicleId);
    }
  }, [initialVehicleId]);

  // Filter vehicles by code
  const filteredVehicles = vehicles.filter(vehicle => 
    vehicleCodeFilter === '' || 
    vehicle.internal_code?.toLowerCase().includes(vehicleCodeFilter.toLowerCase())
  );

  const selectedVehicle = vehicles.find(v => v.id === selectedVehicleId);

  const handleVehicleChange = (vehicleId: string) => {
    setSelectedVehicleId(vehicleId);
    setEditingItem(null); // Reset editing when changing vehicle
  };

  const handleEdit = (itemId: string) => {
    setEditingItem(itemId);
  };

  const handleSave = () => {
    setEditingItem(null);
  };

  const handleUpdate = (itemId: string, updates: any) => {
    updateItem(itemId, updates);
  };

  const handleCancel = () => {
    setEditingItem(null);
  };

  const handleSearch = () => {
    // Trigger search by applying the current filter
    console.log('Searching for vehicle with code:', vehicleCodeFilter);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4 border-b">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-3 text-xl">
              <Wrench className="h-6 w-6 text-blue-600" />
              <div>
                <div className="text-xl font-bold">Painel Técnico</div>
                <div className="text-sm text-gray-600 font-normal">
                  {selectedVehicle ? `${selectedVehicle.internal_code} - ${selectedVehicle.name}` : 'Selecione um veículo'}
                </div>
              </div>
            </DialogTitle>
            <Button onClick={onClose} variant="outline">
              Fechar
            </Button>
          </div>
        </DialogHeader>

        {/* Filters Section */}
        <div className="bg-gray-50 p-4 rounded-lg border space-y-4">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <Search className="h-4 w-4" />
            Filtros e Seleção de Veículo
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Vehicle Dropdown */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-600">Selecionar Veículo</label>
              <Select value={selectedVehicleId} onValueChange={handleVehicleChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Escolha um veículo">
                    {selectedVehicle && (
                      <div className="flex items-center gap-2">
                        <Car className="h-4 w-4" />
                        <span className="font-semibold text-blue-600">
                          {selectedVehicle.internal_code}
                        </span>
                        <span>- {selectedVehicle.name}</span>
                      </div>
                    )}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {filteredVehicles.map((vehicle) => (
                    <SelectItem key={vehicle.id} value={vehicle.id}>
                      <div className="flex items-center gap-2">
                        <Car className="h-4 w-4" />
                        <span className="font-semibold text-blue-600">
                          {vehicle.internal_code}
                        </span>
                        <span>- {vehicle.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Code Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-600">Filtrar por Código</label>
              <Input
                placeholder="Digite o código interno"
                value={vehicleCodeFilter}
                onChange={(e) => setVehicleCodeFilter(e.target.value)}
                className="w-full"
              />
            </div>

            {/* Search Button */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-600">Pesquisar</label>
              <Button 
                onClick={handleSearch}
                variant="outline"
                className="w-full flex items-center gap-2"
              >
                <Search className="h-4 w-4" />
                Pesquisar
              </Button>
            </div>
          </div>

          {selectedVehicle && (
            <div className="bg-blue-50 p-3 rounded border border-blue-200">
              <div className="text-sm">
                <span className="font-semibold text-blue-800">Veículo Selecionado: </span>
                <span className="text-blue-700">
                  {selectedVehicle.internal_code} - {selectedVehicle.name}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="space-y-6 p-1">
          {!selectedVehicleId ? (
            <div className="text-center py-12">
              <Car className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">Nenhum Veículo Selecionado</h3>
              <p className="text-gray-500">
                Selecione um veículo acima para visualizar e editar os itens técnicos.
              </p>
            </div>
          ) : loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-gray-500">Carregando itens técnicos...</div>
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-12">
              <Wrench className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">Nenhum Item Técnico</h3>
              <p className="text-gray-500 mb-4">
                Este veículo ainda não possui itens técnicos cadastrados.
              </p>
              <Button onClick={createDefaultItems} className="bg-blue-600 hover:bg-blue-700">
                Criar Itens Padrão
              </Button>
            </div>
          ) : (
            <>
              <MainItemsSection
                items={items}
                editingItem={editingItem}
                onEdit={handleEdit}
                onSave={handleSave}
                onUpdate={handleUpdate}
                onCancel={handleCancel}
              />
              <OtherItemsSection 
                items={items}
                editingItem={editingItem}
                onEdit={handleEdit}
                onSave={handleSave}
                onUpdate={handleUpdate}
                onCancel={handleCancel}
              />
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TechnicalPanelRedesigned;
