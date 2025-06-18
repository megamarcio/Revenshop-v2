
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import ColorSelector from './ColorSelector';
import VehicleUsageSelector from './VehicleUsageSelector';
import { VehicleFormData } from '../types/vehicleFormTypes';

interface BasicInfoFormProps {
  formData: VehicleFormData;
  errors: Partial<VehicleFormData>;
  onInputChange: (field: keyof VehicleFormData, value: string) => void;
}

const BasicInfoForm = ({ formData, errors, onInputChange }: BasicInfoFormProps) => {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => currentYear - i);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Informações Básicas</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nome do Veículo *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => onInputChange('name', e.target.value)}
            placeholder="Ex: BMW X5 2023"
            className={errors.name ? 'border-red-500' : ''}
          />
          {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="vin">VIN *</Label>
          <Input
            id="vin"
            value={formData.vin}
            onChange={(e) => onInputChange('vin', e.target.value)}
            placeholder="Ex: 1HGBH41JXMN109186"
            className={errors.vin ? 'border-red-500' : ''}
          />
          {errors.vin && <p className="text-sm text-red-500">{errors.vin}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="year">Ano *</Label>
          <Select
            value={formData.year}
            onValueChange={(value) => onInputChange('year', value)}
          >
            <SelectTrigger className={errors.year ? 'border-red-500' : ''}>
              <SelectValue placeholder="Selecione o ano" />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.year && <p className="text-sm text-red-500">{errors.year}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="model">Modelo *</Label>
          <Input
            id="model"
            value={formData.model}
            onChange={(e) => onInputChange('model', e.target.value)}
            placeholder="Ex: X5 xDrive40i"
            className={errors.model ? 'border-red-500' : ''}
          />
          {errors.model && <p className="text-sm text-red-500">{errors.model}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="miles">Milhagem *</Label>
          <Input
            id="miles"
            type="number"
            value={formData.miles}
            onChange={(e) => onInputChange('miles', e.target.value)}
            placeholder="Ex: 50000"
            className={errors.miles ? 'border-red-500' : ''}
          />
          {errors.miles && <p className="text-sm text-red-500">{errors.miles}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="internalCode">Código Interno *</Label>
          <Input
            id="internalCode"
            value={formData.internalCode}
            onChange={(e) => onInputChange('internalCode', e.target.value)}
            placeholder="Ex: BMW001"
            className={errors.internalCode ? 'border-red-500' : ''}
          />
          {errors.internalCode && <p className="text-sm text-red-500">{errors.internalCode}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="plate">Placa</Label>
          <Input
            id="plate"
            value={formData.plate}
            onChange={(e) => onInputChange('plate', e.target.value)}
            placeholder="Ex: ABC-1234"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="sunpass">Tag Pedágio</Label>
          <Input
            id="sunpass"
            value={formData.sunpass}
            onChange={(e) => onInputChange('sunpass', e.target.value)}
            placeholder="Ex: 123456789"
          />
        </div>

        <ColorSelector
          value={formData.color}
          onChange={(value) => onInputChange('color', value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <VehicleUsageSelector
          value={formData.vehicleUsage}
          onChange={(value) => onInputChange('vehicleUsage', value)}
        />

        {formData.vehicleUsage === 'consigned' && (
          <div className="space-y-2">
            <Label htmlFor="consignmentStore">Loja de Consignação</Label>
            <Input
              id="consignmentStore"
              value={formData.consignmentStore}
              onChange={(e) => onInputChange('consignmentStore', e.target.value)}
              placeholder="Nome da loja"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default BasicInfoForm;
