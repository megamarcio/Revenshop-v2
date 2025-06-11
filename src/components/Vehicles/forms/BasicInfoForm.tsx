
import React from 'react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ColorSelector from './ColorSelector';
import TitleTypeSelector from './TitleTypeSelector';
import { VehicleFormData } from '../types/vehicleFormTypes';

interface BasicInfoFormProps {
  formData: VehicleFormData;
  errors: Partial<VehicleFormData>;
  onInputChange: (field: keyof VehicleFormData, value: string) => void;
}

const BasicInfoForm = ({ formData, errors, onInputChange }: BasicInfoFormProps) => {
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
            onChange={(e) => onInputChange('name', e.target.value)}
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
            onChange={(e) => onInputChange('vin', e.target.value.toUpperCase())}
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
            onChange={(e) => onInputChange('year', e.target.value)}
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
            onChange={(e) => onInputChange('model', e.target.value)}
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
            onChange={(e) => onInputChange('miles', e.target.value)}
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
            onChange={(e) => onInputChange('internalCode', e.target.value.toUpperCase())}
            className={errors.internalCode ? "border-red-500" : ""}
            placeholder="HC001"
          />
          {errors.internalCode && <p className="text-sm text-red-500">{errors.internalCode}</p>}
        </div>

        <div className="md:col-span-2">
          <ColorSelector
            value={formData.color}
            onChange={(value) => onInputChange('color', value)}
            error={errors.color}
          />
        </div>

        <div className="md:col-span-2">
          <TitleTypeSelector
            value={formData.titleTypeId}
            onChange={(value) => onInputChange('titleTypeId', value)}
            error={errors.titleTypeId}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Informações do Título</label>
          <Input
            type="text"
            value={formData.titleInfo}
            onChange={(e) => onInputChange('titleInfo', e.target.value)}
            placeholder="Informações adicionais sobre o título"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default BasicInfoForm;
