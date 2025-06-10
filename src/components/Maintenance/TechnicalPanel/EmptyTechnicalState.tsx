
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings, Plus } from 'lucide-react';

interface EmptyTechnicalStateProps {
  onCreateDefaults: () => void;
}

const EmptyTechnicalState = ({ onCreateDefaults }: EmptyTechnicalStateProps) => {
  return (
    <Card className="border-dashed border-2 border-gray-300">
      <CardContent className="p-12 text-center">
        <Settings className="h-16 w-16 mx-auto mb-4 text-gray-400" />
        <h3 className="text-lg font-semibold text-gray-600 mb-2">
          Nenhum item técnico encontrado
        </h3>
        <p className="text-gray-500 mb-4">
          Crie os itens técnicos padrão para começar o controle de manutenções
        </p>
        <Button onClick={onCreateDefaults} className="bg-revenshop-primary hover:bg-revenshop-primary/90">
          <Plus className="h-4 w-4 mr-2" />
          Criar Itens Padrão
        </Button>
      </CardContent>
    </Card>
  );
};

export default EmptyTechnicalState;
