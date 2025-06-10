
import React from 'react';
import { RefreshCw } from 'lucide-react';

const LoadingTechnicalState = () => {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="flex items-center gap-3 text-gray-500">
        <RefreshCw className="h-5 w-5 animate-spin" />
        <span>Carregando itens técnicos...</span>
      </div>
    </div>
  );
};

export default LoadingTechnicalState;
