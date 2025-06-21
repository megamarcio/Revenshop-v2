import React from 'react';
import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Wrench, ExternalLink, MessageCircle, Plus, Settings, ChevronDown } from 'lucide-react';
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
  onWhatsAppSend?: () => void;
  onNewMaintenance?: () => void;
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
  onWhatsAppSend,
  onNewMaintenance
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
            {/* Botão compacto de manutenções com dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  variant="default"
                  size="sm"
                  disabled={isLoading}
                  className="bg-orange-600 hover:bg-orange-700 text-white border-orange-600 shadow-md hover:shadow-lg transition-all duration-200"
                >
                  <Wrench className="h-4 w-4 mr-2" />
                  Manutenções
                  <ChevronDown className="h-4 w-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={onViewMaintenance}>
                  <Settings className="h-4 w-4 mr-2" />
                  Ver Manutenções
                </DropdownMenuItem>
                {onNewMaintenance && (
                  <DropdownMenuItem onClick={onNewMaintenance}>
                    <Plus className="h-4 w-4 mr-2" />
                    Nova Manutenção
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
            
            {vehicleVin && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onCarfaxClick}
                disabled={isLoading}
                className="shadow-md hover:shadow-lg transition-all duration-200"
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
                className="shadow-md hover:shadow-lg transition-all duration-200"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                WhatsApp
              </Button>
            )}
          </>
        )}
        
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onClose}
          disabled={isLoading}
          className="shadow-md hover:shadow-lg transition-all duration-200"
        >
          Fechar
        </Button>
      </div>
    </CardHeader>
  );
};

export default VehicleFormHeader;
