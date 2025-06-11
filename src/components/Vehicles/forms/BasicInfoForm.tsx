
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import ColorSelector from './ColorSelector';
import { VehicleFormData } from '../types/vehicleFormTypes';

interface BasicInfoFormProps {
  formData: VehicleFormData;
  onInputChange: (field: keyof VehicleFormData, value: string) => void;
  errors: Record<string, string>;
}

const BasicInfoForm = ({ formData, onInputChange, errors }: BasicInfoFormProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div>
        <Label htmlFor="name">Nome do Veículo *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => onInputChange('name', e.target.value)}
          className={errors.name ? 'border-red-500' : ''}
        />
        {errors.name && <span className="text-red-500 text-sm">{errors.name}</span>}
      </div>

      <div>
        <Label htmlFor="vin">VIN *</Label>
        <Input
          id="vin"
          value={formData.vin}
          onChange={(e) => onInputChange('vin', e.target.value)}
          className={errors.vin ? 'border-red-500' : ''}
        />
        {errors.vin && <span className="text-red-500 text-sm">{errors.vin}</span>}
      </div>

      <div>
        <Label htmlFor="year">Ano *</Label>
        <Input
          id="year"
          type="number"
          value={formData.year}
          onChange={(e) => onInputChange('year', e.target.value)}
          className={errors.year ? 'border-red-500' : ''}
        />
        {errors.year && <span className="text-red-500 text-sm">{errors.year}</span>}
      </div>

      <div>
        <Label htmlFor="model">Modelo *</Label>
        <Input
          id="model"
          value={formData.model}
          onChange={(e) => onInputChange('model', e.target.value)}
          className={errors.model ? 'border-red-500' : ''}
        />
        {errors.model && <span className="text-red-500 text-sm">{errors.model}</span>}
      </div>

      <div>
        <Label htmlFor="miles">Milhas *</Label>
        <Input
          id="miles"
          type="number"
          value={formData.miles}
          onChange={(e) => onInputChange('miles', e.target.value)}
          className={errors.miles ? 'border-red-500' : ''}
        />
        {errors.miles && <span className="text-red-500 text-sm">{errors.miles}</span>}
      </div>

      <div>
        <Label htmlFor="internalCode">Código Interno *</Label>
        <Input
          id="internalCode"
          value={formData.internalCode}
          onChange={(e) => onInputChange('internalCode', e.target.value)}
          className={errors.internalCode ? 'border-red-500' : ''}
        />
        {errors.internalCode && <span className="text-red-500 text-sm">{errors.internalCode}</span>}
      </div>

      <ColorSelector
        value={formData.color}
        onChange={(value) => onInputChange('color', value)}
        error={errors.color}
      />

      <div className="md:col-span-2 lg:col-span-3">
        <Label htmlFor="titleInfo">Informações do Título</Label>
        <Input
          id="titleInfo"
          value={formData.titleInfo}
          onChange={(e) => onInputChange('titleInfo', e.target.value)}
          placeholder="Informações adicionais sobre o título"
        />
      </div>
    </div>
  );
};

export default BasicInfoForm;
