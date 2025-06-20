
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TooltipProvider } from '@/components/ui/tooltip';
import { useAuth } from '../../contexts/AuthContext';
import { useVehicleCardActions } from './VehicleCardActions';
import VehicleCardHeader from './VehicleCardHeader';
import VehicleCardContent from './VehicleCardContent';
import VehicleCardButtons from './VehicleCardButtons';
import { VehicleCardProps } from './VehicleCardTypes';

const VehicleCard = ({ vehicle, onEdit, onDuplicate, onDelete }: VehicleCardProps) => {
  const { canEditVehicles, canViewCostPrices, isInternalSeller, isSeller } = useAuth();
  const [showMinNegotiable, setShowMinNegotiable] = useState(false);
  const [downloading, setDownloading] = useState(false);
  
  console.log('🎯 VEHICLE CARD DEBUG - Vehicle recebido:', vehicle);
  console.log('🎯 VEHICLE CARD DEBUG - Vehicle ID:', vehicle.id);
  console.log('🎯 VEHICLE CARD DEBUG - Vehicle name:', vehicle.name);
  console.log('🎯 VEHICLE CARD DEBUG - Vehicle photos:', vehicle.photos);
  
  const {
    formatCurrency,
    handleCarfaxLookup,
    handleDownloadSingle,
    handleDownloadAll,
    handleCopyDescription,
  } = useVehicleCardActions();

  const handleDownloadSingleWithLoading = async (photoUrl: string, index: number) => {
    setDownloading(true);
    try {
      await handleDownloadSingle(photoUrl, vehicle.name, index);
    } finally {
      setDownloading(false);
    }
  };

  const handleDownloadAllWithLoading = async () => {
    setDownloading(true);
    try {
      await handleDownloadAll(vehicle.photos, vehicle.name);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <TooltipProvider>
      <Card className="hover:shadow-lg transition-all duration-300 border-gray-200 overflow-hidden h-full">
        <VehicleCardHeader
          vehicle={vehicle}
          onDownloadSingle={handleDownloadSingleWithLoading}
          onDownloadAll={handleDownloadAllWithLoading}
          downloading={downloading}
        />
        
        <CardContent className="p-2 sm:p-3 space-y-2 flex flex-col h-full">
          <VehicleCardContent
            vehicle={vehicle}
            formatCurrency={formatCurrency}
            isInternalSeller={isInternalSeller}
            showMinNegotiable={showMinNegotiable}
            minNegotiable={vehicle.minNegotiable}
          />

          <div className="flex-1" />

          <VehicleCardButtons
            vehicle={vehicle}
            canEditVehicles={canEditVehicles}
            canViewCostPrices={canViewCostPrices}
            isInternalSeller={isInternalSeller}
            isSeller={isSeller}
            showMinNegotiable={showMinNegotiable}
            downloading={downloading}
            formatCurrency={formatCurrency}
            onEdit={() => onEdit(vehicle)}
            onCopyDescription={() => handleCopyDescription(vehicle.description)}
            onCarfaxLookup={() => handleCarfaxLookup(vehicle.vin)}
            onDownloadAll={handleDownloadAllWithLoading}
            onToggleMinNegotiable={() => setShowMinNegotiable(!showMinNegotiable)}
            onDelete={onDelete ? () => onDelete(vehicle) : undefined}
          />
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};

export default VehicleCard;
