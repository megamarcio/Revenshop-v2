
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
    titleInfo?: string;
  };
  errors: Record<string, string>;
  onInputChange: (field: string, value: string) => void;
}

const BasicInfoForm = ({ formData, errors, onInputChange }: BasicInfoFormProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Informações Básicas</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nome do Veículo *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => onInputChange('name', e.target.value)}
            placeholder="Ex: Honda Civic"
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
            placeholder="Ex: CV001"
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
            placeholder="Ex: 35"
            className={errors.caNote ? 'border-red-500' : ''}
          />
          {errors.caNote && <p className="text-sm text-red-500">{errors.caNote}</p>}
        </div>
      </div>

      {/* Informações do Título - seção compacta */}
      <div className="space-y-3 p-3 bg-gray-50 rounded-lg border">
        <h4 className="text-sm font-medium text-gray-900">Informações do Título</h4>
        <div className="space-y-2">
          <Label htmlFor="titleInfo" className="text-sm">Status do Título</Label>
          <Select value={formData.titleInfo || ''} onValueChange={(value) => onInputChange('titleInfo', value)}>
            <SelectTrigger className="h-9">
              <SelectValue placeholder="Selecione o status do título" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="clean-title">Clean Title</SelectItem>
              <SelectItem value="rebuilt">Rebuilt</SelectItem>
              <SelectItem value="clean-title-em-maos">Clean Title - Em Mãos</SelectItem>
              <SelectItem value="clean-title-em-transito">Clean Title - Em trânsito</SelectItem>
              <SelectItem value="rebuilt-em-maos">Rebuilt - Em Mãos</SelectItem>
              <SelectItem value="rebuilt-em-transito">Rebuilt - Em Trânsito</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default BasicInfoForm;
