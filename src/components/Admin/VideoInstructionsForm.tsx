
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Video } from 'lucide-react';

interface VideoInstructionsFormProps {
  instructions: string;
  onInstructionsChange: (instructions: string) => void;
}

const VideoInstructionsForm = ({ 
  instructions, 
  onInstructionsChange 
}: VideoInstructionsFormProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Video className="h-5 w-5" />
          Instruções para Criação de Vídeos
        </CardTitle>
        <CardDescription>
          Configure o prompt usado para gerar vídeos dos veículos com Gemini Veo3.
          Use os placeholders abaixo que serão substituídos automaticamente pelos dados do formulário do veículo.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="video-instructions">Prompt para Geração de Vídeos</Label>
          <Textarea
            id="video-instructions"
            placeholder="Ex: Criar um vídeo promocional profissional de 10-15 segundos para o veículo [MARCA] [MODELO] [ANO] na cor [COR]..."
            value={instructions}
            onChange={(e) => onInstructionsChange(e.target.value)}
            rows={8}
            className="mt-2"
          />
        </div>
        
        <div className="text-sm text-muted-foreground space-y-1">
          <p><strong>Placeholders disponíveis (substituídos pelos dados do formulário atual):</strong></p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
            <div>
              <p className="font-semibold mb-2">📋 Informações Básicas:</p>
              <ul className="list-disc list-inside space-y-1 ml-4 text-xs">
                <li><code>[MARCA]</code> - Primeira palavra do nome do veículo</li>
                <li><code>[MODELO]</code> - Restante do nome do veículo</li>
                <li><code>[NOME_COMPLETO]</code> - Nome completo do veículo</li>
                <li><code>[ANO]</code> - Ano do veículo</li>
                <li><code>[COR]</code> - Cor do veículo</li>
                <li><code>[VIN]</code> - Número VIN</li>
                <li><code>[QUILOMETRAGEM]</code> - Milhas/Quilometragem</li>
                <li><code>[MILHAS]</code> - Milhas do veículo</li>
                <li><code>[CODIGO_INTERNO]</code> - Código interno</li>
                <li><code>[CATEGORIA]</code> - Categoria (venda, vendido, etc.)</li>
              </ul>
            </div>

            <div>
              <p className="font-semibold mb-2">💰 Informações Financeiras:</p>
              <ul className="list-disc list-inside space-y-1 ml-4 text-xs">
                <li><code>[PRECO_VENDA]</code> - Preço de venda</li>
              </ul>
            </div>
          </div>

          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-xs text-blue-800">
              <strong>💡 Exemplo de prompt otimizado para Gemini Veo3:</strong><br/>
              "Criar um vídeo promocional profissional de 10-15 segundos para o veículo [MARCA] [MODELO] [ANO] na cor [COR]. O vídeo deve mostrar o veículo em movimento em um ambiente elegante, com rotação de 360 graus destacando todos os ângulos, boa iluminação cinematográfica, fundo moderno de showroom, qualidade 4K, movimentos suaves da câmera, transições elegantes, e foco nas características distintivas do veículo. Estilo: profissional, moderno, premium."
            </p>
          </div>

          <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
            <p className="text-xs text-yellow-800">
              <strong>⚠️ Dicas importantes para o Gemini Veo3:</strong><br/>
              • Especifique a duração (10-15 segundos)<br/>
              • Descreva movimentos de câmera específicos<br/>
              • Mencione qualidade (4K, HD)<br/>
              • Inclua detalhes de iluminação e ambiente<br/>
              • Use termos como "profissional", "cinematográfico", "premium"
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VideoInstructionsForm;
