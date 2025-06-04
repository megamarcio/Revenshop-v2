
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown } from 'lucide-react';

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
  const [titleType, setTitleType] = useState(() => {
    if (formData.titleInfo?.includes('clean-title')) return 'clean-title';
    if (formData.titleInfo?.includes('rebuilt')) return 'rebuilt';
    return '';
  });
  
  const [isExpanded, setIsExpanded] = useState(false);

  const handleTitleTypeChange = (value: string) => {
    setTitleType(value);
    setIsExpanded(!!value);
    if (!value) {
      onInputChange('titleInfo', '');
    }
  };

  const handleTitleStatusChange = (status: string) => {
    if (titleType && status) {
      onInputChange('titleInfo', `${titleType}-${status}`);
    }
  };

  const handleMilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow only numbers and limit to 500000
    const numericValue = value.replace(/\D/g, '');
    if (parseInt(numericValue) <= 500000 || numericValue === '') {
      onInputChange('plate', numericValue);
    }
  };

  const handleCaNoteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    // Only allow multiples of 5 between 0 and 50
    if (!isNaN(value) && value >= 0 && value <= 50 && value % 5 === 0) {
      onInputChange('caNote', value.toString());
    } else if (e.target.value === '') {
      onInputChange('caNote', '');
    }
  };

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
          <Label htmlFor="miles">Milhas *</Label>
          <Input
            id="miles"
            type="text"
            value={formData.plate}
            onChange={handleMilesChange}
            placeholder="Ex: 45000"
            max="500000"
            className={errors.plate ? 'border-red-500' : ''}
          />
          {errors.plate && <p className="text-sm text-red-500">{errors.plate}</p>}
          <p className="text-xs text-gray-500">Máximo: 500,000 milhas</p>
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
          <Label htmlFor="caNote">Nota CA (0-50, múltiplos de 5) *</Label>
          <Input
            id="caNote"
            type="number"
            min="0"
            max="50"
            step="5"
            value={formData.caNote}
            onChange={handleCaNoteChange}
            placeholder="Ex: 35"
            className={errors.caNote ? 'border-red-500' : ''}
          />
          {errors.caNote && <p className="text-sm text-red-500">{errors.caNote}</p>}
          <p className="text-xs text-gray-500">Valores permitidos: 0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50</p>
        </div>
      </div>

      {/* Informações do Título - compacto e discreto */}
      <div className="space-y-2">
        <Label className="text-sm text-gray-600">Informações do Título</Label>
        <div className="flex items-center space-x-2">
          <ToggleGroup 
            type="single" 
            value={titleType} 
            onValueChange={handleTitleTypeChange}
            className="justify-start"
          >
            <ToggleGroupItem value="clean-title" className="text-xs px-3 py-1">
              Clean Title
            </ToggleGroupItem>
            <ToggleGroupItem value="rebuilt" className="text-xs px-3 py-1">
              Rebuilt
            </ToggleGroupItem>
          </ToggleGroup>
        </div>

        <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
          <CollapsibleContent className="space-y-2">
            {titleType && (
              <div className="ml-4">
                <Label className="text-xs text-gray-500">Status</Label>
                <ToggleGroup 
                  type="single" 
                  value={formData.titleInfo?.split('-').slice(-2).join('-') || ''}
                  onValueChange={handleTitleStatusChange}
                  className="justify-start"
                >
                  <ToggleGroupItem value="em-maos" className="text-xs px-2 py-1">
                    Em Mãos
                  </ToggleGroupItem>
                  <ToggleGroupItem value="em-transito" className="text-xs px-2 py-1">
                    Em Trânsito
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>
            )}
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
};

export default BasicInfoForm;
