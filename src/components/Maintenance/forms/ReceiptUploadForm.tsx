
import React, { useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { OptimizedDocumentUpload } from '../../ui/optimized-document-upload';
import { useMaintenanceReceipts } from '../../../hooks/useMaintenanceReceipts';

interface ReceiptUploadFormProps {
  maintenanceId?: string;
  receiptUrls: string[];
  onReceiptUrlsChange: (urls: string[]) => void;
}

const ReceiptUploadForm = ({
  maintenanceId,
  receiptUrls,
  onReceiptUrlsChange
}: ReceiptUploadFormProps) => {
  const { receipts, uploading, fetchReceipts, uploadReceipt, removeReceipt } = useMaintenanceReceipts(maintenanceId);

  useEffect(() => {
    if (maintenanceId) {
      fetchReceipts();
    }
  }, [maintenanceId, fetchReceipts]);

  // Sincronizar com o estado do formulário
  useEffect(() => {
    const urls = receipts.map(receipt => receipt.url);
    if (JSON.stringify(urls) !== JSON.stringify(receiptUrls)) {
      onReceiptUrlsChange(urls);
    }
  }, [receipts, receiptUrls, onReceiptUrlsChange]);

  const handleUpload = async (file: File) => {
    const url = await uploadReceipt(file);
    return url ? { id: `temp-${Date.now()}`, url, uploaded_at: new Date().toISOString() } : null;
  };

  const handleRemove = async (receiptId: string) => {
    await removeReceipt(receiptId);
  };

  // Se temos maintenanceId, usar o sistema otimizado
  if (maintenanceId) {
    return (
      <div className="space-y-2">
        <Label>Recibos e Comprovantes</Label>
        <OptimizedDocumentUpload
          title="Recibos de Manutenção"
          description="Upload dos recibos e comprovantes da manutenção"
          documents={receipts}
          onUpload={handleUpload}
          onRemove={handleRemove}
          accept=".pdf,.jpg,.jpeg,.png"
          maxFiles={10}
          uploading={uploading}
        />
      </div>
    );
  }

  // Fallback para quando não temos maintenanceId (nova manutenção)
  return (
    <div className="space-y-2">
      <Label>Recibos e Comprovantes</Label>
      <div className="border-2 border-dashed border-gray-300 p-6 text-center rounded-lg bg-slate-50">
        <p className="text-sm text-gray-600">
          Salve a manutenção primeiro para poder fazer upload de recibos
        </p>
        {receiptUrls.length > 0 && (
          <div className="text-sm text-gray-600 mt-2">
            {receiptUrls.length} arquivo(s) será(ão) adicionado(s) após salvar
          </div>
        )}
      </div>
    </div>
  );
};

export default ReceiptUploadForm;
