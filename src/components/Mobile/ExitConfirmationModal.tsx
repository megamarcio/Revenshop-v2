
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Shield } from 'lucide-react';

interface ExitConfirmationModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const ExitConfirmationModal = ({ isOpen, onConfirm, onCancel }: ExitConfirmationModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="w-[90%] max-w-md mx-auto rounded-lg">
        <DialogHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-orange-100 p-3 rounded-full">
              <AlertTriangle className="h-6 w-6 text-orange-600" />
            </div>
          </div>
          <DialogTitle className="text-lg font-semibold">
            Sair do Sistema?
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground mt-2">
            Tem certeza que deseja sair do REVENSHOP? Todos os dados não salvos podem ser perdidos.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col gap-3 mt-6">
          <Button
            onClick={onCancel}
            variant="outline"
            className="w-full flex items-center justify-center gap-2"
          >
            <Shield className="h-4 w-4" />
            Continuar no Sistema
          </Button>
          
          <Button
            onClick={onConfirm}
            variant="destructive"
            className="w-full"
          >
            Sim, Sair do Sistema
          </Button>
        </div>
        
        <div className="text-xs text-center text-muted-foreground mt-4">
          Pressione novamente o botão voltar para confirmar a saída
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExitConfirmationModal;
