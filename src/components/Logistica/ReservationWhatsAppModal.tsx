
import React, { useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Send, Share2 } from 'lucide-react';
import WebhookConfigWarning from '@/components/Vehicles/WhatsApp/WebhookConfigWarning';
import GroupSelector from '@/components/Vehicles/WhatsApp/GroupSelector';
import { useReservationWhatsApp } from './useReservationWhatsApp';
import { Reservation } from './types/reservationTypes';

interface ReservationWhatsAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  reservationData: Reservation | null;
}

const ReservationWhatsAppModal = ({ isOpen, onClose, reservationData }: ReservationWhatsAppModalProps) => {
  const {
    selectedGroup,
    setSelectedGroup,
    groups,
    isLoading,
    loadGroups,
    sendReservationViaWhatsApp
  } = useReservationWhatsApp();

  useEffect(() => {
    if (isOpen) {
      loadGroups();
    }
  }, [isOpen]);

  const handleSend = async () => {
    if (!reservationData) return;
    await sendReservationViaWhatsApp(reservationData, onClose);
  };

  if (!reservationData) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Compartilhar Reserva via WhatsApp
          </DialogTitle>
          <DialogDescription>
            Envie os dados da reserva para um grupo de WhatsApp.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <WebhookConfigWarning />

          <GroupSelector
            groups={groups}
            selectedGroup={selectedGroup}
            onGroupChange={setSelectedGroup}
          />
        </div>
        
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancelar
          </Button>
          <Button onClick={handleSend} disabled={isLoading || !selectedGroup}>
            {isLoading ? (
              'Enviando...'
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Enviar para Grupo
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReservationWhatsAppModal;
