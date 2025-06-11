
import React from 'react';
import { Button } from '@/components/ui/button';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { Car, X, Wrench } from 'lucide-react';
import { useLanguage } from '../../../contexts/LanguageContext';

interface VehicleFormHeaderProps {
  isEditing: boolean;
  isAdmin: boolean;
  isInternalSeller: boolean;
  isLoading: boolean;
  vehicleVin?: string;
  onClose: () => void;
  onViewMaintenance: () => void;
  onCarfaxClick: () => void;
}

const VehicleFormHeader = ({
  isEditing,
  isAdmin,
  isInternalSeller,
  isLoading,
  vehicleVin,
  onClose,
  onViewMaintenance,
  onCarfaxClick
}: VehicleFormHeaderProps) => {
  const { t } = useLanguage();

  return (
    <CardHeader className="flex flex-row items-center justify-between">
      <div className="flex items-center space-x-2">
        <Car className="h-6 w-6 text-revenshop-primary" />
        <CardTitle>{isEditing ? t('editVehicle') : t('addVehicle')}</CardTitle>
      </div>
      <div className="flex items-center space-x-2">
        {(isAdmin || isInternalSeller) && isEditing && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onViewMaintenance}
            className="flex items-center gap-2"
            title="Ver Manutenções"
          >
            <Wrench className="h-4 w-4" />
            Manutenções
          </Button>
        )}
        {vehicleVin && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onCarfaxClick}
            className="flex items-center gap-2"
            title="Ver Carfax"
          >
            <img 
              src="/lovable-uploads/f4315c70-bf51-4461-916d-f4f2c3305516.png" 
              alt="Carfax" 
              className="h-4 w-4"
            />
            Carfax
          </Button>
        )}
        <Button variant="ghost" size="icon" onClick={onClose} disabled={isLoading}>
          <X className="h-4 w-4" />
        </Button>
      </div>
    </CardHeader>
  );
};

export default VehicleFormHeader;
