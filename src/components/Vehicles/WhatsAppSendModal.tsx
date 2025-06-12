
import React, { useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { MessageCircle, Send } from 'lucide-react';
import WebhookConfigWarning from './WhatsApp/WebhookConfigWarning';
import SendTypeSelector from './WhatsApp/SendTypeSelector';
import ClientPhoneInput from './WhatsApp/ClientPhoneInput';
import GroupSelector from './WhatsApp/GroupSelector';
import { useWhatsAppSend } from './WhatsApp/useWhatsAppSend';

interface WhatsAppSendModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicleData: any;
}

const WhatsAppSendModal = ({ isOpen, onClose, vehicleData }: WhatsAppSendModalProps) => {
  const {
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
  } = useWhatsAppSend();

  useEffect(() => {
    if (isOpen) {
      loadGroups();
    }
  }, [isOpen]);

  const handleSend = async () => {
    await sendViaWhatsApp(vehicleData, onClose);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Enviar via WhatsApp
          </DialogTitle>
          <DialogDescription>
            Envie os dados do veículo para um cliente ou grupo
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <WebhookConfigWarning />

          <SendTypeSelector
            sendType={sendType}
            onSendTypeChange={setSendType}
          />

          {sendType === 'client' && (
            <ClientPhoneInput
              phoneNumber={phoneNumber}
              onPhoneNumberChange={setPhoneNumber}
            />
          )}

          {sendType === 'group' && (
            <GroupSelector
              groups={groups}
              selectedGroup={selectedGroup}
              onGroupChange={setSelectedGroup}
            />
          )}

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose} disabled={isLoading}>
              Cancelar
            </Button>
            <Button onClick={handleSend} disabled={isLoading}>
              {isLoading ? (
                'Enviando...'
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Enviar
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WhatsAppSendModal;
