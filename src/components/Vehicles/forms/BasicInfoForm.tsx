
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ColorSelector from './ColorSelector';
import VehicleUsageSelector from './VehicleUsageSelector';
import { VehicleFormData } from '../types/vehicleFormTypes';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

interface BasicInfoFormProps {
  formData: VehicleFormData;
  errors: Partial<VehicleFormData>;
  onInputChange: (field: keyof VehicleFormData, value: string) => void;
}

const BasicInfoForm = ({ formData, errors, onInputChange }: BasicInfoFormProps) => {
  const [loadingVpic, setLoadingVpic] = useState(false);

  const handleFetchVpic = async () => {
    if (!formData.vin) {
      toast({
        title: "Erro",
        description: "Informe o VIN antes de buscar dados.",
        variant: "destructive"
      });
      return;
    }

    setLoadingVpic(true);
    const modelYear = formData.year || '';
    try {
      const response = await fetch(
        `https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValuesExtended/${formData.vin}?format=json${modelYear ? `&modelyear=${modelYear}` : ''}`
      );
      const data = await response.json();

      if (!data.Results || !Array.isArray(data.Results) || !data.Results[0]) {
        throw new Error('Resultado inesperado da API. Tente novamente.');
      }

      const result = data.Results[0];
      // Parse model year, make, model, color (color pode não existir direto na API, buscar 'Color' ou 'ExteriorColor')
      const nomeVeiculo = [result.Make, result.Model, result.ModelYear].filter(Boolean).join(' ') || '';
      const ano = result.ModelYear || '';
      const cor = result.Color || result.ExteriorColor || '';

      // Preencher campos do formulário, se vierem dados
      if (nomeVeiculo) onInputChange('name', nomeVeiculo);
      if (ano) onInputChange('year', String(ano));
      if (cor) onInputChange('color', cor);

      if (nomeVeiculo || ano || cor) {
        toast({
          title: "Dados do veículo encontrados",
          description: `${nomeVeiculo ? `Nome: ${nomeVeiculo}` : ''} ${ano ? `Ano: ${ano}` : ''} ${cor ? `Cor: ${cor}` : ''}`,
        });
      } else {
        toast({
          title: "Dados não encontrados",
          description: "Não foi possível encontrar informações para o VIN informado.",
          variant: "destructive"
        });
      }
    } catch (err: any) {
      toast({
        title: "Erro ao buscar dados",
        description: err?.message || "Erro inesperado ao consultar VIN.",
        variant: "destructive"
      });
    } finally {
      setLoadingVpic(false);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Informações Básicas</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Nome do Veículo *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => onInputChange('name', e.target.value)}
            placeholder="Ex: Toyota Corolla 2020"
            className={errors.name ? "border-red-500" : ""}
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>

        <div>
          <Label htmlFor="year">Ano *</Label>
          <Input
            id="year"
            type="number"
            value={formData.year}
            onChange={(e) => onInputChange('year', e.target.value)}
            placeholder="Ex: 2020"
            className={errors.year ? "border-red-500" : ""}
          />
          {errors.year && <p className="text-red-500 text-sm mt-1">{errors.year}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="vin">VIN *</Label>
          <div className="flex items-center gap-2">
            <Input
              id="vin"
              value={formData.vin}
              onChange={(e) => onInputChange('vin', e.target.value)}
              placeholder="Número do chassi"
              className={errors.vin ? "border-red-500" : ""}
            />
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={handleFetchVpic}
              disabled={!formData.vin || loadingVpic}
              title="Buscar dados do veículo pelo VIN"
            >
              {loadingVpic ? "Buscando..." : "Buscar dados do veículo"}
            </Button>
          </div>
          {errors.vin && <p className="text-red-500 text-sm mt-1">{errors.vin}</p>}
        </div>

        <div>
          <Label htmlFor="internalCode">Código Interno</Label>
          <Input
            id="internalCode"
            value={formData.internalCode}
            onChange={(e) => onInputChange('internalCode', e.target.value)}
            placeholder="Código interno do veículo"
          />
        </div>
      </div>

      {/* Tipo do Veículo e Uso do Veículo lado a lado */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="category">Tipo do Veículo</Label>
          <Select
            value={formData.category || ''}
            onValueChange={(value) => onInputChange('category', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o tipo do veículo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="forSale">Pronto para venda</SelectItem>
              <SelectItem value="reserved">Reservado</SelectItem>
              <SelectItem value="sold">Vendido</SelectItem>
              <SelectItem value="consigned">Consignado</SelectItem>
              <SelectItem value="bhph">BHPH</SelectItem>
              <SelectItem value="rentalFleet">Frota de Aluguel</SelectItem>
              <SelectItem value="auction">Leilão</SelectItem>
              <SelectItem value="logistics">Logística/Transportadora</SelectItem>
              <SelectItem value="other">Outro</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <VehicleUsageSelector
          value={formData.vehicleUsage || 'personal'}
          onChange={(value) => onInputChange('vehicleUsage', value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ColorSelector
          value={formData.color}
          onChange={(value) => onInputChange('color', value)}
          error={errors.color}
        />

        <div>
          <Label htmlFor="miles">Milhas</Label>
          <Input
            id="miles"
            type="number"
            value={formData.miles}
            onChange={(e) => onInputChange('miles', e.target.value)}
            placeholder="Ex: 50000"
          />
        </div>
      </div>
    </div>
  );
};

export default BasicInfoForm;

