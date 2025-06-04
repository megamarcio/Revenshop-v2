
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';

interface VehicleListHeaderProps {
  onAddVehicle: () => void;
}

const VehicleListHeader = ({ onAddVehicle }: VehicleListHeaderProps) => {
  const { t } = useLanguage();
  const { canEditVehicles } = useAuth();

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{t('vehicles')}</h1>
        <p className="text-gray-600">Gerencie seu estoque de veículos</p>
      </div>
      {canEditVehicles && (
        <Button 
          onClick={onAddVehicle}
          className="bg-revenshop-primary hover:bg-revenshop-primary/90"
        >
          <Plus className="h-4 w-4 mr-2" />
          {t('addVehicle')}
        </Button>
      )}
    </div>
  );
};

export default VehicleListHeader;
