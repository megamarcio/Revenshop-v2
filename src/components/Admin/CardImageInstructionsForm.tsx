
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface CardImageInstructionsFormProps {
  instructions: string;
  onInstructionsChange: (instructions: string) => void;
}

const CardImageInstructionsForm = ({ 
  instructions, 
  onInstructionsChange 
}: CardImageInstructionsFormProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Instruções para Foto do Card</CardTitle>
        <CardDescription>
          Configure o prompt usado para gerar as fotos dos cards dos veículos com IA.
          Use [MARCA], [MODELO], [ANO], [COR] como placeholders que serão substituídos automaticamente.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="card-instructions">Prompt para Foto do Card</Label>
          <Textarea
            id="card-instructions"
            placeholder="Ex: Criar uma imagem profissional e atrativa para o card de um veículo [MARCA] [MODELO] [ANO] [COR]..."
            value={instructions}
            onChange={(e) => onInstructionsChange(e.target.value)}
            rows={6}
            className="mt-2"
          />
        </div>
        
        <div className="text-sm text-muted-foreground space-y-1">
          <p><strong>Placeholders disponíveis:</strong></p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li><code>[MARCA]</code> - Substituído pela marca do veículo</li>
            <li><code>[MODELO]</code> - Substituído pelo modelo do veículo</li>
            <li><code>[ANO]</code> - Substituído pelo ano do veículo</li>
            <li><code>[COR]</code> - Substituído pela cor do veículo</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default CardImageInstructionsForm;
