
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { VehicleFormData } from '../types/vehicleFormTypes';
import ColorSelector from './ColorSelector';
import VehicleUsageSelector from './VehicleUsageSelector';

interface BasicInfoFormProps {
  formData: VehicleFormData;
  errors: Partial<VehicleFormData>;
  onInputChange: (field: keyof VehicleFormData, value: string) => void;
}

const BasicInfoForm = ({ formData, errors, onInputChange }: BasicInfoFormProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Informações Básicas</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Nome do Veículo *</Label>
          <Input
            id="name"
            type="text"
            value={formData.name}
            onChange={(e) => onInputChange('name', e.target.value)}
            placeholder="Ex: Toyota Camry 2020"
            className={errors.name ? 'border-red-500' : ''}
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>

        <div>
          <Label htmlFor="model">Modelo *</Label>
          <Input
            id="model"
            type="text"
            value={formData.model}
            onChange={(e) => onInputChange('model', e.target.value)}
            placeholder="Ex: Camry"
            className={errors.model ? 'border-red-500' : ''}
          />
          {errors.model && <p className="text-red-500 text-sm mt-1">{errors.model}</p>}
        </div>

        <div>
          <Label htmlFor="year">Ano *</Label>
          <Input
            id="year"
            type="number"
            value={formData.year}
            onChange={(e) => onInputChange('year', e.target.value)}
            placeholder="Ex: 2020"
            min="1900"
            max="2030"
            className={errors.year ? 'border-red-500' : ''}
          />
          {errors.year && <p className="text-red-500 text-sm mt-1">{errors.year}</p>}
        </div>

        <div>
          <Label htmlFor="miles">Milhas *</Label>
          <Input
            id="miles"
            type="number"
            value={formData.miles}
            onChange={(e) => onInputChange('miles', e.target.value)}
            placeholder="Ex: 50000"
            min="0"
            className={errors.miles ? 'border-red-500' : ''}
          />
          {errors.miles && <p className="text-red-500 text-sm mt-1">{errors.miles}</p>}
        </div>

        <div>
          <Label htmlFor="vin">VIN *</Label>
          <Input
            id="vin"
            type="text"
            value={formData.vin}
            onChange={(e) => onInputChange('vin', e.target.value)}
            placeholder="Ex: 1HGBH41JXMN109186"
            maxLength={17}
            className={errors.vin ? 'border-red-500' : ''}
          />
          {errors.vin && <p className="text-red-500 text-sm mt-1">{errors.vin}</p>}
        </div>

        <div>
          <Label htmlFor="internalCode">Código Interno *</Label>
          <Input
            id="internalCode"
            type="text"
            value={formData.internalCode}
            onChange={(e) => onInputChange('internalCode', e.target.value)}
            placeholder="Ex: #001"
            className={errors.internalCode ? 'border-red-500' : ''}
          />
          {errors.internalCode && <p className="text-red-500 text-sm mt-1">{errors.internalCode}</p>}
        </div>

        <div>
          <Label htmlFor="plate">Placa</Label>
          <Input
            id="plate"
            type="text"
            value={formData.plate || ''}
            onChange={(e) => onInputChange('plate', e.target.value)}
            placeholder="Ex: ABC-1234"
            className={errors.plate ? 'border-red-500' : ''}
          />
          {errors.plate && <p className="text-red-500 text-sm mt-1">{errors.plate}</p>}
        </div>

        <div>
          <Label htmlFor="sunpass">Sunpass</Label>
          <Input
            id="sunpass"
            type="text"
            value={formData.sunpass || ''}
            onChange={(e) => onInputChange('sunpass', e.target.value)}
            placeholder="Ex: 123456789"
            className={errors.sunpass ? 'border-red-500' : ''}
          />
          {errors.sunpass && <p className="text-red-500 text-sm mt-1">{errors.sunpass}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ColorSelector
          value={formData.color}
          onChange={(color) => onInputChange('color', color)}
          error={errors.color}
        />

        <VehicleUsageSelector
          value={formData.vehicleUsage}
          onChange={(usage) => onInputChange('vehicleUsage', usage)}
        />
      </div>

      {formData.vehicleUsage === 'consigned' && (
        <div>
          <Label htmlFor="consignmentStore">Loja de Consignação</Label>
          <Input
            id="consignmentStore"
            type="text"
            value={formData.consignmentStore}
            onChange={(e) => onInputChange('consignmentStore', e.target.value)}
            placeholder="Nome da loja onde o veículo está consignado"
          />
        </div>
      )}
    </div>
  );
};

export default BasicInfoForm;
