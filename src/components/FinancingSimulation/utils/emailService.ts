
import { supabase } from '@/integrations/supabase/client';
import { FinancingData, CalculationResults } from '../types';
import { generatePDFContent } from './pdfGenerator';

export interface EmailData {
  to: string;
  customerName: string;
  pdfContent: string;
  companyLogo?: string;
}

export const sendFinancingEmail = async (
  financingData: FinancingData, 
  results: CalculationResults
): Promise<boolean> => {
  try {
    if (!financingData.customer?.email) {
      throw new Error('Email do cliente não encontrado');
    }

    // Gerar conteúdo do PDF
    const pdfContent = await generatePDFContent(financingData, results);

    // Preparar dados do email
    const emailData: EmailData = {
      to: financingData.customer.email,
      customerName: financingData.customer.name,
      pdfContent,
    };

    // Buscar configurações de email e logotipo
    const { data: emailSettings } = await supabase.rpc('get_email_settings');
    if (emailSettings && emailSettings.length > 0) {
      emailData.companyLogo = emailSettings[0].company_logo;
    }

    // Enviar email através da Edge Function
    const { data, error } = await supabase.functions.invoke('send-financing-email', {
      body: emailData
    });

    if (error) {
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Erro ao enviar email:', error);
    throw error;
  }
};
