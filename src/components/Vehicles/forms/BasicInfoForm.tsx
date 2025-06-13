
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import VehicleCategorySelector from './VehicleCategorySelector';
import VehicleUsageSelector from './VehicleUsageSelector';
import ColorSelector from './ColorSelector';
import { VehicleFormData } from '../types/vehicleFormTypes';

interface BasicInfoFormProps {
  formData: VehicleFormData;
  errors: Partial<VehicleFormData>;
  onInputChange: (field: keyof VehicleFormData, value: string) => void;
}

const BasicInfoForm = ({ formData, errors, onInputChange }: BasicInfoFormProps) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nome do Veículo *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => onInputChange('name', e.target.value)}
            placeholder="Ex: Honda Civic 2020"
            className={errors.name ? "border-red-500" : ""}
          />
          {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="vin">VIN *</Label>
          <Input
            id="vin"
            value={formData.vin}
            onChange={(e) => onInputChange('vin', e.target.value)}
            placeholder="Número VIN do veículo"
            className={errors.vin ? "border-red-500" : ""}
          />
          {errors.vin && <p className="text-sm text-red-500">{errors.vin}</p>}
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
            placeholder="2020"
            className={errors.year ? "border-red-500" : ""}
          />
          {errors.year && <p className="text-sm text-red-500">{errors.year}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="model">Modelo *</Label>
          <Input
            id="model"
            value={formData.model}
            onChange={(e) => onInputChange('model', e.target.value)}
            placeholder="Ex: Civic, Corolla"
            className={errors.model ? "border-red-500" : ""}
          />
          {errors.model && <p className="text-sm text-red-500">{errors.model}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="miles">Milhas *</Label>
          <Input
            id="miles"
            type="number"
            value={formData.miles}
            onChange={(e) => onInputChange('miles', e.target.value)}
            placeholder="50000"
            className={errors.miles ? "border-red-500" : ""}
          />
          {errors.miles && <p className="text-sm text-red-500">{errors.miles}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="internalCode">Código Interno *</Label>
          <Input
            id="internalCode"
            value={formData.internalCode}
            onChange={(e) => onInputChange('internalCode', e.target.value)}
            placeholder="Ex: V001"
            className={errors.internalCode ? "border-red-500" : ""}
          />
          {errors.internalCode && <p className="text-sm text-red-500">{errors.internalCode}</p>}
        </div>

        <ColorSelector
          value={formData.color}
          onChange={(value) => onInputChange('color', value)}
          error={errors.color}
        />
      </div>

      <VehicleCategorySelector
        value={formData.category}
        onChange={(value) => onInputChange('category', value)}
        error={errors.category}
      />

      {/* Tipo e Uso do Veículo lado a lado */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <VehicleUsageSelector
          usage={formData.vehicleUsage}
          consignmentStore={formData.consignmentStore}
          onUsageChange={(usage) => onInputChange('vehicleUsage', usage)}
          onConsignmentStoreChange={(store) => onInputChange('consignmentStore', store)}
          error={errors.vehicleUsage}
        />
      </div>
    </div>
  );
};

export default BasicInfoForm;
