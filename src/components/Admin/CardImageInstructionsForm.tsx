
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
          Use os placeholders abaixo que serão substituídos automaticamente pelos dados do veículo.
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
            <li><code>[MARCA]</code> - Substituído pela marca do veículo (primeira palavra do nome)</li>
            <li><code>[MODELO]</code> - Substituído pelo modelo do veículo (restante do nome)</li>
            <li><code>[ANO]</code> - Substituído pelo ano do veículo</li>
            <li><code>[COR]</code> - Substituído pela cor do veículo</li>
            <li><code>[NOME_COMPLETO]</code> - Substituído pelo nome completo do veículo</li>
            <li><code>[QUILOMETRAGEM]</code> - Substituído pela quilometragem do veículo</li>
            <li><code>[VIN]</code> - Substituído pelo VIN do veículo</li>
            <li><code>[CATEGORIA]</code> - Substituído pela categoria do veículo (forSale, sold, etc.)</li>
            <li><code>[PRECO_VENDA]</code> - Substituído pelo preço de venda do veículo</li>
          </ul>
          <p className="mt-2 text-xs text-gray-600">
            <strong>Exemplo:</strong> "Criar uma imagem profissional de showroom para um [MARCA] [MODELO] [ANO] na cor [COR], com iluminação perfeita, fundo neutro, alta qualidade, realista, destaque para o veículo."
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CardImageInstructionsForm;
