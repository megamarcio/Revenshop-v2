import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Edit, Copy, Trash2, Car, Eye, DollarSign } from 'lucide-react';
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

  const handleCarfaxLookup = (vin: string) => {
    const carfaxUrl = `https://www.carfaxonline.com/vhr/${vin}`;
    window.open(carfaxUrl, '_blank');
  };

  return (
    <TooltipProvider>
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
              className={`text-xs px-2 py-1 font-medium ${
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
          {/* Título com código */}
          <div>
            <h3 className="text-[11px] font-bold text-gray-900 leading-tight mb-0.5">
              {vehicle.internalCode} - {vehicle.name}
            </h3>
            {/* Ano e cor centralizados */}
            <p className="text-xs text-gray-600 text-center">{vehicle.year} • {vehicle.color}</p>
          </div>

          {/* VIN e Milhas com fonte 11 em negrito */}
          <div className="bg-gray-50 p-1.5 rounded text-center">
            <span className="text-[11px] text-gray-500 font-bold tracking-wide block">
              VIN: {vehicle.vin}
            </span>
            <span className="text-[11px] text-gray-600 mt-1 block font-bold">
              Milhas: {vehicle.plate}
            </span>
          </div>

          {/* Preço de venda em destaque */}
          <div className="bg-green-50 p-2 rounded border border-green-200">
            <span className="text-xs text-green-600 block text-center">Preço de Venda:</span>
            <p className="text-sm font-bold text-green-700 text-center">{formatCurrency(vehicle.salePrice)}</p>
          </div>

          {/* Informações de venda se vendido */}
          {vehicle.category === 'sold' && vehicle.seller && (
            <div className="bg-gray-50 p-2 rounded text-center border-t">
              <div className="text-xs text-gray-500 mb-1">Vendido por:</div>
              <div className="text-xs font-medium text-gray-700">{vehicle.seller}</div>
              {vehicle.finalSalePrice && (
                <div className="text-xs font-semibold text-green-600 mt-1">
                  {formatCurrency(vehicle.finalSalePrice)}
                </div>
              )}
            </div>
          )}

          {/* Botões de ação - apenas ícones */}
          <div className="flex gap-1 pt-2 border-t border-gray-100">
            <Button 
              size="sm" 
              variant="outline" 
              className="h-7 w-7 p-0"
              onClick={() => onEdit(vehicle)}
              title="Editar"
            >
              <Edit className="h-3 w-3" />
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              className="h-7 w-7 p-0"
              onClick={() => onDuplicate(vehicle)}
              title="Duplicar"
            >
              <Copy className="h-3 w-3" />
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              className="h-7 w-7 p-0"
              onClick={() => handleCarfaxLookup(vehicle.vin)}
              title="Consultar Carfax"
            >
              <img 
                src="/lovable-uploads/c0940bfc-455c-4f29-b281-d3e148371e8d.png" 
                alt="Carfax" 
                className="h-3 w-3 object-contain"
              />
            </Button>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="h-7 w-7 p-0"
                  title="Ver Preço de Compra"
                >
                  <Eye className="h-3 w-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="font-semibold">{formatCurrency(vehicle.purchasePrice)}</p>
              </TooltipContent>
            </Tooltip>
            <Button 
              size="sm" 
              variant="outline" 
              className="h-7 w-7 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={() => onDelete && onDelete(vehicle)}
              title="Excluir"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};

export default VehicleCard;
