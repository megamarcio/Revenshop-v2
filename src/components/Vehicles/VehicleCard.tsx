
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Edit, Copy, Trash2, Car } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface Vehicle {
  id: string;
  name: string;
  vin: string;
  year: number;
  model: string;
  plate: string;
  internalCode: string;
  color: string;
  caNote: number;
  purchasePrice: number;
  salePrice: number;
  profitMargin: number;
  minNegotiable: number;
  carfaxPrice: number;
  mmrValue: number;
  description: string;
  category: 'forSale' | 'sold';
  seller?: string;
  finalSalePrice?: number;
  photos: string[];
  video?: string;
}

interface VehicleCardProps {
  vehicle: Vehicle;
  onEdit: (vehicle: Vehicle) => void;
  onDuplicate: (vehicle: Vehicle) => void;
  onDelete?: (vehicle: Vehicle) => void;
}

const VehicleCard = ({ vehicle, onEdit, onDuplicate, onDelete }: VehicleCardProps) => {
  const { t } = useLanguage();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-300 border-gray-200 overflow-hidden">
      {/* Header com foto e badge */}
      <div className="relative">
        {vehicle.photos && vehicle.photos.length > 0 ? (
          <div className="h-32 w-full overflow-hidden bg-gray-100">
            <img 
              src={vehicle.photos[0]} 
              alt={vehicle.name}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            />
          </div>
        ) : (
          <div className="h-32 w-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <Car className="h-12 w-12 text-gray-400" />
          </div>
        )}
        
        {/* Badge de status */}
        <div className="absolute top-2 right-2">
          <Badge 
            variant={vehicle.category === 'forSale' ? 'default' : 'secondary'}
            className={`text-[7px] px-1.5 py-0.5 font-medium ${
              vehicle.category === 'forSale' 
                ? 'bg-green-500 text-white hover:bg-green-600' 
                : 'bg-red-500 text-white hover:bg-red-600'
            }`}
          >
            {vehicle.category === 'forSale' ? t('forSale') : t('sold')}
          </Badge>
        </div>
      </div>
      
      {/* Conteúdo do card */}
      <CardContent className="p-3 space-y-2">
        {/* Título e ano */}
        <div>
          <h3 className="text-[10px] font-semibold text-gray-900 leading-tight mb-0.5">
            {vehicle.name}
          </h3>
          <p className="text-[10px] text-gray-600">{vehicle.year} • {vehicle.color}</p>
        </div>

        {/* VIN em fonte menor */}
        <div className="bg-gray-50 p-1.5 rounded text-center">
          <span className="text-[7px] text-gray-500 font-mono tracking-wide">
            VIN: {vehicle.vin}
          </span>
        </div>

        {/* Grid de informações principais */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-blue-50 p-1.5 rounded">
            <span className="text-[8px] text-blue-600 block">{t('purchasePrice')}:</span>
            <p className="text-[10px] font-semibold text-blue-700">{formatCurrency(vehicle.purchasePrice)}</p>
          </div>
          <div className="bg-green-50 p-1.5 rounded">
            <span className="text-[8px] text-green-600 block">{t('salePrice')}:</span>
            <p className="text-[10px] font-semibold text-green-700">{formatCurrency(vehicle.salePrice)}</p>
          </div>
        </div>

        {/* Informações secundárias */}
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <span className="text-[8px] text-gray-500">{t('plate')}:</span>
            <span className="text-[10px] font-medium">{vehicle.plate}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[8px] text-gray-500">Código:</span>
            <span className="text-[10px] font-medium">{vehicle.internalCode}</span>
          </div>
        </div>

        {/* Informações de venda se vendido */}
        {vehicle.category === 'sold' && vehicle.seller && (
          <div className="bg-gray-50 p-2 rounded text-center border-t">
            <div className="text-[8px] text-gray-500 mb-1">Vendido por:</div>
            <div className="text-[10px] font-medium text-gray-700">{vehicle.seller}</div>
            {vehicle.finalSalePrice && (
              <div className="text-[10px] font-semibold text-green-600 mt-1">
                {formatCurrency(vehicle.finalSalePrice)}
              </div>
            )}
          </div>
        )}

        {/* Botões de ação */}
        <div className="flex gap-1 pt-2 border-t border-gray-100">
          <Button 
            size="sm" 
            variant="outline" 
            className="flex-1 h-7 text-[9px] px-2"
            onClick={() => onEdit(vehicle)}
          >
            <Edit className="h-2.5 w-2.5 mr-1" />
            {t('edit')}
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            className="flex-1 h-7 text-[9px] px-2"
            onClick={() => onDuplicate(vehicle)}
          >
            <Copy className="h-2.5 w-2.5 mr-1" />
            {t('duplicate')}
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            className="h-7 w-7 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={() => onDelete && onDelete(vehicle)}
          >
            <Trash2 className="h-2.5 w-2.5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default VehicleCard;
