
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Copy, CheckCircle, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAIGeneration } from '../../hooks/useAIGeneration';
import { useVehicleSelection } from '../../hooks/useVehicleSelection';

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
  const [selectedVehicleId, setSelectedVehicleId] = useState('');
  const [textLength, setTextLength] = useState('medium');
  const [generatedDescription, setGeneratedDescription] = useState('');
  const { generateDescription, isLoading } = useAIGeneration();
  const { vehicles, isLoading: isLoadingVehicles, refreshVehicles } = useVehicleSelection();
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setVehicleData(prev => ({ ...prev, [field]: value }));
  };

  const handleVehicleSelect = (vehicleId: string) => {
    setSelectedVehicleId(vehicleId);
    const vehicle = vehicles.find(v => v.id === vehicleId);
    if (vehicle) {
      setVehicleData({
        marca: vehicle.marca || '',
        modelo: vehicle.modelo || '',
        ano: vehicle.ano || '',
        cor: vehicle.cor || '',
        motor: vehicle.motor || '',
        quilometragem: vehicle.quilometragem || '',
        equipamentos: vehicle.equipamentos || ''
      });
    }
  };

  const clearForm = () => {
    setSelectedVehicleId('');
    setVehicleData({
      marca: '',
      modelo: '',
      ano: '',
      cor: '',
      motor: '',
      quilometragem: '',
      equipamentos: ''
    });
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
      const description = await generateDescription(vehicleData, { textLength });
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
          <CardTitle className="flex items-center justify-between">
            Informações do Veículo
            <Button variant="outline" size="sm" onClick={refreshVehicles} disabled={isLoadingVehicles}>
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoadingVehicles ? 'animate-spin' : ''}`} />
              Atualizar
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div>
              <Label htmlFor="vehicle-select">Selecionar Veículo Existente</Label>
              <Select value={selectedVehicleId} onValueChange={handleVehicleSelect}>
                <SelectTrigger>
                  <SelectValue placeholder="Escolha um veículo ou preencha manualmente" />
                </SelectTrigger>
                <SelectContent>
                  {vehicles.map((vehicle) => (
                    <SelectItem key={vehicle.id} value={vehicle.id}>
                      {vehicle.marca} {vehicle.modelo} {vehicle.ano} - {vehicle.cor}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedVehicleId && (
                <Button variant="outline" size="sm" onClick={clearForm} className="mt-2">
                  Limpar e preencher manualmente
                </Button>
              )}
            </div>

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

            <div>
              <Label htmlFor="text-length">Tamanho do Texto</Label>
              <Select value={textLength} onValueChange={setTextLength}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="short">Curto (até 100 palavras)</SelectItem>
                  <SelectItem value="medium">Médio (100-200 palavras)</SelectItem>
                  <SelectItem value="long">Longo (200-350 palavras)</SelectItem>
                </SelectContent>
              </Select>
            </div>
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
