
import { useToast } from '@/hooks/use-toast';
import { useWhatsAppGroups } from './hooks/useWhatsAppGroups';
import { useWhatsAppState } from './hooks/useWhatsAppState';
import { useWhatsAppValidation } from './hooks/useWhatsAppValidation';
import { getVehiclePhotos } from './utils/vehiclePhotoService';
import { sendWebhookRequest, createWebhookData } from './utils/webhookService';

export const useWhatsAppSend = () => {
  const { toast } = useToast();
  const { groups, loadGroups } = useWhatsAppGroups();
  const {
    sendType,
    setSendType,
    phoneNumber,
    setPhoneNumber,
    selectedGroup,
    setSelectedGroup,
    isLoading,
    setIsLoading,
    resetState
  } = useWhatsAppState();
  const { validateSendData } = useWhatsAppValidation();

  const sendViaWhatsApp = async (vehicleData: any, onClose: () => void) => {
    if (!validateSendData(sendType, phoneNumber, selectedGroup)) {
      return;
    }

    setIsLoading(true);
    try {
      const selectedGroupData = sendType === 'group' 
        ? groups.find(g => g.id === selectedGroup)
        : null;

      // Buscar fotos do veículo
      let vehiclePhotos: string[] = [];
      
      if (vehicleData.id) {
        vehiclePhotos = await getVehiclePhotos(vehicleData.id);
      }

      // Se ainda não encontrou fotos, usar as fotos do objeto vehicleData
      if (vehiclePhotos.length === 0 && vehicleData.photos && vehicleData.photos.length > 0) {
        vehiclePhotos = vehicleData.photos;
        console.log('Usando fotos do vehicleData:', vehiclePhotos.length);
      }

      console.log('Total de fotos para envio via webhook:', vehiclePhotos.length);
      console.log('URLs das fotos:', vehiclePhotos);

      const webhookData = createWebhookData(
        sendType,
        phoneNumber,
        selectedGroup,
        selectedGroupData,
        vehicleData,
        vehiclePhotos
      );

      console.log('Dados do webhook:', {
        ...webhookData,
        vehicle: {
          ...webhookData.vehicle,
          photoUrls: vehiclePhotos.slice(0, 3) // Mostrar apenas as 3 primeiras URLs no log
        }
      });

      await sendWebhookRequest(webhookData);

      toast({
        title: "Sucesso",
        description: `Veículo enviado com sucesso ${sendType === 'client' ? 'para o cliente' : 'para o grupo'} com ${vehiclePhotos.length} foto(s)!`,
      });

      onClose();
      resetState();
    } catch (error) {
      console.error('Erro ao enviar via WhatsApp:', error);
      toast({
        title: "Erro de Webhook",
        description: error.message || "Erro ao enviar veículo via WhatsApp. Verifique a configuração do webhook.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    sendType,
    setSendType,
    phoneNumber,
    setPhoneNumber,
    selectedGroup,
    setSelectedGroup,
    groups,
    isLoading,
    loadGroups,
    sendViaWhatsApp
  };
};
