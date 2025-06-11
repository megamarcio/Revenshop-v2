
import React from 'react';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { DocumentUpload } from '../../ui/document-upload';
import { CustomerBankStatement, CustomerPaymentDocument } from '../../../hooks/useCustomerDocuments';

interface DocumentsSectionProps {
  customerId?: string;
  bankStatements: CustomerBankStatement[];
  paymentDocuments: CustomerPaymentDocument[];
  onAddBankStatement: (url: string) => Promise<any>;
  onAddPaymentDocument: (url: string) => Promise<any>;
  onRemoveBankStatement: (id: string) => Promise<void>;
  onRemovePaymentDocument: (id: string) => Promise<void>;
  isOpen: boolean;
  onToggle: (open: boolean) => void;
}

export const DocumentsSection = ({
  customerId,
  bankStatements,
  paymentDocuments,
  onAddBankStatement,
  onAddPaymentDocument,
  onRemoveBankStatement,
  onRemovePaymentDocument,
  isOpen,
  onToggle
}: DocumentsSectionProps) => {
  return (
    <Collapsible open={isOpen} onOpenChange={onToggle}>
      <CollapsibleTrigger asChild>
        <Button variant="outline" className="w-full justify-between">
          <span className="font-semibold text-lg">Comprovantes e Documentos</span>
          <span>{isOpen ? '−' : '+'}</span>
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-4 mt-4">
        {customerId && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DocumentUpload
              title="Comprovantes de Pagamento"
              description="Upload dos comprovantes de pagamento da compra"
              documents={paymentDocuments}
              onUpload={onAddPaymentDocument}
              onRemove={onRemovePaymentDocument}
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              maxFiles={5}
            />
            <DocumentUpload
              title="Extratos Bancários"
              description="Upload dos extratos bancários dos últimos 3 meses"
              documents={bankStatements}
              onUpload={onAddBankStatement}
              onRemove={onRemoveBankStatement}
              accept=".pdf,.jpg,.jpeg,.png"
              maxFiles={3}
            />
          </div>
        )}
        {!customerId && (
          <p className="text-sm text-gray-500 text-center py-4">
            Salve o cliente primeiro para poder enviar documentos
          </p>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
};
