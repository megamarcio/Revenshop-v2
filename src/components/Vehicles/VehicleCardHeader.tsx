
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Car, Download, Archive } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Vehicle } from './VehicleCardTypes';

interface VehicleCardHeaderProps {
  vehicle: Vehicle;
  onDownloadSingle: (photoUrl: string, index: number) => Promise<void>;
  onDownloadAll: () => Promise<void>;
  downloading: boolean;
}

const VehicleCardHeader = ({ vehicle, onDownloadSingle, onDownloadAll, downloading }: VehicleCardHeaderProps) => {
  const { t } = useLanguage();

  return (
    <div className="relative">
      {vehicle.photos && vehicle.photos.length > 0 ? (
        <div className="h-32 w-full overflow-hidden bg-gray-100 relative group">
          <img 
            src={vehicle.photos[0]} 
            alt={vehicle.name}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
          <div className="absolute top-1 left-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-1">
            {vehicle.photos.map((photo, index) => (
              <Button
                key={index}
                size="sm"
                variant="secondary"
                className="h-6 w-6 p-0 bg-white/80 hover:bg-white"
                onClick={() => onDownloadSingle(photo, index)}
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
                onClick={onDownloadAll}
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
  );
};

export default VehicleCardHeader;
