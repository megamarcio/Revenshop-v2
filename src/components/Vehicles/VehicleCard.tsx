
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Calendar, Palette, Hash, Eye } from 'lucide-react';

interface Vehicle {
  id: string;
  name: string;
  year: number;
  model: string;
  color: string;
  miles: number;
  vin: string;
  internal_code: string;
  purchase_price: number;
  sale_price: number;
  mmr_value?: number;
  description?: string;
  photos?: string[];
  category: string;
  created_at: string;
}

interface VehicleCardProps {
  vehicle: Vehicle;
  onEdit?: (vehicle: Vehicle) => void;
  onDelete?: (vehicleId: string) => void;
  onView?: (vehicle: Vehicle) => void;
  showCostInfo?: boolean;
}

const VehicleCard = ({ vehicle, onEdit, onDelete, onView, showCostInfo = true }: VehicleCardProps) => {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'forSale': return 'bg-green-100 text-green-800';
      case 'sold': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'forSale': return 'À Venda';
      case 'sold': return 'Vendido';
      default: return category;
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
      <div className="aspect-video bg-gray-100 relative">
        {vehicle.photos && vehicle.photos.length > 0 ? (
          <img
            src={vehicle.photos[0]}
            alt={vehicle.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            <span>Sem foto</span>
          </div>
        )}
        
        <Badge className={`absolute top-2 right-2 ${getCategoryColor(vehicle.category)}`}>
          {getCategoryLabel(vehicle.category)}
        </Badge>
      </div>

      <CardContent className="p-4">
        <div className="mb-3">
          <h3 className="text-lg font-semibold text-gray-900 truncate">
            {vehicle.year} {vehicle.name}
          </h3>
          <p className="text-sm text-gray-600">{vehicle.model}</p>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <Palette className="h-4 w-4 mr-2" />
            <span>{vehicle.color}</span>
          </div>

          <div className="flex items-center text-sm text-gray-600">
            <Hash className="h-4 w-4 mr-2" />
            <span>{vehicle.miles.toLocaleString()} milhas</span>
          </div>

          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="h-4 w-4 mr-2" />
            <span>{new Date(vehicle.created_at).toLocaleDateString('pt-BR')}</span>
          </div>
        </div>

        <div className="space-y-1 mb-4">
          <div className="text-sm">
            <span className="text-gray-600">Código: </span>
            <span className="font-medium">{vehicle.internal_code}</span>
          </div>
          
          <div className="text-sm">
            <span className="text-gray-600">VIN: </span>
            <span className="font-mono text-xs">{vehicle.vin}</span>
          </div>
        </div>

        {/* Informações de preço - condicionais baseadas em permissões */}
        <div className="space-y-2 mb-4">
          {showCostInfo && (
            <>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Custo:</span>
                <span className="font-semibold text-red-600">
                  ${vehicle.purchase_price.toLocaleString('en-US')}
                </span>
              </div>

              {vehicle.mmr_value && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">MMR:</span>
                  <span className="font-medium text-blue-600">
                    ${vehicle.mmr_value.toLocaleString('en-US')}
                  </span>
                </div>
              )}
            </>
          )}

          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Venda:</span>
            <span className="font-bold text-green-600 text-lg">
              ${vehicle.sale_price.toLocaleString('en-US')}
            </span>
          </div>
        </div>

        {/* Botões de ação */}
        <div className="flex space-x-2">
          {onView && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onView(vehicle)}
              className="flex-1"
            >
              <Eye className="h-4 w-4 mr-1" />
              Visualizar
            </Button>
          )}
          
          {onEdit && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(vehicle)}
              className="flex-1"
            >
              <Edit className="h-4 w-4 mr-1" />
              Editar
            </Button>
          )}
          
          {onDelete && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(vehicle.id)}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default VehicleCard;
