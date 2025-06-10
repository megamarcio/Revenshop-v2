
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Copy, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAIGeneration } from '../../hooks/useAIGeneration';

const DescriptionGenerator = () => {
  const [vehicleData, setVehicleData] = useState({
    marca: '',
    modelo: '',
    ano: '',
    cor: '',
    motor: '',
    quilometragem: '',
    equipamentos: ''
  });
  const [generatedDescription, setGeneratedDescription] = useState('');
  const { generateDescription, isLoading } = useAIGeneration();
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
      const description = await generateDescription(vehicleData);
      setGeneratedDescription(description);
      toast({
        title: "Descrição gerada",
        description: "A descrição foi gerada com sucesso!",
      });
    } catch (error) {
      console.error('Error generating description:', error);
      toast({
        title: "Erro",
        description: "Erro ao gerar descrição. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedDescription);
    toast({
      title: "Copiado",
      description: "Descrição copiada para a área de transferência!",
    });
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
              <Label htmlFor="marca">Marca *</Label>
              <Input
                id="marca"
                value={vehicleData.marca}
                onChange={(e) => handleInputChange('marca', e.target.value)}
                placeholder="Ex: Toyota"
              />
            </div>
            <div>
              <Label htmlFor="modelo">Modelo *</Label>
              <Input
                id="modelo"
                value={vehicleData.modelo}
                onChange={(e) => handleInputChange('modelo', e.target.value)}
                placeholder="Ex: Corolla"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="ano">Ano *</Label>
              <Input
                id="ano"
                value={vehicleData.ano}
                onChange={(e) => handleInputChange('ano', e.target.value)}
                placeholder="Ex: 2020"
              />
            </div>
            <div>
              <Label htmlFor="cor">Cor</Label>
              <Input
                id="cor"
                value={vehicleData.cor}
                onChange={(e) => handleInputChange('cor', e.target.value)}
                placeholder="Ex: Prata"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="motor">Motor</Label>
              <Input
                id="motor"
                value={vehicleData.motor}
                onChange={(e) => handleInputChange('motor', e.target.value)}
                placeholder="Ex: 2.0 Flex"
              />
            </div>
            <div>
              <Label htmlFor="quilometragem">Quilometragem</Label>
              <Input
                id="quilometragem"
                value={vehicleData.quilometragem}
                onChange={(e) => handleInputChange('quilometragem', e.target.value)}
                placeholder="Ex: 50.000 km"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="equipamentos">Equipamentos/Opcionais</Label>
            <Textarea
              id="equipamentos"
              value={vehicleData.equipamentos}
              onChange={(e) => handleInputChange('equipamentos', e.target.value)}
              placeholder="Ex: Ar condicionado, direção hidráulica, vidros elétricos..."
              rows={3}
            />
          </div>

          <Button onClick={handleGenerate} disabled={isLoading} className="w-full">
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Gerando descrição...
              </>
            ) : (
              'Gerar Descrição com IA'
            )}
          </Button>
        </CardContent>
      </Card>

      {generatedDescription && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Descrição Gerada
            </CardTitle>
            <Button variant="outline" size="sm" onClick={copyToClipboard}>
              <Copy className="h-4 w-4 mr-2" />
              Copiar
            </Button>
          </CardHeader>
          <CardContent>
            <Textarea
              value={generatedDescription}
              onChange={(e) => setGeneratedDescription(e.target.value)}
              rows={8}
              className="w-full"
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DescriptionGenerator;
