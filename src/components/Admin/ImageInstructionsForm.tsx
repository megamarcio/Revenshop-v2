
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Image } from 'lucide-react';

interface ImageInstructionsFormProps {
  instructions: string;
  onInstructionsChange: (instructions: string) => void;
}

const ImageInstructionsForm = ({ instructions, onInstructionsChange }: ImageInstructionsFormProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Image className="h-5 w-5" />
          <span>Instruções para Criação de Imagens</span>
        </CardTitle>
        <CardDescription>
          Configure as instruções que serão enviadas para a IA gerar imagens dos veículos
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Label htmlFor="image-instructions">Prompt para Geração de Imagens</Label>
          <Textarea
            id="image-instructions"
            placeholder="Digite as instruções para a IA gerar imagens dos veículos..."
            value={instructions}
            onChange={(e) => onInstructionsChange(e.target.value)}
            rows={6}
            className="resize-none"
          />
          <p className="text-xs text-muted-foreground">
            Use [MODELO], [ANO], [COR] como variáveis que serão substituídas automaticamente
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ImageInstructionsForm;
