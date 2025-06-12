
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Copy, Trash2, Eye } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Vehicle as VehicleCardType } from './VehicleCardTypes';

interface VehicleListViewProps {
  vehicles: VehicleCardType[];
  onEdit: (vehicle: VehicleCardType) => void;
  onDuplicate: (vehicle: VehicleCardType) => void;
  onDelete: (vehicle: VehicleCardType) => void;
}

const VehicleListView = ({ vehicles, onEdit, onDuplicate, onDelete }: VehicleListViewProps) => {
  const { canEditVehicles } = useAuth();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="space-y-2">
      {vehicles.map((vehicle) => (
        <Card key={vehicle.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1 grid grid-cols-1 md:grid-cols-6 gap-4">
                {/* Vehicle Image */}
                <div className="md:col-span-1">
                  {vehicle.photos.length > 0 ? (
                    <img
                      src={vehicle.photos[0]}
                      alt={vehicle.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                      <Eye className="h-6 w-6 text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Vehicle Info */}
                <div className="md:col-span-2">
                  <h3 className="font-semibold text-lg">{vehicle.name}</h3>
                  <p className="text-sm text-gray-600">Código: {vehicle.internalCode}</p>
                  <p className="text-sm text-gray-600">Ano: {vehicle.year}</p>
                  <p className="text-sm text-gray-600">Cor: {vehicle.color}</p>
                </div>

                {/* VIN and Category */}
                <div className="md:col-span-1">
                  <p className="text-sm text-gray-600">VIN: {vehicle.vin}</p>
                  <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                    vehicle.category === 'forSale' ? 'bg-green-100 text-green-800' :
                    vehicle.category === 'sold' ? 'bg-blue-100 text-blue-800' :
                    vehicle.category === 'maintenance' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {vehicle.category === 'forSale' ? 'À Venda' :
                     vehicle.category === 'sold' ? 'Vendido' :
                     vehicle.category === 'maintenance' ? 'Manutenção' :
                     vehicle.category}
                  </span>
                </div>

                {/* Prices */}
                <div className="md:col-span-1">
                  <p className="text-sm text-gray-600">Compra: {formatCurrency(vehicle.purchasePrice)}</p>
                  <p className="text-sm font-semibold text-green-600">Venda: {formatCurrency(vehicle.salePrice)}</p>
                  {vehicle.profitMargin && (
                    <p className="text-xs text-gray-500">Margem: {vehicle.profitMargin.toFixed(1)}%</p>
                  )}
                </div>

                {/* Actions */}
                <div className="md:col-span-1 flex items-center gap-2">
                  {canEditVehicles && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEdit(vehicle)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onDuplicate(vehicle)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onDelete(vehicle)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default VehicleListView;
