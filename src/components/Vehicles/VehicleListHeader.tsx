
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Upload } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import VehicleImportModal from './VehicleImport/VehicleImportModal';
import QuickLinksMenu from '../Layout/QuickLinksMenu';

interface VehicleListHeaderProps {
  onAddVehicle: () => void;
  onImportComplete?: () => void;
}

const VehicleListHeader = ({ onAddVehicle, onImportComplete }: VehicleListHeaderProps) => {
  const { t } = useLanguage();
  const { canEditVehicles } = useAuth();
  const [showImportModal, setShowImportModal] = useState(false);

  const handleImportComplete = () => {
    setShowImportModal(false);
    if (onImportComplete) {
      onImportComplete();
    }
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('vehicles')}</h1>
          <p className="text-gray-600">{t('subtitle')}</p>
        </div>
        <div className="flex items-center gap-2">
          <QuickLinksMenu />
          {canEditVehicles && (
            <>
              <Button 
                onClick={() => setShowImportModal(true)}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Upload className="h-4 w-4" />
                Importar Veículos
              </Button>
              <Button 
                onClick={onAddVehicle}
                className="bg-revenshop-primary hover:bg-revenshop-primary/90"
              >
                <Plus className="h-4 w-4 mr-2" />
                {t('addVehicle')}
              </Button>
            </>
          )}
        </div>
      </div>

      <VehicleImportModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onImportComplete={handleImportComplete}
      />
    </>
  );
};

export default VehicleListHeader;
