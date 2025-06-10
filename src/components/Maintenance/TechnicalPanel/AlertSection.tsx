
import React from 'react';
import { AlertTriangle, Clock } from 'lucide-react';
import { AlertSectionProps } from './types';

const AlertSection = ({ urgentItems, needsAttentionItems }: AlertSectionProps) => {
  if (urgentItems.length === 0 && needsAttentionItems.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      {urgentItems.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <span className="font-medium text-red-800">Itens Urgentes ({urgentItems.length})</span>
          </div>
          <div className="text-sm text-red-700">
            {urgentItems.map(item => item.name).join(', ')}
          </div>
        </div>
      )}
      
      {needsAttentionItems.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-4 w-4 text-yellow-600" />
            <span className="font-medium text-yellow-800">Precisam de Atenção ({needsAttentionItems.length})</span>
          </div>
          <div className="text-sm text-yellow-700">
            {needsAttentionItems.map(item => item.name).join(', ')}
          </div>
        </div>
      )}
    </div>
  );
};

export default AlertSection;
