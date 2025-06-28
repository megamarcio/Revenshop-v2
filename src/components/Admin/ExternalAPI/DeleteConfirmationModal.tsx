import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Trash2 } from 'lucide-react';

interface DeleteConfirmationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  title: string;
  description: string;
  itemName: string;
  itemType: 'API' | 'Endpoint';
  isDeleting?: boolean;
  hasDependencies?: boolean;
  dependencies?: string[];
}

export const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  open,
  onOpenChange,
  onConfirm,
  title,
  description,
  itemName,
  itemType,
  isDeleting = false,
  hasDependencies = false,
  dependencies = []
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <Trash2 className="h-5 w-5" />
            {title}
          </DialogTitle>
          <DialogDescription>
            {description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Item a ser deletado */}
          <div className="p-4 bg-muted rounded-lg">
            <div className="font-medium">{itemName}</div>
            <div className="text-sm text-muted-foreground">Tipo: {itemType}</div>
          </div>

          {/* Aviso de dependências */}
          {hasDependencies && dependencies.length > 0 && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <div className="font-medium mb-2">
                  Esta {itemType.toLowerCase()} possui dependências que também serão removidas:
                </div>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  {dependencies.map((dependency, index) => (
                    <li key={index}>{dependency}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {/* Aviso geral */}
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Esta ação não pode ser desfeita. Todos os dados relacionados serão permanentemente removidos.
            </AlertDescription>
          </Alert>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
          >
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex items-center gap-2"
          >
            {isDeleting ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Removendo...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4" />
                Confirmar Exclusão
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}; 