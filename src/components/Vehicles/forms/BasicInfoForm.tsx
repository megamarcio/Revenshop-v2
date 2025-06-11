
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '../../../contexts/LanguageContext';
import { VehicleFormData } from '../types/vehicleFormTypes';

interface BasicInfoFormProps {
  formData: VehicleFormData;
  errors: Partial<VehicleFormData>;
  onInputChange: (field: keyof VehicleFormData, value: string) => void;
}

const BasicInfoForm = ({ formData, errors, onInputChange }: BasicInfoFormProps) => {
  const { t } = useLanguage();

  const titleOptions = [
    { value: 'clean-title-em-maos', label: 'Clean Title - Em Mãos' },
    { value: 'clean-title-em-transito', label: 'Clean Title - Em Trânsito' },
    { value: 'rebuilt-em-maos', label: 'Rebuilt - Em Mãos' },
    { value: 'rebuilt-em-transito', label: 'Rebuilt - Em Trânsito' },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">{t('basicInfo')}</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">{t('vehicleName')} *</Label>
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
          <Label htmlFor="year">{t('year')} *</Label>
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
          <Label htmlFor="model">{t('model')} *</Label>
          <Input
            id="model"
            value={formData.model}
            onChange={(e) => onInputChange('model', e.target.value)}
            className={errors.model ? 'border-red-500' : ''}
          />
          {errors.model && <span className="text-red-500 text-sm">{errors.model}</span>}
        </div>

        <div>
          <Label htmlFor="miles">Quilometragem (Miles) *</Label>
          <Input
            id="miles"
            type="number"
            value={formData.miles}
            onChange={(e) => onInputChange('miles', e.target.value)}
            className={errors.miles ? 'border-red-500' : ''}
            placeholder="Ex: 50000"
          />
          {errors.miles && <span className="text-red-500 text-sm">{errors.miles}</span>}
        </div>

        <div>
          <Label htmlFor="internalCode">{t('internalCode')} *</Label>
          <Input
            id="internalCode"
            value={formData.internalCode}
            onChange={(e) => onInputChange('internalCode', e.target.value)}
            className={errors.internalCode ? 'border-red-500' : ''}
          />
          {errors.internalCode && <span className="text-red-500 text-sm">{errors.internalCode}</span>}
        </div>

        <div>
          <Label htmlFor="color">{t('color')} *</Label>
          <Input
            id="color"
            value={formData.color}
            onChange={(e) => onInputChange('color', e.target.value)}
            className={errors.color ? 'border-red-500' : ''}
          />
          {errors.color && <span className="text-red-500 text-sm">{errors.color}</span>}
        </div>

        <div>
          <Label htmlFor="caNote">CA Note *</Label>
          <Input
            id="caNote"
            type="number"
            value={formData.caNote}
            onChange={(e) => onInputChange('caNote', e.target.value)}
            className={errors.caNote ? 'border-red-500' : ''}
          />
          {errors.caNote && <span className="text-red-500 text-sm">{errors.caNote}</span>}
        </div>
      </div>

      <div>
        <Label htmlFor="titleInfo">Status do Título</Label>
        <Select value={formData.titleInfo} onValueChange={(value) => onInputChange('titleInfo', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione o status do título" />
          </SelectTrigger>
          <SelectContent>
            {titleOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default BasicInfoForm;
