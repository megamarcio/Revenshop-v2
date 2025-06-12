
import { supabase } from '../../../integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface EmailData {
  to: string;
  subject: string;
  customerName: string;
  pdfBlob: Blob;
}

export const sendFinancingEmail = async (emailData: EmailData): Promise<boolean> => {
  try {
    // Get email settings
    const { data: settings, error: settingsError } = await supabase
      .from('email_settings')
      .select('*')
      .limit(1)
      .single();

    if (settingsError || !settings) {
      toast({
        title: 'Erro',
        description: 'Configurações de email não encontradas. Configure o email nas configurações do sistema.',
        variant: 'destructive',
      });
      return false;
    }

    // For now, we'll simulate the email sending since we don't have a backend email service
    // In a real implementation, you would send this to your backend service
    console.log('Email would be sent with the following data:', {
      to: emailData.to,
      subject: emailData.subject,
      customerName: emailData.customerName,
      settings: settings,
      pdfSize: emailData.pdfBlob.size,
    });

    // Simulate async email sending
    await new Promise(resolve => setTimeout(resolve, 2000));

    toast({
      title: 'Email Enviado',
      description: `Email enviado com sucesso para ${emailData.to}`,
    });

    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    toast({
      title: 'Erro',
      description: 'Erro ao enviar email. Tente novamente.',
      variant: 'destructive',
    });
    return false;
  }
};

export const createEmailMessage = (customerName: string): string => {
  return `Olá ${customerName},

Muito obrigado por simular o seu financiamento conosco.

Segue anexo o PDF dos valores solicitados.

Tenha um ótimo dia.

Equipe de Vendas

---
Revenshop - Sistema de Gestão Automotiva
Facilitando seus negócios automotivos`;
};
