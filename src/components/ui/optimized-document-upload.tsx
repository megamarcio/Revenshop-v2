
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, X, FileText, Image, Loader2, Eye } from 'lucide-react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

interface Document {
  id: string;
  url: string;
  uploaded_at: string;
}

interface OptimizedDocumentUploadProps {
  title: string;
  description: string;
  documents: Document[];
  onUpload: (file: File) => Promise<any>;
  onRemove: (id: string) => Promise<void>;
  accept: string;
  maxFiles: number;
  uploading?: boolean;
}

export const OptimizedDocumentUpload: React.FC<OptimizedDocumentUploadProps> = ({
  title,
  description,
  documents,
  onUpload,
  onRemove,
  accept,
  maxFiles,
  uploading = false
}) => {
  const [dragOver, setDragOver] = useState(false);

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || documents.length >= maxFiles) return;

    const maxNewFiles = Math.min(files.length, maxFiles - documents.length);
    const fileArray = Array.from(files).slice(0, maxNewFiles);
    
    for (const file of fileArray) {
      await onUpload(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFileUpload(e.dataTransfer.files);
  };

  const getFileIcon = (url: string) => {
    const extension = url.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png'].includes(extension || '')) {
      return <Image className="h-4 w-4" />;
    }
    return <FileText className="h-4 w-4" />;
  };

  const getFileName = (url: string) => {
    return url.split('/').pop() || 'Documento';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const isImage = (url: string) => {
    const extension = url.split('.').pop()?.toLowerCase();
    return ['jpg', 'jpeg', 'png'].includes(extension || '');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Upload Area */}
        {documents.length < maxFiles && !uploading && (
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
              dragOver ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary'
            }`}
            onDrop={handleDrop}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
          >
            <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
            <p className="text-sm text-gray-600 mb-2">
              Clique para fazer upload ou arraste os arquivos aqui
            </p>
            <p className="text-xs text-gray-400 mb-4">
              {accept.replace(/\./g, '').toUpperCase()} até 10MB cada
            </p>
            <label className="cursor-pointer">
              <Button variant="outline" asChild>
                <span>Selecionar Arquivos</span>
              </Button>
              <input
                type="file"
                multiple
                accept={accept}
                onChange={(e) => handleFileUpload(e.target.files)}
                className="hidden"
              />
            </label>
          </div>
        )}

        {/* Loading State */}
        {uploading && (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <Loader2 className="h-8 w-8 mx-auto mb-2 text-gray-400 animate-spin" />
            <p className="text-sm text-gray-600">Fazendo upload...</p>
          </div>
        )}

        {/* Documents List */}
        {documents.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700">
              Documentos ({documents.length}/{maxFiles})
            </h4>
            {documents.map((document) => (
              <div key={document.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  {getFileIcon(document.url)}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {getFileName(document.url)}
                    </p>
                    <p className="text-xs text-gray-500">
                      Enviado em {formatDate(document.uploaded_at)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {/* Botão de visualização para imagens */}
                  {isImage(document.url) && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Eye className="h-3 w-3" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl w-full">
                        <div className="relative w-full h-[70vh] bg-gray-100 rounded-lg overflow-hidden">
                          <img
                            src={document.url}
                            alt="Documento"
                            className="w-full h-full object-contain"
                          />
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
                  
                  {/* Botão de download/visualização para PDFs */}
                  {!isImage(document.url) && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(document.url, '_blank')}
                    >
                      <Eye className="h-3 w-3" />
                    </Button>
                  )}
                  
                  {/* Botão de remoção */}
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onRemove(document.id)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {documents.length >= maxFiles && (
          <p className="text-sm text-amber-600 text-center">
            Limite máximo de {maxFiles} arquivos atingido
          </p>
        )}
      </CardContent>
    </Card>
  );
};
