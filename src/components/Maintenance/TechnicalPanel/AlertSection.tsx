import React from 'react';
import { AlertTriangle, Clock, Wrench } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { TechnicalItem } from '../../../hooks/useTechnicalItems';

interface AlertSectionProps {
  trocarItems: TechnicalItem[];
  proximoTrocaItems: TechnicalItem[];
}

const AlertSection = ({ trocarItems, proximoTrocaItems }: AlertSectionProps) => {
  if (trocarItems.length === 0 && proximoTrocaItems.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      {trocarItems.length > 0 && (
        <div className="bg-red-50 border-l-4 border-red-400 rounded-r-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <span className="font-semibold text-red-800">Precisam Trocar Agora</span>
            <Badge variant="destructive" className="text-xs">
              {trocarItems.length}
            </Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {trocarItems.map(item => (
              <div key={item.id} className="flex items-center gap-2 bg-white p-2 rounded border border-red-200">
                <Wrench className="h-4 w-4 text-red-500 flex-shrink-0" />
                <span className="text-sm text-red-700 font-medium">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {proximoTrocaItems.length > 0 && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 rounded-r-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="h-5 w-5 text-yellow-600" />
            <span className="font-semibold text-yellow-800">Próximo da Troca</span>
            <Badge className="bg-yellow-100 text-yellow-800 text-xs">
              {proximoTrocaItems.length}
            </Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {proximoTrocaItems.map(item => (
              <div key={item.id} className="flex items-center gap-2 bg-white p-2 rounded border border-yellow-200">
                <Clock className="h-4 w-4 text-yellow-500 flex-shrink-0" />
                <span className="text-sm text-yellow-700 font-medium">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AlertSection;
