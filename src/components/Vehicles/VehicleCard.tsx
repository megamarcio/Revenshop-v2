import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Edit, Copy, Trash2, Car, Eye, DollarSign, Download, Archive, EyeOff } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { downloadSinglePhoto, downloadAllPhotosAsZip } from '../../utils/photoDownloader';
import { toast } from '@/hooks/use-toast';

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
  const { canEditVehicles, canViewCostPrices, isInternalSeller, isSeller } = useAuth();
  const [showMinNegotiable, setShowMinNegotiable] = useState(false);
  const [downloading, setDownloading] = useState(false);

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

  const handleDownloadSingle = async (photoUrl: string, index: number) => {
    try {
      setDownloading(true);
      await downloadSinglePhoto(photoUrl, vehicle.name, index);
      toast({
        title: 'Sucesso',
        description: 'Foto baixada com sucesso!',
      });
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao baixar foto.',
        variant: 'destructive',
      });
    } finally {
      setDownloading(false);
    }
  };

  const handleDownloadAll = async () => {
    if (!vehicle.photos || vehicle.photos.length === 0) {
      toast({
        title: 'Aviso',
        description: 'Nenhuma foto disponível para download.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setDownloading(true);
      await downloadAllPhotosAsZip(vehicle.photos, vehicle.name);
      toast({
        title: 'Sucesso',
        description: 'Todas as fotos baixadas com sucesso!',
      });
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao baixar fotos.',
        variant: 'destructive',
      });
    } finally {
      setDownloading(false);
    }
  };

  const handleCopyDescription = () => {
    if (vehicle.description) {
      navigator.clipboard.writeText(vehicle.description);
      toast({
        title: 'Copiado!',
        description: 'Descrição copiada para a área de transferência.',
      });
    } else {
      toast({
        title: 'Aviso',
        description: 'Nenhuma descrição disponível para copiar.',
        variant: 'destructive',
      });
    }
  };

  return (
    <TooltipProvider>
      <Card className="hover:shadow-lg transition-all duration-300 border-gray-200 overflow-hidden">
        {/* Header com foto e badge */}
        <div className="relative">
          {vehicle.photos && vehicle.photos.length > 0 ? (
            <div className="h-32 w-full overflow-hidden bg-gray-100 relative group">
              <img 
                src={vehicle.photos[0]} 
                alt={vehicle.name}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              />
              {/* Download buttons overlay */}
              <div className="absolute top-1 left-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-1">
                {vehicle.photos.map((photo, index) => (
                  <Button
                    key={index}
                    size="sm"
                    variant="secondary"
                    className="h-6 w-6 p-0 bg-white/80 hover:bg-white"
                    onClick={() => handleDownloadSingle(photo, index)}
                    disabled={downloading}
                    title={`Baixar foto ${index + 1}`}
                  >
                    <Download className="h-3 w-3" />
                  </Button>
                ))}
                {vehicle.photos.length > 1 && (
                  <Button
                    size="sm"
                    variant="secondary"
                    className="h-6 w-6 p-0 bg-white/80 hover:bg-white"
                    onClick={handleDownloadAll}
                    disabled={downloading}
                    title="Baixar todas as fotos (ZIP)"
                  >
                    <Archive className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className="h-32 w-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
              <Car className="h-12 w-12 text-gray-400" />
            </div>
          )}
          
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
        
        <CardContent className="p-3 space-y-2">
          <div className="text-center">
            <h3 className="text-[11px] font-bold text-gray-900 leading-tight mb-0.5">
              {vehicle.internalCode} - {vehicle.name}
            </h3>
            <p className="text-xs text-gray-600">{vehicle.year} • {vehicle.color}</p>
          </div>

          <div className="bg-gray-50 p-1.5 rounded text-center">
            <span className="text-[11px] text-gray-500 font-bold tracking-wide block">
              VIN: {vehicle.vin}
            </span>
            <span className="text-[11px] text-gray-600 mt-1 block font-bold">
              Milhas: {vehicle.plate}
            </span>
          </div>

          <div className="bg-green-50 p-2 rounded border border-green-200">
            <span className="text-xs text-green-600 block text-center">Preço de Venda:</span>
            <p className="text-sm font-bold text-green-700 text-center">{formatCurrency(vehicle.salePrice)}</p>
          </div>

          {/* Minimum negotiable price for internal sellers */}
          {isInternalSeller && showMinNegotiable && (
            <div className="bg-yellow-50 p-2 rounded border border-yellow-200">
              <p className="text-sm font-bold text-yellow-700 text-center">
                {formatCurrency(vehicle.minNegotiable)}
              </p>
            </div>
          )}

          {/* Seller download photos button */}
          {isSeller && vehicle.photos && vehicle.photos.length > 0 && (
            <div className="bg-blue-50 p-2 rounded border border-blue-200">
              <Button
                size="sm"
                variant="outline"
                className="w-full h-7 text-xs"
                onClick={handleDownloadAll}
                disabled={downloading}
              >
                <Archive className="h-3 w-3 mr-1" />
                {downloading ? 'Baixando...' : 'Baixar Fotos (ZIP)'}
              </Button>
            </div>
          )}

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

          <div className="flex gap-1 pt-2 border-t border-gray-100 justify-center">
            {canEditVehicles && (
              <Button 
                size="sm" 
                variant="outline" 
                className="h-7 w-7 p-0"
                onClick={() => onEdit(vehicle)}
                title="Editar"
              >
                <Edit className="h-3 w-3" />
              </Button>
            )}
            <Button 
              size="sm" 
              variant="outline" 
              className="h-7 w-7 p-0"
              onClick={handleCopyDescription}
              title="Copiar Descrição"
              disabled={!vehicle.description}
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
            {isInternalSeller && (
              <Button
                size="sm"
                variant="outline"
                className="h-7 w-7 p-0"
                onClick={() => setShowMinNegotiable(!showMinNegotiable)}
                title="Ver Mín. Negociável"
              >
                {showMinNegotiable ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
              </Button>
            )}
            {canViewCostPrices && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="h-7 w-7 p-0"
                    title="Ver Preço de Compra"
                  >
                    <DollarSign className="h-3 w-3" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="font-semibold">{formatCurrency(vehicle.purchasePrice)}</p>
                </TooltipContent>
              </Tooltip>
            )}
            {canEditVehicles && onDelete && (
              <Button 
                size="sm" 
                variant="outline" 
                className="h-7 w-7 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={() => onDelete(vehicle)}
                title="Excluir"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};

export default VehicleCard;
