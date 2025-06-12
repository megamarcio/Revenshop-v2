import React from 'react';
import { CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wrench, ExternalLink, X, MessageCircle } from 'lucide-react';
import { useLanguage } from '../../../contexts/LanguageContext';

interface VehicleFormHeaderProps {
  isEditing: boolean;
  isAdmin: boolean;
  isInternalSeller: boolean;
  isLoading: boolean;
  vehicleVin: string;
  onClose: () => void;
  onViewMaintenance: () => void;
  onCarfaxClick: () => void;
  onWhatsAppSend?: () => void;
}

const VehicleFormHeader = ({
  isEditing,
  isAdmin,
  isInternalSeller,
  isLoading,
  vehicleVin,
  onClose,
  onViewMaintenance,
  onCarfaxClick,
  onWhatsAppSend
}: VehicleFormHeaderProps) => {
  const { t } = useLanguage();

  return (
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
      <div>
        <CardTitle>
          {isEditing ? t('editVehicle') : t('addVehicle')}
        </CardTitle>
        <CardDescription>
          {isEditing 
            ? 'Edite as informações do veículo' 
            : 'Preencha as informações do novo veículo'
          }
        </CardDescription>
      </div>
      
      <div className="flex items-center space-x-2">
        {isEditing && (isAdmin || isInternalSeller) && (
          <>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onViewMaintenance}
              disabled={isLoading}
            >
              <Wrench className="h-4 w-4 mr-2" />
              Manutenção
            </Button>
            
            {vehicleVin && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onCarfaxClick}
                disabled={isLoading}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                CarFax
              </Button>
            )}

            {onWhatsAppSend && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onWhatsAppSend}
                disabled={isLoading}
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                WhatsApp
              </Button>
            )}
          </>
        )}
        
        <Button variant="ghost" size="sm" onClick={onClose} disabled={isLoading}>
          <X className="h-4 w-4" />
        </Button>
      </div>
    </CardHeader>
  );
};

export default VehicleFormHeader;
