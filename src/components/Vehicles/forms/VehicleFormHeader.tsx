
import React from 'react';
import { Button } from '@/components/ui/button';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { Car, X, ExternalLink, Wrench } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import { useLanguage } from '../../../contexts/LanguageContext';

interface VehicleFormHeaderProps {
  isEditing: boolean;
  isLoading: boolean;
  formData: any;
  onClose: () => void;
  onCarfaxClick: () => void;
  onViewMaintenance: () => void;
}

const VehicleFormHeader = ({
  isEditing,
  isLoading,
  formData,
  onClose,
  onCarfaxClick,
  onViewMaintenance
}: VehicleFormHeaderProps) => {
  const { t } = useLanguage();
  const { isAdmin, isInternalSeller } = useAuth();

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
        {formData.vin && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onCarfaxClick}
            className="flex items-center gap-2"
            title="Ver Carfax"
          >
            <img 
              src="/lovable-uploads/c0940bfc-455c-4f29-b281-d3e148371e8d.png" 
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
