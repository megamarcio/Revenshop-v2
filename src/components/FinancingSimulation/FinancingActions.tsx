
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FileDown, Mail } from 'lucide-react';
import { generatePDF } from './utils/pdfGenerator';
import { sendFinancingEmail, createEmailMessage } from './utils/emailService';
import { toast } from '@/hooks/use-toast';

interface FinancingActionsProps {
  financingData: any;
  customerData: any;
  vehicleData: any;
}

const FinancingActions = ({ financingData, customerData, vehicleData }: FinancingActionsProps) => {
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);
  const [emailAddress, setEmailAddress] = useState('');
  const [isLoadingPDF, setIsLoadingPDF] = useState(false);
  const [isLoadingEmail, setIsLoadingEmail] = useState(false);

  const handleDownloadPDF = async () => {
    setIsLoadingPDF(true);
    try {
      await generatePDF(financingData, customerData, vehicleData);
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao gerar PDF.',
        variant: 'destructive',
      });
    } finally {
      setIsLoadingPDF(false);
    }
  };

  const handleSendEmail = async () => {
    if (!emailAddress || !customerData?.name) {
      toast({
        title: 'Erro',
        description: 'Por favor, preencha o email e certifique-se de que há um cliente selecionado.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoadingEmail(true);
    try {
      // Generate PDF blob for email attachment
      const pdfBlob = await generatePDF(financingData, customerData, vehicleData, true);
      
      const emailData = {
        to: emailAddress,
        subject: `Simulação de Financiamento - ${customerData.name}`,
        customerName: customerData.name,
        pdfBlob: pdfBlob as Blob,
      };

      const success = await sendFinancingEmail(emailData);
      if (success) {
        setIsEmailDialogOpen(false);
        setEmailAddress('');
      }
    } catch (error) {
      console.error('Error sending email:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao enviar email.',
        variant: 'destructive',
      });
    } finally {
      setIsLoadingEmail(false);
    }
  };

  return (
    <div className="flex gap-4 justify-center">
      <Button 
        onClick={handleDownloadPDF} 
        disabled={isLoadingPDF}
        className="flex items-center gap-2"
      >
        <FileDown className="h-4 w-4" />
        {isLoadingPDF ? 'Gerando...' : 'Baixar PDF'}
      </Button>

      <Dialog open={isEmailDialogOpen} onOpenChange={setIsEmailDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Envio por Email
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enviar Simulação por Email</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="email">Email do Cliente</Label>
              <Input
                id="email"
                type="email"
                value={emailAddress}
                onChange={(e) => setEmailAddress(e.target.value)}
                placeholder="cliente@email.com"
              />
            </div>
            <div className="text-sm text-gray-600">
              <p><strong>Cliente:</strong> {customerData?.name || 'Não selecionado'}</p>
              <p><strong>Veículo:</strong> {vehicleData?.name || 'Não selecionado'}</p>
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setIsEmailDialogOpen(false)}>
                Cancelar
              </Button>
              <Button 
                onClick={handleSendEmail} 
                disabled={isLoadingEmail || !emailAddress}
              >
                {isLoadingEmail ? 'Enviando...' : 'Enviar Email'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FinancingActions;
