
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { FileText } from 'lucide-react';

interface DescriptionInstructionsFormProps {
  instructions: string;
  onInstructionsChange: (instructions: string) => void;
}

const DescriptionInstructionsForm = ({ instructions, onInstructionsChange }: DescriptionInstructionsFormProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <FileText className="h-5 w-5" />
          <span>Instruções para Criação de Descrições</span>
        </CardTitle>
        <CardDescription>
          Configure o modelo que a IA usará para criar descrições dos veículos
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Label htmlFor="description-instructions">Modelo para Descrições de Veículos</Label>
          <Textarea
            id="description-instructions"
            placeholder="Digite o modelo que a IA deve seguir para criar descrições..."
            value={instructions}
            onChange={(e) => onInstructionsChange(e.target.value)}
            rows={6}
            className="resize-none"
          />
          <p className="text-xs text-muted-foreground">
            Este modelo será usado como base para gerar descrições atrativas dos veículos
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default DescriptionInstructionsForm;
