
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Wrench } from 'lucide-react';

interface EmptyMaintenanceStateProps {
  statusFilter: 'open' | 'pending' | 'completed' | 'all';
}

const EmptyMaintenanceState = ({ statusFilter }: EmptyMaintenanceStateProps) => {
  return (
    <Card>
      <CardContent className="p-12 text-center">
        <Wrench className="h-16 w-16 mx-auto mb-4 text-gray-400" />
        <h3 className="text-lg font-semibold text-gray-600 mb-2">
          Nenhuma manutenção encontrada
        </h3>
        <p className="text-gray-500">
          {statusFilter !== 'all' 
            ? 'Tente ajustar os filtros de busca' 
            : 'Cadastre a primeira manutenção para começar'
          }
        </p>
      </CardContent>
    </Card>
  );
};

export default EmptyMaintenanceState;
