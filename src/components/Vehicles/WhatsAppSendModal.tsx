
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { MessageCircle, Users, User, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface WhatsAppGroup {
  id: string;
  name: string;
  phone: string;
}

interface WhatsAppSendModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicleData: any;
}

const WhatsAppSendModal = ({ isOpen, onClose, vehicleData }: WhatsAppSendModalProps) => {
  const [sendType, setSendType] = useState<'client' | 'group'>('client');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('');
  const [groups, setGroups] = useState<WhatsAppGroup[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      loadGroups();
    }
  }, [isOpen]);

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

  const handleSend = async () => {
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
          description: "URL do webhook não configurada. Configure em Configurações > WhatsApp.",
          variant: "destructive",
        });
        return;
      }

      const selectedGroupData = sendType === 'group' 
        ? groups.find(g => g.id === selectedGroup)
        : null;

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
          photos: vehicleData.photos || [],
          video: vehicleData.video
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
        throw new Error(`Erro no webhook: ${response.status}`);
      }

      toast({
        title: "Sucesso",
        description: `Veículo enviado com sucesso ${sendType === 'client' ? 'para o cliente' : 'para o grupo'}!`,
      });

      onClose();
      setSendType('client');
      setPhoneNumber('');
      setSelectedGroup('');
    } catch (error) {
      console.error('Erro ao enviar via WhatsApp:', error);
      toast({
        title: "Erro",
        description: "Erro ao enviar veículo via WhatsApp. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
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
          <div>
            <Label>Tipo de Envio</Label>
            <RadioGroup
              value={sendType}
              onValueChange={(value) => setSendType(value as 'client' | 'group')}
              className="mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="client" id="client" />
                <Label htmlFor="client" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Cliente Individual
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="group" id="group" />
                <Label htmlFor="group" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Grupo
                </Label>
              </div>
            </RadioGroup>
          </div>

          {sendType === 'client' && (
            <div className="space-y-2">
              <Label htmlFor="phone">Número do Telefone</Label>
              <Input
                id="phone"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Ex: +55 11 99999-9999"
              />
            </div>
          )}

          {sendType === 'group' && (
            <div className="space-y-2">
              <Label>Selecionar Grupo</Label>
              <Select value={selectedGroup} onValueChange={setSelectedGroup}>
                <SelectTrigger>
                  <SelectValue placeholder="Escolha um grupo..." />
                </SelectTrigger>
                <SelectContent>
                  {groups.map((group) => (
                    <SelectItem key={group.id} value={group.id}>
                      {group.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
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
