
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useLanguage } from '../../../contexts/LanguageContext';

interface ReferencesSectionProps {
  formData: {
    reference1_name: string;
    reference1_email: string;
    reference1_phone: string;
    reference2_name: string;
    reference2_email: string;
    reference2_phone: string;
  };
  onInputChange: (field: string, value: string | number) => void;
  isOpen: boolean;
  onToggle: (open: boolean) => void;
}

export const ReferencesSection = ({ formData, onInputChange, isOpen, onToggle }: ReferencesSectionProps) => {
  const { t } = useLanguage();

  return (
    <Collapsible open={isOpen} onOpenChange={onToggle}>
      <CollapsibleTrigger asChild>
        <Button variant="outline" className="w-full justify-between">
          <span className="font-semibold text-lg">Referências Pessoais</span>
          <span>{isOpen ? '−' : '+'}</span>
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-6 mt-4">
        {/* Reference 1 */}
        <div className="space-y-4">
          <h4 className="font-medium text-md border-b pb-2">{t('reference1')}</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="reference1_name">{t('referenceName')}</Label>
              <Input
                id="reference1_name"
                value={formData.reference1_name}
                onChange={(e) => onInputChange('reference1_name', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="reference1_email">{t('referenceEmail')}</Label>
              <Input
                id="reference1_email"
                type="email"
                value={formData.reference1_email}
                onChange={(e) => onInputChange('reference1_email', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="reference1_phone">{t('referencePhone')}</Label>
              <Input
                id="reference1_phone"
                value={formData.reference1_phone}
                onChange={(e) => onInputChange('reference1_phone', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Reference 2 */}
        <div className="space-y-4">
          <h4 className="font-medium text-md border-b pb-2">{t('reference2')}</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="reference2_name">{t('referenceName')}</Label>
              <Input
                id="reference2_name"
                value={formData.reference2_name}
                onChange={(e) => onInputChange('reference2_name', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="reference2_email">{t('referenceEmail')}</Label>
              <Input
                id="reference2_email"
                type="email"
                value={formData.reference2_email}
                onChange={(e) => onInputChange('reference2_email', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="reference2_phone">{t('referencePhone')}</Label>
              <Input
                id="reference2_phone"
                value={formData.reference2_phone}
                onChange={(e) => onInputChange('reference2_phone', e.target.value)}
              />
            </div>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};
