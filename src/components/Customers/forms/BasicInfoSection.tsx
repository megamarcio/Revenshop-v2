
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '../../../contexts/LanguageContext';
import ImageUpload from '../../ui/image-upload';

interface BasicInfoSectionProps {
  formData: {
    name: string;
    email: string;
    phone: string;
    address: string;
    social_security_type: string;
    social_security_number: string;
    document_photo: string;
  };
  onInputChange: (field: string, value: string | number) => void;
}

export const BasicInfoSection = ({ formData, onInputChange }: BasicInfoSectionProps) => {
  const { t } = useLanguage();

  return (
    <>
      {/* Basic Info */}
      <div className="space-y-4">
        <h3 className="font-semibold text-lg border-b pb-2">Informações Básicas</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">{t('customerName')} *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => onInputChange('name', e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="phone">{t('customerPhone')} *</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => onInputChange('phone', e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="email">{t('customerEmail')}</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => onInputChange('email', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="address">{t('customerAddress')}</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => onInputChange('address', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Document Info */}
      <div className="space-y-4">
        <h3 className="font-semibold text-lg border-b pb-2">Documentação</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="social_security_type">{t('socialSecurityType')}</Label>
            <Select value={formData.social_security_type} onValueChange={(value) => onInputChange('social_security_type', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ssn">{t('ssn')}</SelectItem>
                <SelectItem value="passport">{t('passport')}</SelectItem>
                <SelectItem value="drivers_license">Driver's License</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="social_security_number">{t('socialSecurityNumber')}</Label>
            <Input
              id="social_security_number"
              value={formData.social_security_number}
              onChange={(e) => onInputChange('social_security_number', e.target.value)}
            />
          </div>
          <div>
            <Label>Foto do Documento</Label>
            <ImageUpload
              value={formData.document_photo}
              onChange={(value) => onInputChange('document_photo', value)}
              size="sm"
            />
          </div>
        </div>
      </div>
    </>
  );
};
