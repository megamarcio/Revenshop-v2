
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
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-revenshop-primary/10 p-2 rounded-lg">
              <Car className="h-5 w-5 text-revenshop-primary" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold">{vehicle.name}</CardTitle>
              <p className="text-sm text-gray-500">{vehicle.year} • {vehicle.color}</p>
            </div>
          </div>
          <Badge 
            variant={vehicle.category === 'forSale' ? 'default' : 'secondary'}
            className={vehicle.category === 'forSale' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
          >
            {vehicle.category === 'forSale' ? t('forSale') : t('sold')}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <span className="text-gray-500">VIN:</span>
            <p className="font-medium">{vehicle.vin}</p>
          </div>
          <div>
            <span className="text-gray-500">{t('plate')}:</span>
            <p className="font-medium">{vehicle.plate}</p>
          </div>
          <div>
            <span className="text-gray-500">{t('purchasePrice')}:</span>
            <p className="font-medium text-green-600">{formatCurrency(vehicle.purchasePrice)}</p>
          </div>
          <div>
            <span className="text-gray-500">{t('salePrice')}:</span>
            <p className="font-medium text-blue-600">{formatCurrency(vehicle.salePrice)}</p>
          </div>
        </div>

        {vehicle.category === 'sold' && vehicle.seller && (
          <div className="bg-gray-50 p-2 rounded text-sm">
            <span className="text-gray-500">{t('seller')}:</span>
            <p className="font-medium">{vehicle.seller}</p>
            <span className="text-gray-500">{t('finalSalePrice')}:</span>
            <p className="font-medium text-green-600">{formatCurrency(vehicle.finalSalePrice || 0)}</p>
          </div>
        )}

        <div className="flex space-x-2">
          <Button 
            size="sm" 
            variant="outline" 
            className="flex-1"
            onClick={() => onEdit(vehicle)}
          >
            <Edit className="h-3 w-3 mr-1" />
            {t('edit')}
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            className="flex-1"
            onClick={() => onDuplicate(vehicle)}
          >
            <Copy className="h-3 w-3 mr-1" />
            {t('duplicate')}
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            className="text-red-600 hover:text-red-700"
            onClick={() => onDelete && onDelete(vehicle)}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default VehicleCard;
