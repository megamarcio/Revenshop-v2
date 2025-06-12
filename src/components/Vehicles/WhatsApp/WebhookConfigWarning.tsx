
import React from 'react';
import { AlertCircle } from 'lucide-react';

const WebhookConfigWarning = () => {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
      <div className="flex items-start gap-2">
        <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5" />
        <div className="text-sm text-blue-800">
          <p className="font-medium">Configuração necessária</p>
          <p>Certifique-se de que o webhook esteja configurado corretamente em Configurações WhatsApp</p>
        </div>
      </div>
    </div>
  );
};

export default WebhookConfigWarning;
