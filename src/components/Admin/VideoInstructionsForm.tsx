
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
          Use [MARCA], [MODELO], [ANO], [COR], [CATEGORIA] como placeholders que serão substituídos automaticamente.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="video-instructions">Prompt para Geração de Vídeos</Label>
          <Textarea
            id="video-instructions"
            placeholder="Ex: Criar um vídeo promocional profissional para o veículo [MARCA] [MODELO] [ANO] [COR]..."
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
            <li><code>[CATEGORIA]</code> - Substituído pela categoria do veículo</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default VideoInstructionsForm;
