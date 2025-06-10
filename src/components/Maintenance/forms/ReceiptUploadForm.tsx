
import React from 'react';
import { Label } from '@/components/ui/label';
import { Upload } from 'lucide-react';

interface ReceiptUploadFormProps {
  receiptUrls: string[];
  onReceiptUrlsChange: (urls: string[]) => void;
}

const ReceiptUploadForm = ({ receiptUrls, onReceiptUrlsChange }: ReceiptUploadFormProps) => {
  return (
    <div className="space-y-2">
      <Label>Recibos e Comprovantes</Label>
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
        <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
        <p className="text-sm text-gray-600">
          Clique para fazer upload ou arraste os arquivos aqui
        </p>
        <p className="text-xs text-gray-400 mt-1">
          PDF, JPG, PNG até 10MB cada
        </p>
      </div>
      {receiptUrls.length > 0 && (
        <div className="text-sm text-gray-600">
          {receiptUrls.length} arquivo(s) anexado(s)
        </div>
      )}
    </div>
  );
};

export default ReceiptUploadForm;
