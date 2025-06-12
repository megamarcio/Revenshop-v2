
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface WhatsAppGroup {
  id: string;
  name: string;
  phone: string;
}

export const useWhatsAppSend = () => {
  const [sendType, setSendType] = useState<'client' | 'group'>('client');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('');
  const [groups, setGroups] = useState<WhatsAppGroup[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const loadGroups = async () => {
    try {
      const { data, error } = await supabase
        .from('whatsapp_groups')
        .select('id, name, phone')
        .order('name');

      if (error) throw error;
      setGroups(data || []);
    } catch (error) {
      console.error('Erro ao carregar grupos:', error);
    }
  };

  const sendViaWhatsApp = async (vehicleData: any, onClose: () => void) => {
    if (sendType === 'client' && !phoneNumber.trim()) {
      toast({
        title: "Erro",
        description: "Número de telefone é obrigatório para envio individual.",
        variant: "destructive",
      });
      return;
    }

    if (sendType === 'group' && !selectedGroup) {
      toast({
        title: "Erro",
        description: "Selecione um grupo para envio.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const webhookUrl = localStorage.getItem('whatsapp_webhook_url');
      if (!webhookUrl) {
        toast({
          title: "Erro",
          description: "URL do webhook não configurada. Configure em Configurações WhatsApp.",
          variant: "destructive",
        });
        return;
      }

      console.log('Tentando enviar para webhook:', webhookUrl);

      const selectedGroupData = sendType === 'group' 
        ? groups.find(g => g.id === selectedGroup)
        : null;

      // Buscar fotos do veículo no banco de dados
      let vehiclePhotos: string[] = [];
      
      if (vehicleData.id) {
        console.log('Buscando fotos para veículo ID:', vehicleData.id);
        
        try {
          // Buscar fotos antigas do vehicle_photos
          const { data: oldPhotos, error: oldPhotosError } = await supabase
            .from('vehicle_photos')
            .select('url')
            .eq('vehicle_id', vehicleData.id)
            .order('position', { ascending: true });

          if (oldPhotosError) {
            console.error('Erro ao buscar fotos antigas:', oldPhotosError);
          } else if (oldPhotos && oldPhotos.length > 0) {
            vehiclePhotos = oldPhotos.map(p => p.url);
            console.log('Fotos antigas encontradas:', vehiclePhotos.length);
          }

          // Buscar fotos novas do vehicles_photos_new
          const { data: newPhotos, error: newPhotosError } = await supabase
            .from('vehicles_photos_new')
            .select('url')
            .eq('vehicle_id', vehicleData.id)
            .order('created_at', { ascending: true });

          if (newPhotosError) {
            console.error('Erro ao buscar fotos novas:', newPhotosError);
          } else if (newPhotos && newPhotos.length > 0) {
            const newPhotoUrls = newPhotos.map(p => p.url);
            vehiclePhotos = [...vehiclePhotos, ...newPhotoUrls];
            console.log('Fotos novas encontradas:', newPhotoUrls.length);
          }
        } catch (error) {
          console.error('Erro ao buscar fotos do veículo:', error);
        }
      }

      // Se não encontrou fotos no banco, usar as fotos do objeto vehicleData
      if (vehiclePhotos.length === 0 && vehicleData.photos && vehicleData.photos.length > 0) {
        vehiclePhotos = vehicleData.photos;
        console.log('Usando fotos do vehicleData:', vehiclePhotos.length);
      }

      console.log('Total de fotos para envio:', vehiclePhotos.length);

      const webhookData = {
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
          photos: vehiclePhotos, // Agora inclui todas as fotos encontradas
          video: vehicleData.video
        },
        timestamp: new Date().toISOString()
      };

      console.log('Dados do webhook com fotos:', {
        ...webhookData,
        vehicle: {
          ...webhookData.vehicle,
          photosCount: vehiclePhotos.length
        }
      });

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

      toast({
        title: "Sucesso",
        description: `Veículo enviado com sucesso ${sendType === 'client' ? 'para o cliente' : 'para o grupo'} com ${vehiclePhotos.length} foto(s)!`,
      });

      onClose();
      setSendType('client');
      setPhoneNumber('');
      setSelectedGroup('');
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
