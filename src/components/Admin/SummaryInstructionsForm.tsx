import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { FileText } from 'lucide-react';

interface SummaryInstructionsFormProps {
  instructions: string;
  onInstructionsChange: (instructions: string) => void;
}

const SummaryInstructionsForm: React.FC<SummaryInstructionsFormProps> = ({
  instructions,
  onInstructionsChange
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <FileText className="h-5 w-5" />
          <span>Instruções para Resumo de Descrições</span>
        </CardTitle>
        <CardDescription>
          Configure as instruções que a IA usará para resumir descrições financeiras na importação
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="summary-instructions">Instruções para Resumo</Label>
          <Textarea
            id="summary-instructions"
            placeholder="Ex: Resuma esta descrição financeira em até 50 caracteres, mantendo as informações mais importantes..."
            value={instructions}
            onChange={(e) => onInstructionsChange(e.target.value)}
            rows={4}
            className="min-h-[100px]"
          />
          <p className="text-xs text-muted-foreground">
            Estas instruções serão enviadas para a IA junto com cada descrição para gerar um resumo conciso.
            Recomenda-se limitar a 50-60 caracteres para melhor legibilidade.
          </p>
        </div>
        
        <div className="bg-gray-50 p-3 rounded-lg">
          <h4 className="font-medium text-sm mb-2">Exemplo de uso:</h4>
          <div className="text-xs space-y-1">
            <div><strong>Original:</strong> "PAYPAL DES:INST XFER ID:GOOGLE MARCELLO Software Development"</div>
            <div><strong>Resumido:</strong> "Google - Software Development"</div>
          </div>
        </div>

        <div className="bg-blue-50 p-3 rounded-lg">
          <h4 className="font-medium text-sm mb-2">Dicas para boas instruções:</h4>
          <ul className="text-xs space-y-1 list-disc list-inside">
            <li>Especifique o limite de caracteres desejado</li>
            <li>Mencione que informações são mais importantes</li>
            <li>Instrua para remover códigos/IDs desnecessários</li>
            <li>Peça para manter nomes de empresas/pessoas</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default SummaryInstructionsForm; 