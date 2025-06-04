
import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Copy } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface DescriptionFormProps {
  description: string;
  onDescriptionChange: (value: string) => void;
  generateDescription: () => void;
}

const DescriptionForm = ({ description, onDescriptionChange, generateDescription }: DescriptionFormProps) => {
  const copyDescription = () => {
    navigator.clipboard.writeText(description);
    toast({
      title: 'Copiado!',
      description: 'Descrição copiada para a área de transferência.',
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Descrição para Anúncio</h3>
        <div className="space-x-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={generateDescription}
          >
            Gerar Automática
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={copyDescription}
            disabled={!description}
          >
            <Copy className="h-4 w-4 mr-1" />
            Copiar
          </Button>
        </div>
      </div>
      
      <Textarea
        value={description}
        onChange={(e) => onDescriptionChange(e.target.value)}
        placeholder="Descrição detalhada do veículo, pronta para copiar e colar nos anúncios..."
        className="min-h-32"
      />
    </div>
  );
};

export default DescriptionForm;
