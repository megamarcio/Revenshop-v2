
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Copy, Trash2 } from 'lucide-react';
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
    <div className="space-y-1 sm:space-y-2">
      {vehicles.map(vehicle => (
        <Card key={vehicle.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-2 sm:p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
              <div className="flex-1">
                {/* Mobile: Layout vertical / Desktop: Layout horizontal */}
                <div className="flex flex-col sm:grid sm:grid-cols-6 gap-2 sm:gap-4">
                  {/* Vehicle Info */}
                  <div className="sm:col-span-2">
                    <h3 className="text-sm sm:text-xs font-bold">{vehicle.name}</h3>
                    <p className="text-sm sm:text-xs text-[#fa002a] font-medium">
                      Código: {formatInternalCode(vehicle.internalCode)}
                    </p>
                  </div>

                  {/* VIN and Category */}
                  <div className="sm:col-span-1 flex flex-col sm:items-center gap-1">
                    <p className="text-gray-600 text-sm sm:text-xs">VIN: {vehicle.vin}</p>
                    <span className={`inline-block px-2 py-1 text-xs rounded-full w-fit ${getCategoryColor(vehicle)}`}>
                      {getCategoryLabel(vehicle)}
                    </span>
                  </div>

                  {/* Prices */}
                  <div className="sm:col-span-2">
                    <p className="font-semibold text-green-600 text-sm sm:text-xs">
                      Venda: {formatCurrency(vehicle.salePrice)}
                    </p>
                    {vehicle.profitMargin && (
                      <div className="text-xs text-muted-foreground">
                        {vehicle.profitMargin}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 sm:gap-2 justify-end">
                {canEditVehicles && (
                  <>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => onEdit(vehicle)}
                      className="h-8 w-8 sm:h-auto sm:w-auto p-1 sm:p-2"
                    >
                      <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="sr-only sm:not-sr-only sm:ml-1">Editar</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => onDuplicate(vehicle)}
                      className="h-8 w-8 sm:h-auto sm:w-auto p-1 sm:p-2"
                    >
                      <Copy className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="sr-only sm:not-sr-only sm:ml-1">Duplicar</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => onDelete(vehicle)} 
                      className="h-8 w-8 sm:h-auto sm:w-auto p-1 sm:p-2 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="sr-only sm:not-sr-only sm:ml-1">Excluir</span>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default VehicleListView;
