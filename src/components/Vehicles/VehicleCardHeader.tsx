
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, DownloadCloud, Loader2 } from 'lucide-react';
import VehiclePhotoDisplay from './VehiclePhotoDisplay';
import { Vehicle } from './VehicleCardTypes';

interface VehicleCardHeaderProps {
  vehicle: Vehicle;
  onDownloadSingle: (photoUrl: string, index: number) => Promise<void>;
  onDownloadAll: () => Promise<void>;
  downloading: boolean;
}

const VehicleCardHeader = ({ vehicle, onDownloadSingle, onDownloadAll, downloading }: VehicleCardHeaderProps) => {
  
  const getCategoryLabel = (vehicle: Vehicle) => {
    // Verificar se há categoria estendida na descrição
    if (vehicle.category === 'forSale' && vehicle.description) {
      const match = vehicle.description.match(/\[CATEGORY:([^\]]+)\]/);
      if (match) {
        const extendedCategory = match[1];
        switch (extendedCategory) {
          case 'rental': return 'Aluguel';
          case 'maintenance': return 'Manutenção';
          case 'consigned': 
            // Verificar se há loja específica
            const storeMatch = vehicle.description.match(/\[STORE:([^\]]+)\]/);
            return storeMatch ? `Consignado - ${storeMatch[1]}` : 'Consignado';
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

  const getCategoryColor = (vehicle: Vehicle) => {
    // Verificar se há categoria estendida na descrição
    if (vehicle.category === 'forSale' && vehicle.description) {
      const match = vehicle.description.match(/\[CATEGORY:([^\]]+)\]/);
      if (match) {
        const extendedCategory = match[1];
        switch (extendedCategory) {
          case 'rental': return 'bg-purple-600 text-white';
          case 'maintenance': return 'bg-yellow-600 text-white';
          case 'consigned': return 'bg-orange-600 text-white';
          default: return 'bg-green-600 text-white';
        }
      }
    }
    
    // Cores padrão
    switch (vehicle.category) {
      case 'forSale': return 'bg-green-600 text-white';
      case 'sold': return 'bg-blue-600 text-white';
      case 'maintenance': return 'bg-yellow-600 text-white';
      case 'rental': return 'bg-purple-600 text-white';
      case 'consigned': return 'bg-orange-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  return (
    <div className="relative">
      <VehiclePhotoDisplay
        photos={vehicle.photos}
        vehicleName={vehicle.name}
        onDownloadSingle={onDownloadSingle}
        onDownloadAll={onDownloadAll}
        className="w-full"
        showCarousel={true}
      />
      
      {/* Category Badge */}
      <div className={`absolute top-2 left-2 px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(vehicle)} shadow-md z-10`}>
        {getCategoryLabel(vehicle)}
      </div>
      
      {/* Loading indicator when downloading */}
      {downloading && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-20">
          <Loader2 className="h-8 w-8 text-white animate-spin" />
        </div>
      )}
    </div>
  );
};

export default VehicleCardHeader;
