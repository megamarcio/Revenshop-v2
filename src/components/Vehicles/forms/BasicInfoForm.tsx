
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLanguage } from '../../../contexts/LanguageContext';
import { VehicleFormData } from '../types/vehicleFormTypes';
import ColorSelector from './ColorSelector';
import ConditionReportSelector from './ConditionReportSelector';
import TitleStatusSelector from './TitleStatusSelector';
import TitleTypeSelector from './TitleTypeSelector';

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
  const { t } = useLanguage();

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">{t('vehicleName')} *</Label>
          <Input 
            id="name" 
            value={formData.name} 
            onChange={e => onInputChange('name', e.target.value)} 
            className={errors.name ? 'border-red-500' : ''} 
          />
          {errors.name && <span className="text-red-500 text-sm">{errors.name}</span>}
        </div>

        <div>
          <Label htmlFor="vin">VIN *</Label>
          <Input 
            id="vin" 
            value={formData.vin} 
            onChange={e => onInputChange('vin', e.target.value)} 
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
            onChange={e => onInputChange('year', e.target.value)} 
            className={errors.year ? 'border-red-500' : ''} 
          />
          {errors.year && <span className="text-red-500 text-sm">{errors.year}</span>}
        </div>

        <div>
          <Label htmlFor="model">{t('model')} *</Label>
          <Input 
            id="model" 
            value={formData.model} 
            onChange={e => onInputChange('model', e.target.value)} 
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
            onChange={e => onInputChange('miles', e.target.value)} 
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
            onChange={e => onInputChange('internalCode', e.target.value)} 
            className={errors.internalCode ? 'border-red-500' : ''} 
            placeholder="Ex: 25001"
          />
          {errors.internalCode && <span className="text-red-500 text-sm">{errors.internalCode}</span>}
        </div>

        <ColorSelector
          value={formData.color}
          onChange={(value) => onInputChange('color', value)}
          error={errors.color}
        />

        <ConditionReportSelector
          value={formData.caNote}
          onChange={(value) => onInputChange('caNote', value)}
          error={errors.caNote}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TitleTypeSelector
          value={formData.titleType || 'clean-title'}
          onChange={(value) => onInputChange('titleType', value)}
          error={errors.titleType}
        />

        <TitleStatusSelector
          value={formData.titleStatus || 'em-maos'}
          onChange={(value) => onInputChange('titleStatus', value)}
          error={errors.titleStatus}
        />
      </div>
    </div>
  );
};

export default BasicInfoForm;
