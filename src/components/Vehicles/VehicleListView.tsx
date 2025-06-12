
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

const VehicleListView = ({
  vehicles,
  onEdit,
  onDuplicate,
  onDelete
}: VehicleListViewProps) => {
  const { canEditVehicles } = useAuth();
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  const formatInternalCode = (code: string) => {
    // Se o código é numérico e tem menos de 4 dígitos, adicionar zeros à esquerda
    if (code && /^\d+$/.test(code) && code.length < 4) {
      return code.padStart(4, '0');
    }
    return code;
  };

  const getCategoryLabel = (vehicle: VehicleCardType) => {
    // Verificar se há categoria estendida na descrição
    if (vehicle.category === 'forSale' && vehicle.description) {
      const match = vehicle.description.match(/\[CATEGORY:([^\]]+)\]/);
      if (match) {
        const extendedCategory = match[1];
        switch (extendedCategory) {
          case 'rental': return 'Aluguel';
          case 'maintenance': return 'Manutenção';
          case 'consigned': return 'Consignado';
          default: return 'À Venda';
        }
      }
    }
    
    // Categoria padrão
    switch (vehicle.category) {
      case 'forSale': return 'À Venda';
      case 'sold': return 'Vendido';
      case 'maintenance': return 'Manutenção';
      case 'rental': return 'Aluguel';
      case 'consigned': return 'Consignado';
      default: return vehicle.category;
    }
  };

  const getCategoryColor = (vehicle: VehicleCardType) => {
    // Verificar se há categoria estendida na descrição
    if (vehicle.category === 'forSale' && vehicle.description) {
      const match = vehicle.description.match(/\[CATEGORY:([^\]]+)\]/);
      if (match) {
        const extendedCategory = match[1];
        switch (extendedCategory) {
          case 'rental': return 'bg-purple-100 text-purple-800';
          case 'maintenance': return 'bg-yellow-100 text-yellow-800';
          case 'consigned': return 'bg-orange-100 text-orange-800';
          default: return 'bg-green-100 text-green-800';
        }
      }
    }
    
    // Cores padrão
    switch (vehicle.category) {
      case 'forSale': return 'bg-green-100 text-green-800';
      case 'sold': return 'bg-blue-100 text-blue-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      case 'rental': return 'bg-purple-100 text-purple-800';
      case 'consigned': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-2">
      {vehicles.map(vehicle => (
        <Card key={vehicle.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4 px-[9px] py-0">
            <div className="flex items-center justify-between">
              <div className="flex-1 grid grid-cols-1 md:grid-cols-6 gap-4">
                {/* Vehicle Info */}
                <div className="md:col-span-2">
                  <h3 className="text-xs font-bold">{vehicle.name}</h3>
                  <p className="text-xs text-[#fa002a] font-medium">
                    Código: {formatInternalCode(vehicle.internalCode)}
                  </p>
                </div>

                {/* VIN and Category */}
                <div className="md:col-span-1">
                  <p className="text-gray-600 text-xs text-center">VIN: {vehicle.vin}</p>
                  <span className={`inline-block px-2 py-1 text-xs rounded-full ${getCategoryColor(vehicle)}`}>
                    {getCategoryLabel(vehicle)}
                  </span>
                </div>

                {/* Prices */}
                <div className="md:col-span-1 my-0">
                  <p className="font-semibold text-green-600 text-xs">
                    Venda: {formatCurrency(vehicle.salePrice)}
                  </p>
                  {vehicle.profitMargin}
                </div>

                {/* Actions */}
                <div className="md:col-span-1 flex items-center gap-2">
                  {canEditVehicles && (
                    <>
                      <Button variant="outline" size="sm" onClick={() => onEdit(vehicle)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => onDuplicate(vehicle)}>
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
