
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Printer, FileText, Mail, Loader2 } from 'lucide-react';
import { FinancingData, CalculationResults } from './types';
import { exportToPDF } from './utils/pdfExport';
import { sendFinancingEmail } from './utils/emailService';
import { useToast } from '@/hooks/use-toast';

interface FinancingActionsProps {
  financingData: FinancingData;
  results: CalculationResults;
}

const FinancingActions = ({ financingData, results }: FinancingActionsProps) => {
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const { toast } = useToast();

  const handlePrint = () => {
    window.print();
  };

  const handleExportPDF = () => {
    exportToPDF(financingData, results);
  };

  const handleSendEmail = async () => {
    if (!financingData.customer?.email) {
      toast({
        title: "Email não encontrado",
        description: "O cliente selecionado não possui email cadastrado.",
        variant: "destructive",
      });
      return;
    }

    setIsSendingEmail(true);
    try {
      await sendFinancingEmail(financingData, results);
      toast({
        title: "Email enviado",
        description: `Email enviado com sucesso para ${financingData.customer.email}`,
      });
    } catch (error) {
      console.error('Erro ao enviar email:', error);
      toast({
        title: "Erro no envio",
        description: "Erro ao enviar email. Verifique as configurações de email.",
        variant: "destructive",
      });
    } finally {
      setIsSendingEmail(false);
    }
  };

  return (
    <div className="flex space-x-2">
      <Button onClick={handlePrint} variant="outline">
        <Printer className="h-4 w-4 mr-2" />
        Imprimir
      </Button>
      <Button onClick={handleExportPDF} variant="outline">
        <FileText className="h-4 w-4 mr-2" />
        Exportar PDF
      </Button>
      <Button 
        onClick={handleSendEmail} 
        variant="outline" 
        disabled={isSendingEmail || !financingData.customer?.email}
      >
        {isSendingEmail ? (
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
        ) : (
          <Mail className="h-4 w-4 mr-2" />
        )}
        Envio por Email
      </Button>
    </div>
  );
};

export default FinancingActions;
