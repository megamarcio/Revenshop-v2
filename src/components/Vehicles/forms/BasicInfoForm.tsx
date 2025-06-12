
import React from 'react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ColorSelector from './ColorSelector';
import TitleTypeSelector from './TitleTypeSelector';
import TitleLocationSelector from './TitleLocationSelector';
import VehicleCategorySelector from './VehicleCategorySelector';
import { VehicleFormData } from '../types/vehicleFormTypes';

interface BasicInfoFormProps {
  formData: VehicleFormData;
  errors: Partial<VehicleFormData>;
  onInputChange: (field: keyof VehicleFormData, value: string) => void;
}

const BasicInfoForm = ({
  formData,
  errors,
  onInputChange
}: BasicInfoFormProps) => {
  
  const handleInternalCodeChange = (value: string) => {
    // Remove caracteres não numéricos
    const numericValue = value.replace(/\D/g, '');
    
    // Limitar a 999 (3 dígitos máximo)
    const limitedValue = numericValue.slice(0, 3);
    
    // Converter para número e validar se está entre 1 e 999
    const numValue = parseInt(limitedValue, 10);
    
    if (limitedValue === '' || (numValue >= 1 && numValue <= 999)) {
      // Se for um número válido entre 1-999, formatar com zeros à esquerda para exatamente 3 dígitos
      if (limitedValue && numValue >= 1) {
        const formattedCode = limitedValue.padStart(3, '0');
        onInputChange('internalCode', formattedCode);
      } else {
        onInputChange('internalCode', limitedValue);
      }
    }
    // Se não for válido, não atualiza o campo
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informações Básicas</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Nome do Veículo *</label>
          <Input 
            type="text" 
            value={formData.name} 
            onChange={e => onInputChange('name', e.target.value)} 
            className={errors.name ? "border-red-500" : ""} 
            placeholder="Ex: Honda Civic 2020" 
          />
          {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">VIN *</label>
          <Input 
            type="text" 
            value={formData.vin} 
            onChange={e => onInputChange('vin', e.target.value.toUpperCase())} 
            className={errors.vin ? "border-red-500" : ""} 
            placeholder="1HGBH41JXMN109186" 
            maxLength={17} 
          />
          {errors.vin && <p className="text-sm text-red-500">{errors.vin}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Ano *</label>
          <Input 
            type="number" 
            value={formData.year} 
            onChange={e => onInputChange('year', e.target.value)} 
            className={errors.year ? "border-red-500" : ""} 
            placeholder="2020" 
            min="1900" 
            max="2030" 
          />
          {errors.year && <p className="text-sm text-red-500">{errors.year}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Modelo *</label>
          <Input 
            type="text" 
            value={formData.model} 
            onChange={e => onInputChange('model', e.target.value)} 
            className={errors.model ? "border-red-500" : ""} 
            placeholder="Civic" 
          />
          {errors.model && <p className="text-sm text-red-500">{errors.model}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Milhas *</label>
          <Input 
            type="number" 
            value={formData.miles} 
            onChange={e => onInputChange('miles', e.target.value)} 
            className={errors.miles ? "border-red-500" : ""} 
            placeholder="50000" 
            min="0" 
          />
          {errors.miles && <p className="text-sm text-red-500">{errors.miles}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Código Interno *</label>
          <Input 
            type="text" 
            value={formData.internalCode} 
            onChange={e => handleInternalCodeChange(e.target.value)} 
            className={errors.internalCode ? "border-red-500" : ""} 
            placeholder="001" 
            maxLength={3}
          />
          {errors.internalCode && <p className="text-sm text-red-500">{errors.internalCode}</p>}
          <p className="text-xs text-gray-500">
            Digite um número de 1 a 999 (será formatado automaticamente com zeros à esquerda)
          </p>
        </div>

        {/* Categoria e Cor lado a lado */}
        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          <VehicleCategorySelector 
            value={formData.category} 
            onChange={value => {
              console.log('BasicInfoForm - category onChange:', value);
              onInputChange('category', value);
            }}
            consignmentStore={formData.consignmentStore}
            onConsignmentStoreChange={value => onInputChange('consignmentStore', value)}
            error={errors.category} 
          />
          
          <ColorSelector 
            value={formData.color} 
            onChange={value => onInputChange('color', value)} 
            error={errors.color} 
          />
        </div>

        <div>
          <TitleTypeSelector 
            value={formData.titleTypeId} 
            onChange={value => onInputChange('titleTypeId', value)} 
            error={errors.titleTypeId} 
          />
        </div>

        <div>
          <TitleLocationSelector 
            value={formData.titleLocationId} 
            customValue={formData.titleLocationCustom} 
            onChange={value => onInputChange('titleLocationId', value)} 
            onCustomChange={value => onInputChange('titleLocationCustom', value)} 
            error={errors.titleLocationId} 
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default BasicInfoForm;
