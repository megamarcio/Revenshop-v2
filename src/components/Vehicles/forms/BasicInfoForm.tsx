
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import ColorSelector from './ColorSelector';
import VehicleUsageSelector from './VehicleUsageSelector';
import { VehicleFormData } from '../types/vehicleFormTypes';

interface BasicInfoFormProps {
  formData: VehicleFormData;
  errors: Partial<VehicleFormData>;
  onInputChange: (field: keyof VehicleFormData, value: string) => void;
}

const categoryOptions = [
  { value: 'forSale', label: 'Venda' },
  { value: 'rental', label: 'Aluguel' },
  { value: 'consigned', label: 'Consignado' },
  { value: 'testDrive', label: 'Test Drive' },
  { value: 'other', label: 'Outro' },
];

const BasicInfoForm = ({ formData, errors, onInputChange }: BasicInfoFormProps) => {
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
          <Input
            id="vin"
            value={formData.vin}
            onChange={(e) => onInputChange('vin', e.target.value)}
            placeholder="Número do chassi"
            className={errors.vin ? "border-red-500" : ""}
          />
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
      
      {/* LINHA: Tipo de Veículo + Uso do Veículo lado a lado */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="category">Tipo de Veículo</Label>
          <select
            id="category"
            className="border rounded-md px-3 py-2 w-full"
            value={formData.category || 'forSale'}
            onChange={(e) => onInputChange('category', e.target.value)}
          >
            {categoryOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        <VehicleUsageSelector
          value={formData.vehicleUsage || 'personal'}
          onChange={(value) => onInputChange('vehicleUsage', value)}
        />
      </div>
    </div>
  );
};

export default BasicInfoForm;

