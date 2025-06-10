import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { toast } from '@/hooks/use-toast';
import { Car, X, Save, ExternalLink, Wrench, Trash2 } from 'lucide-react';
import BasicInfoForm from './forms/BasicInfoForm';
import FinancialInfoForm from './forms/FinancialInfoForm';
import SaleInfoForm from './forms/SaleInfoForm';
import MediaUploadForm from './forms/MediaUploadForm';
import DescriptionForm from './forms/DescriptionForm';
import MaintenanceViewModal from '../Maintenance/MaintenanceViewModal';
import { VehicleFormProps } from './types/vehicleFormTypes';
import { useVehicleForm } from './hooks/useVehicleForm';
import { useAuth } from '../../contexts/AuthContext';

interface ExtendedVehicleFormProps extends VehicleFormProps {
  onDelete?: (id: string) => Promise<void>;
}

const VehicleForm = ({ onClose, onSave, editingVehicle, onNavigateToCustomers, onDelete }: ExtendedVehicleFormProps) => {
  const { t } = useLanguage();
  const { isAdmin, isInternalSeller, canEditVehicles } = useAuth();
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);
  
  const {
    formData,
    photos,
    videos,
    isLoading,
    errors,
    isEditing,
    setPhotos,
    setVideos,
    setIsLoading,
    handleInputChange,
    handleCarfaxClick,
    validateFormData,
    generateDescription,
    calculateProfitMargin
  } = useVehicleForm(editingVehicle);

  // Fechar ao clicar fora da janela
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      const modal = document.querySelector('[data-vehicle-form-modal]');
      
      if (modal && !modal.contains(target) && !isLoading) {
        onClose();
      }
    };

    document.removeEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose, isLoading]);

  const handleViewMaintenance = () => {
    setShowMaintenanceModal(true);
  };

  const handleDelete = async () => {
    if (onDelete && editingVehicle?.id) {
      try {
        await onDelete(editingVehicle.id);
        toast({
          title: t('success'),
          description: 'Veículo excluído com sucesso!',
        });
        onClose();
      } catch (error) {
        console.error('Error deleting vehicle:', error);
        toast({
          title: t('error'),
          description: 'Erro ao excluir veículo.',
          variant: 'destructive',
        });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateFormData()) {
      toast({
        title: t('error'),
        description: t('fixRequiredFields') || 'Por favor, corrija os campos obrigatórios.',
        variant: 'destructive',
      });
      return;
    }

    // Validate number of photos to avoid timeouts
    if (photos.length > 8) {
      const confirmed = window.confirm(
        t('photoWarning') || `Você está tentando salvar ${photos.length} fotos. Isso pode tornar o processo mais lento. Deseja continuar?`
      );
      if (!confirmed) return;
    }

    setIsLoading(true);
    try {
      const vehicleData = {
        ...formData,
        year: parseInt(formData.year),
        caNote: parseInt(formData.caNote),
        purchasePrice: parseFloat(formData.purchasePrice),
        salePrice: parseFloat(formData.salePrice),
        minNegotiable: parseFloat(formData.minNegotiable || '0'),
        carfaxPrice: parseFloat(formData.carfaxPrice || '0'),
        mmrValue: parseFloat(formData.mmrValue || '0'),
        finalSalePrice: formData.finalSalePrice ? parseFloat(formData.finalSalePrice) : undefined,
        sellerCommission: formData.sellerCommission ? parseFloat(formData.sellerCommission) : undefined,
        photos: photos,
        video: videos.length > 0 ? videos[0] : undefined,
        videos: videos,
        titleInfo: formData.titleInfo,
        ...(isEditing && { id: editingVehicle.id })
      };

      console.log('VehicleForm - submitting vehicleData:', vehicleData);
      console.log('VehicleForm - operation type:', isEditing ? 'update' : 'create');

      // Show loading with estimated timeout based on number of photos
      const estimatedTime = Math.max(5, photos.length * 2);
      if (photos.length > 5) {
        toast({
          title: t('processing') || 'Processando...',
          description: t('savingPhotos') || `Salvando ${photos.length} fotos. Isso pode levar até ${estimatedTime} segundos.`,
        });
      }

      await onSave(vehicleData);
      
      const successMessage = `Veículo ${isEditing ? 'atualizado' : 'cadastrado'} com sucesso!`;
        
      toast({
        title: t('success'),
        description: successMessage,
      });
      onClose();
    } catch (error) {
      console.error('Error saving vehicle:', error);
      // Error already handled in useVehicles hook
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
        <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto" data-vehicle-form-modal>
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
                  onClick={handleViewMaintenance}
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
                  onClick={handleCarfaxClick}
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
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <BasicInfoForm
                formData={formData}
                errors={errors}
                onInputChange={handleInputChange}
              />

              <FinancialInfoForm
                formData={formData}
                errors={errors}
                onInputChange={handleInputChange}
                calculateProfitMargin={calculateProfitMargin}
                vehicleId={isEditing ? editingVehicle?.id : undefined}
                onViewMaintenance={handleViewMaintenance}
              />

              <SaleInfoForm
                formData={formData}
                errors={errors}
                onInputChange={handleInputChange}
                onNavigateToCustomers={onNavigateToCustomers}
              />

              <MediaUploadForm
                photos={photos}
                videos={videos}
                setPhotos={setPhotos}
                setVideos={setVideos}
              />

              <DescriptionForm
                description={formData.description}
                onDescriptionChange={(value) => handleInputChange('description', value)}
                generateDescription={generateDescription}
              />

              <div className="flex justify-end items-center space-x-4 pt-6 border-t">
                <div className="flex space-x-2">
                  <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
                    {t('cancel')}
                  </Button>
                  {canEditVehicles && isEditing && onDelete && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" disabled={isLoading}>
                          <Trash2 className="h-4 w-4 mr-2" />
                          Excluir
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                          <AlertDialogDescription>
                            Tem certeza que deseja excluir este veículo? Esta ação não pode ser desfeita.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Excluir
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </div>
                <Button type="submit" disabled={isLoading}>
                  <Save className="h-4 w-4 mr-2" />
                  {isLoading ? 
                    `${isEditing ? t('updating') : t('saving')}...` : 
                    isEditing ? t('update') : t('save')
                  }
                </Button>
              </div>
              
              {isLoading && photos.length > 5 && (
                <div className="text-center text-sm text-gray-600">
                  <p>{t('processingPhotos') || `Processando ${photos.length} fotos... Isso pode levar alguns minutos.`}</p>
                  <p>{t('dontCloseWindow') || 'Por favor, não feche esta janela.'}</p>
                </div>
              )}
            </form>
          </CardContent>
        </Card>
      </div>

      {showMaintenanceModal && (
        <MaintenanceViewModal
          isOpen={showMaintenanceModal}
          onClose={() => setShowMaintenanceModal(false)}
          vehicleId={editingVehicle?.id}
          vehicleName={formData.name}
        />
      )}
    </>
  );
};

export default VehicleForm;
