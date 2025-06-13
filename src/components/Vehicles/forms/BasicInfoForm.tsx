
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import VehicleCategorySelector from './VehicleCategorySelector';
import ColorSelector from './ColorSelector';
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
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome do Veículo *</Label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => onInputChange('name', e.target.value)}
              className={errors.name ? 'border-red-500' : ''}
              placeholder="Ex: Honda Civic 2020"
              required
            />
            {errors.name && <p className="text-sm text-red-500">Nome é obrigatório</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="model">Modelo *</Label>
            <Input
              id="model"
              type="text"
              value={formData.model}
              onChange={(e) => onInputChange('model', e.target.value)}
              className={errors.model ? 'border-red-500' : ''}
              placeholder="Ex: Civic"
              required
            />
            {errors.model && <p className="text-sm text-red-500">Modelo é obrigatório</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="year">Ano *</Label>
            <Input
              id="year"
              type="number"
              value={formData.year}
              onChange={(e) => onInputChange('year', e.target.value)}
              className={errors.year ? 'border-red-500' : ''}
              placeholder="2020"
              min="1900"
              max="2030"
              required
            />
            {errors.year && <p className="text-sm text-red-500">Ano é obrigatório</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="miles">Milhas *</Label>
            <Input
              id="miles"
              type="number"
              value={formData.miles}
              onChange={(e) => onInputChange('miles', e.target.value)}
              className={errors.miles ? 'border-red-500' : ''}
              placeholder="50000"
              required
            />
            {errors.miles && <p className="text-sm text-red-500">Milhas é obrigatório</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="internalCode">Código Interno *</Label>
            <Input
              id="internalCode"
              type="text"
              value={formData.internalCode}
              onChange={(e) => onInputChange('internalCode', e.target.value)}
              className={errors.internalCode ? 'border-red-500' : ''}
              placeholder="REV-001"
              required
            />
            {errors.internalCode && <p className="text-sm text-red-500">Código interno é obrigatório</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <VehicleCategorySelector
            value={formData.category}
            onChange={(value) => onInputChange('category', value)}
            error={errors.category}
          />

          <ColorSelector
            value={formData.color}
            onChange={(value) => onInputChange('color', value)}
            error={errors.color}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="vin">VIN *</Label>
          <Input
            id="vin"
            type="text"
            value={formData.vin}
            onChange={(e) => onInputChange('vin', e.target.value)}
            className={errors.vin ? 'border-red-500' : ''}
            placeholder="1HGBH41JXMN109186"
            maxLength={17}
            required
          />
          {errors.vin && <p className="text-sm text-red-500">VIN é obrigatório</p>}
        </div>
      </CardContent>
    </Card>
  );
};

export default BasicInfoForm;
