
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface BasicInfoFormProps {
  formData: {
    name: string;
    vin: string;
    year: string;
    model: string;
    plate: string;
    internalCode: string;
    color: string;
    caNote: string;
  };
  errors: Record<string, string>;
  onInputChange: (field: string, value: string) => void;
}

const BasicInfoForm = ({ formData, errors, onInputChange }: BasicInfoFormProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nome do Veículo *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => onInputChange('name', e.target.value)}
          placeholder="Ex: Honda Civic EXL 2.0"
          className={errors.name ? 'border-red-500' : ''}
        />
        {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="vin">VIN (Número de Chassi) *</Label>
        <Input
          id="vin"
          value={formData.vin}
          onChange={(e) => onInputChange('vin', e.target.value)}
          placeholder="Ex: 1HGCV1F30JA123456"
          className={errors.vin ? 'border-red-500' : ''}
        />
        {errors.vin && <p className="text-sm text-red-500">{errors.vin}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="year">Ano *</Label>
        <Input
          id="year"
          type="number"
          value={formData.year}
          onChange={(e) => onInputChange('year', e.target.value)}
          placeholder="Ex: 2020"
          className={errors.year ? 'border-red-500' : ''}
        />
        {errors.year && <p className="text-sm text-red-500">{errors.year}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="model">Modelo *</Label>
        <Input
          id="model"
          value={formData.model}
          onChange={(e) => onInputChange('model', e.target.value)}
          placeholder="Ex: Civic"
          className={errors.model ? 'border-red-500' : ''}
        />
        {errors.model && <p className="text-sm text-red-500">{errors.model}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="plate">Placa *</Label>
        <Input
          id="plate"
          value={formData.plate}
          onChange={(e) => onInputChange('plate', e.target.value)}
          placeholder="Ex: ABC-1234"
          className={errors.plate ? 'border-red-500' : ''}
        />
        {errors.plate && <p className="text-sm text-red-500">{errors.plate}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="internalCode">Código Interno *</Label>
        <Input
          id="internalCode"
          value={formData.internalCode}
          onChange={(e) => onInputChange('internalCode', e.target.value)}
          placeholder="Ex: HC001"
          className={errors.internalCode ? 'border-red-500' : ''}
        />
        {errors.internalCode && <p className="text-sm text-red-500">{errors.internalCode}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="color">Cor *</Label>
        <Input
          id="color"
          value={formData.color}
          onChange={(e) => onInputChange('color', e.target.value)}
          placeholder="Ex: Preto"
          className={errors.color ? 'border-red-500' : ''}
        />
        {errors.color && <p className="text-sm text-red-500">{errors.color}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="caNote">Nota CA (0-50) *</Label>
        <Input
          id="caNote"
          type="number"
          min="0"
          max="50"
          value={formData.caNote}
          onChange={(e) => onInputChange('caNote', e.target.value)}
          placeholder="Ex: 42"
          className={errors.caNote ? 'border-red-500' : ''}
        />
        {errors.caNote && <p className="text-sm text-red-500">{errors.caNote}</p>}
      </div>
    </div>
  );
};

export default BasicInfoForm;
