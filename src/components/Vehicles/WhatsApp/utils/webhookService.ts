
interface WebhookData {
  type: 'vehicle_share';
  sendType: 'client' | 'group';
  recipient: {
    phone?: string;
    groupId?: string;
    groupName?: string;
    groupPhone?: string;
  };
  vehicle: any;
  timestamp: string;
}

export const sendWebhookRequest = async (webhookData: WebhookData): Promise<Response> => {
  const webhookUrl = localStorage.getItem('whatsapp_webhook_url');
  
  if (!webhookUrl) {
    throw new Error('URL do webhook não configurada. Configure em Configurações WhatsApp.');
  }

  console.log('Tentando enviar para webhook:', webhookUrl);

  const webhookSecret = localStorage.getItem('whatsapp_webhook_secret');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  };

  if (webhookSecret) {
    headers['X-Webhook-Secret'] = webhookSecret;
  }

  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers,
    body: JSON.stringify(webhookData)
  });

  console.log('Resposta do webhook:', response.status, response.statusText);

  if (!response.ok) {
    let errorMessage = `Erro ${response.status}: ${response.statusText}`;
    
    try {
      const errorText = await response.text();
      if (errorText) {
        errorMessage += ` - ${errorText}`;
      }
    } catch (e) {
      // Ignorar erro ao ler resposta
    }

    if (response.status === 404) {
      errorMessage = `Webhook não encontrado (404). Verifique se a URL está correta: ${webhookUrl}`;
    } else if (response.status === 500) {
      errorMessage = `Erro interno do servidor (500). Verifique se o serviço está funcionando corretamente.`;
    } else if (response.status === 403) {
      errorMessage = `Acesso negado (403). Verifique as credenciais ou chave secreta.`;
    }

    throw new Error(errorMessage);
  }

  return response;
};

export const createWebhookData = (
  sendType: 'client' | 'group',
  phoneNumber: string,
  selectedGroup: string,
  selectedGroupData: any,
  vehicleData: any,
  vehiclePhotos: string[]
): WebhookData => {
  return {
    type: 'vehicle_share',
    sendType,
    recipient: sendType === 'client' ? {
      phone: phoneNumber
    } : {
      groupId: selectedGroup,
      groupName: selectedGroupData?.name,
      groupPhone: selectedGroupData?.phone
    },
    vehicle: {
      id: vehicleData.id,
      name: vehicleData.name,
      year: vehicleData.year,
      model: vehicleData.model,
      color: vehicleData.color,
      miles: vehicleData.miles,
      vin: vehicleData.vin,
      salePrice: vehicleData.salePrice,
      description: vehicleData.description,
      photos: vehiclePhotos,
      photoCount: vehiclePhotos.length,
      video: vehicleData.video
    },
    timestamp: new Date().toISOString()
  };
};
