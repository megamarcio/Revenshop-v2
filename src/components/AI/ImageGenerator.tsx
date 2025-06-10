
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Download, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAIGeneration } from '../../hooks/useAIGeneration';

const ImageGenerator = () => {
  const [vehicleData, setVehicleData] = useState({
    marca: '',
    modelo: '',
    ano: '',
    cor: ''
  });
  const [generatedImage, setGeneratedImage] = useState('');
  const { generateImage, isLoading } = useAIGeneration();
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setVehicleData(prev => ({ ...prev, [field]: value }));
  };

  const handleGenerate = async () => {
    if (!vehicleData.marca || !vehicleData.modelo || !vehicleData.ano) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha ao menos marca, modelo e ano.",
        variant: "destructive",
      });
      return;
    }

    try {
      const imageUrl = await generateImage(vehicleData);
      setGeneratedImage(imageUrl);
      toast({
        title: "Imagem gerada",
        description: "A imagem foi gerada com sucesso!",
      });
    } catch (error) {
      console.error('Error generating image:', error);
      toast({
        title: "Erro",
        description: "Erro ao gerar imagem. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const downloadImage = () => {
    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = `${vehicleData.marca}_${vehicleData.modelo}_${vehicleData.ano}.png`;
    link.click();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Informações do Veículo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="marca-img">Marca *</Label>
              <Input
                id="marca-img"
                value={vehicleData.marca}
                onChange={(e) => handleInputChange('marca', e.target.value)}
                placeholder="Ex: Toyota"
              />
            </div>
            <div>
              <Label htmlFor="modelo-img">Modelo *</Label>
              <Input
                id="modelo-img"
                value={vehicleData.modelo}
                onChange={(e) => handleInputChange('modelo', e.target.value)}
                placeholder="Ex: Corolla"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="ano-img">Ano *</Label>
              <Input
                id="ano-img"
                value={vehicleData.ano}
                onChange={(e) => handleInputChange('ano', e.target.value)}
                placeholder="Ex: 2020"
              />
            </div>
            <div>
              <Label htmlFor="cor-img">Cor</Label>
              <Input
                id="cor-img"
                value={vehicleData.cor}
                onChange={(e) => handleInputChange('cor', e.target.value)}
                placeholder="Ex: Prata"
              />
            </div>
          </div>

          <Button onClick={handleGenerate} disabled={isLoading} className="w-full">
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Gerando imagem...
              </>
            ) : (
              'Gerar Imagem com IA'
            )}
          </Button>
        </CardContent>
      </Card>

      {generatedImage && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Imagem Gerada
            </CardTitle>
            <Button variant="outline" size="sm" onClick={downloadImage}>
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center">
              <img 
                src={generatedImage} 
                alt="Veículo gerado por IA"
                className="max-w-full h-auto rounded-lg shadow-lg"
              />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ImageGenerator;
