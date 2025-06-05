
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Eye, Car, Fuel, Calendar, MapPin } from 'lucide-react';

interface VehicleCardProps {
  vehicle: {
    id: string;
    name: string;
    model: string;
    year: number;
    miles: number;
    color: string;
    vin: string;
    internal_code: string;
    purchase_price: number;
    sale_price: number;
    category: 'forSale' | 'sold';
    photos: string[];
    description?: string;
  };
  onEdit?: (vehicle: any) => void;
  onDelete?: (vehicleId: string) => void;
  onView?: (vehicle: any) => void;
  showCostInfo: boolean;
}

const VehicleCard = ({ vehicle, onEdit, onDelete, onView, showCostInfo }: VehicleCardProps) => {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'sold': return 'bg-green-100 text-green-800';
      case 'forSale': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'sold': return 'Vendido';
      case 'forSale': return 'À Venda';
      default: return category;
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardContent className="p-0">
        {/* Image */}
        <div className="aspect-video bg-gray-200 rounded-t-lg overflow-hidden">
          {vehicle.photos && vehicle.photos.length > 0 ? (
            <img
              src={vehicle.photos[0]}
              alt={`${vehicle.year} ${vehicle.name}`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Car className="h-12 w-12 text-gray-400" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-lg text-gray-900">
                {vehicle.year} {vehicle.name}
              </h3>
              <p className="text-gray-600">{vehicle.model}</p>
              <p className="text-sm text-gray-500">Código: {vehicle.internal_code}</p>
            </div>
            <Badge className={getCategoryColor(vehicle.category)}>
              {getCategoryLabel(vehicle.category)}
            </Badge>
          </div>

          {/* Vehicle Details */}
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center space-x-1">
              <MapPin className="h-4 w-4 text-gray-400" />
              <span>{vehicle.miles?.toLocaleString()} milhas</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="w-3 h-3 rounded-full border-2 border-gray-300" style={{ backgroundColor: vehicle.color?.toLowerCase() }}></span>
              <span className="capitalize">{vehicle.color}</span>
            </div>
          </div>

          {/* VIN */}
          <div className="text-xs text-gray-500 font-mono">
            VIN: {vehicle.vin}
          </div>

          {/* Pricing */}
          <div className="border-t pt-3">
            {showCostInfo && (
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Custo:</span>
                <span className="font-medium text-red-600">
                  ${vehicle.purchase_price?.toLocaleString()}
                </span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-600">Preço:</span>
              <span className="font-bold text-lg text-green-600">
                ${vehicle.sale_price?.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <div className="flex space-x-2 w-full">
          {onView && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onView(vehicle)}
              className="flex-1"
            >
              <Eye className="h-4 w-4 mr-2" />
              Ver
            </Button>
          )}
          {onEdit && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(vehicle)}
              className="flex-1"
            >
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </Button>
          )}
          {onDelete && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(vehicle.id)}
              className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Excluir
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default VehicleCard;
