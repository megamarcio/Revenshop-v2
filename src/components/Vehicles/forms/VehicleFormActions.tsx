
import React from 'react';
import { Button } from '@/components/ui/button';
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
import { Save, Trash2 } from 'lucide-react';
import { useLanguage } from '../../../contexts/LanguageContext';

interface VehicleFormActionsProps {
  isEditing: boolean;
  isLoading: boolean;
  canEditVehicles: boolean;
  onClose: () => void;
  onDelete?: () => void;
  showDeleteButton: boolean;
}

const VehicleFormActions = ({
  isEditing,
  isLoading,
  canEditVehicles,
  onClose,
  onDelete,
  showDeleteButton
}: VehicleFormActionsProps) => {
  const { t } = useLanguage();

  return (
    <div className="flex justify-end items-center space-x-4 pt-6 border-t">
      <div className="flex space-x-2">
        <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
          {t('cancel')}
        </Button>
        {canEditVehicles && isEditing && showDeleteButton && onDelete && (
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
                <AlertDialogAction onClick={onDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
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
  );
};

export default VehicleFormActions;
