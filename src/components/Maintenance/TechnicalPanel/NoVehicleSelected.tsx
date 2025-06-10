
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Wrench, Settings } from 'lucide-react';

interface NoVehicleSelectedProps {
  isOpen: boolean;
  onClose: () => void;
}

const NoVehicleSelected = ({ isOpen, onClose }: NoVehicleSelectedProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader className="pb-4 border-b">
          <DialogTitle className="flex items-center gap-3 text-xl">
            <Wrench className="h-6 w-6 text-blue-600" />
            <div>
              <div className="text-xl font-bold">Painel Técnico</div>
              <div className="text-sm text-gray-600 font-normal">
                Selecione um veículo
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="p-6 text-center">
          <Settings className="h-16 w-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            Nenhum veículo selecionado
          </h3>
          <p className="text-gray-500 mb-4">
            Selecione um veículo específico na tela anterior para visualizar e gerenciar os itens técnicos.
          </p>
          <Button onClick={onClose} variant="outline">
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NoVehicleSelected;
