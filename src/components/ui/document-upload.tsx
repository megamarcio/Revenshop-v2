
import React, { useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, X, FileText } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Document {
  id: string;
  url: string;
  uploaded_at: string;
}

interface DocumentUploadProps {
  title: string;
  description: string;
  documents: Document[];
  onUpload: (url: string) => Promise<any>;
  onRemove: (id: string) => Promise<void>;
  accept?: string;
  maxFiles?: number;
}

export const DocumentUpload: React.FC<DocumentUploadProps> = ({
  title,
  description,
  documents,
  onUpload,
  onRemove,
  accept = ".pdf,.jpg,.jpeg,.png,.doc,.docx",
  maxFiles = 5,
}) => {
  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    if (documents.length + files.length > maxFiles) {
      toast({
        title: 'Limite excedido',
        description: `Máximo de ${maxFiles} arquivos permitido`,
        variant: 'destructive',
      });
      return;
    }

    for (const file of Array.from(files)) {
      try {
        // Simular upload - aqui você integraria com seu serviço de storage
        const url = `https://example.com/uploads/${file.name}`;
        await onUpload(url);
        
        toast({
          title: 'Sucesso',
          description: `${file.name} foi enviado com sucesso`,
        });
      } catch (error) {
        console.error('Error uploading file:', error);
        toast({
          title: 'Erro',
          description: `Erro ao enviar ${file.name}`,
          variant: 'destructive',
        });
      }
    }

    // Reset input
    event.target.value = '';
  }, [documents.length, maxFiles, onUpload]);

  const handleRemove = useCallback(async (document: Document) => {
    try {
      await onRemove(document.id);
      toast({
        title: 'Sucesso',
        description: 'Documento removido com sucesso',
      });
    } catch (error) {
      console.error('Error removing document:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao remover documento',
        variant: 'destructive',
      });
    }
  }, [onRemove]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-center w-full">
          <label
            htmlFor={`upload-${title.replace(/\s+/g, '-').toLowerCase()}`}
            className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="w-8 h-8 mb-4 text-gray-500" />
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">Clique para enviar</span> ou arraste os arquivos
              </p>
              <p className="text-xs text-gray-500">
                Máximo {maxFiles} arquivos ({accept})
              </p>
            </div>
            <input
              id={`upload-${title.replace(/\s+/g, '-').toLowerCase()}`}
              type="file"
              className="hidden"
              multiple
              accept={accept}
              onChange={handleFileUpload}
            />
          </label>
        </div>

        {documents.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Documentos enviados:</h4>
            {documents.map((document) => (
              <div key={document.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-gray-500" />
                  <span className="text-sm truncate">
                    {document.url.split('/').pop() || 'Documento'}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(document.uploaded_at).toLocaleDateString('pt-BR')}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemove(document)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
