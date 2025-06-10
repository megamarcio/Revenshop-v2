
import React from 'react';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import { useLanguage } from '../../../contexts/LanguageContext';

interface VehicleFormActionsProps {
  isLoading: boolean;
  isEditing: boolean;
  photosCount: number;
  onCancel: () => void;
}

const VehicleFormActions = ({
  isLoading,
  isEditing,
  photosCount,
  onCancel
}: VehicleFormActionsProps) => {
  const { t } = useLanguage();

  return (
    <>
      <div className="flex justify-end space-x-4 pt-6 border-t">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          {t('cancel')}
        </Button>
        <Button type="submit" disabled={isLoading}>
          <Save className="h-4 w-4 mr-2" />
          {isLoading ? 
            `${isEditing ? t('updating') : t('saving')}...` : 
            isEditing ? t('update') : t('save')
          }
        </Button>
      </div>
      
      {isLoading && photosCount > 5 && (
        <div className="text-center text-sm text-gray-600">
          <p>{t('processingPhotos') || `Processando ${photosCount} fotos... Isso pode levar alguns minutos.`}</p>
          <p>{t('dontCloseWindow') || 'Por favor, não feche esta janela.'}</p>
        </div>
      )}
    </>
  );
};

export default VehicleFormActions;
