
import { useToast } from '@/hooks/use-toast';

export const useWhatsAppValidation = () => {
  const { toast } = useToast();

  const validateSendData = (
    sendType: 'client' | 'group',
    phoneNumber: string,
    selectedGroup: string
  ): boolean => {
    if (sendType === 'client' && !phoneNumber.trim()) {
      toast({
        title: "Erro",
        description: "Número de telefone é obrigatório para envio individual.",
        variant: "destructive",
      });
      return false;
    }

    if (sendType === 'group' && !selectedGroup) {
      toast({
        title: "Erro",
        description: "Selecione um grupo para envio.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  return {
    validateSendData
  };
};
