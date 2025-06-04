
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, X, File } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MultipleFileUploadProps {
  value?: string[];
  onChange: (value: string[]) => void;
  accept?: string;
  maxFiles?: number;
  className?: string;
  title: string;
  description?: string;
}

const MultipleFileUpload: React.FC<MultipleFileUploadProps> = ({
  value = [],
  onChange,
  accept = "image/*,.pdf,.doc,.docx",
  maxFiles = 5,
  className,
  title,
  description
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    if (value.length + files.length > maxFiles) {
      alert(`Máximo de ${maxFiles} arquivos permitidos.`);
      return;
    }

    setIsLoading(true);

    const processFiles = async () => {
      const newFiles: string[] = [];
      
      for (const file of files) {
        // Validate file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
          alert(`O arquivo ${file.name} é muito grande. Máximo 10MB por arquivo.`);
          continue;
        }

        // Convert to base64 for demo purposes
        const reader = new FileReader();
        const fileData = await new Promise<string>((resolve, reject) => {
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });

        newFiles.push(fileData);
      }

      onChange([...value, ...newFiles]);
      setIsLoading(false);
    };

    processFiles().catch(() => {
      alert('Erro ao carregar os arquivos.');
      setIsLoading(false);
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveFile = (index: number) => {
    const newFiles = value.filter((_, i) => i !== index);
    onChange(newFiles);
  };

  return (
    <div className={cn('space-y-4', className)}>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {title}
        </label>
        {description && (
          <p className="text-sm text-gray-500 mb-3">{description}</p>
        )}
        
        <Button
          type="button"
          variant="outline"
          onClick={handleUploadClick}
          disabled={isLoading || value.length >= maxFiles}
          className="w-full"
        >
          <Upload className="h-4 w-4 mr-2" />
          {isLoading ? 'Carregando...' : `Adicionar Arquivos (${value.length}/${maxFiles})`}
        </Button>
      </div>

      {value.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">Arquivos carregados:</p>
          {value.map((file, index) => (
            <div key={index} className="flex items-center justify-between p-2 border rounded-md bg-gray-50">
              <div className="flex items-center space-x-2">
                <File className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-700">
                  Arquivo {index + 1}
                </span>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => handleRemoveFile(index)}
                className="h-6 w-6 p-0"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        multiple
        className="hidden"
      />
    </div>
  );
};

export default MultipleFileUpload;
