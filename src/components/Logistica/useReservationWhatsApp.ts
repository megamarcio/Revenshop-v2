
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Reservation } from './types/reservationTypes';

interface WhatsAppGroup {
  id: string;
  name: string;
  phone: string;
}

export const useReservationWhatsApp = () => {
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
      toast({
        title: "Erro",
        description: "Erro ao carregar grupos do WhatsApp.",
        variant: "destructive",
      });
    }
  };

  const sendReservationViaWhatsApp = async (reservationData: Reservation, onClose: () => void) => {
    if (!selectedGroup) {
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
          description: "URL do webhook não configurada. Configure em Configurações > WhatsApp.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      const selectedGroupData = groups.find(g => g.id === selectedGroup);

      // Transform the reservation data to match the expected webhook format
      const webhookData = {
        type: 'reservation_share',
        recipient: {
          groupId: selectedGroup,
          groupName: selectedGroupData?.name,
          groupPhone: selectedGroupData?.phone
        },
        reservation: {
          reservation_id: reservationData.id,
          customer_first_name: reservationData.customer.label.split(' ')[0] || '',
          customer_last_name: reservationData.customer.label.split(' ').slice(1).join(' ') || '',
          pickup_date: reservationData.pick_up_date,
          return_date: reservationData.return_date,
          plate: reservationData.reservation_vehicle_information.plate,
          phone_number: reservationData.customer.phone_number,
          customer_full_name: reservationData.customer.label,
        },
        timestamp: new Date().toISOString()
      };

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

      if (!response.ok) {
        let errorMessage = `Erro ${response.status}: ${response.statusText}`;
        try {
          const errorText = await response.text();
          if (errorText) {
            errorMessage += ` - ${errorText}`;
          }
        } catch (e) {
          // Ignore
        }
        throw new Error(errorMessage);
      }

      toast({
        title: "Sucesso",
        description: `Reserva enviada com sucesso para o grupo ${selectedGroupData?.name}!`,
      });

      onClose();
      setSelectedGroup('');
    } catch (error: any) {
      console.error('Erro ao enviar via WhatsApp:', error);
      toast({
        title: "Erro de Webhook",
        description: error.message || "Erro ao enviar reserva via WhatsApp. Verifique a configuração do webhook.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    selectedGroup,
    setSelectedGroup,
    groups,
    isLoading,
    loadGroups,
    sendReservationViaWhatsApp
  };
};
