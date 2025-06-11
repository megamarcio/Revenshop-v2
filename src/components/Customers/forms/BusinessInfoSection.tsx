
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '../../../contexts/LanguageContext';

interface BusinessInfoSectionProps {
  formData: {
    responsible_seller_id: string;
    interested_vehicle_id: string;
    deal_status: string;
    payment_type: string;
  };
  onInputChange: (field: string, value: string | number) => void;
  sellers: Array<{ id: string; first_name: string; last_name: string; }>;
  vehicles: Array<{ id: string; name: string; model: string; year: number; sale_price?: number; }>;
}

export const BusinessInfoSection = ({ formData, onInputChange, sellers, vehicles }: BusinessInfoSectionProps) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg border-b pb-2">Informações Comerciais</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="responsible_seller_id">{t('responsibleSeller')}</Label>
          <Select value={formData.responsible_seller_id} onValueChange={(value) => onInputChange('responsible_seller_id', value)}>
            <SelectTrigger>
              <SelectValue placeholder={t('selectSeller')} />
            </SelectTrigger>
            <SelectContent>
              {sellers.map((seller) => (
                <SelectItem key={seller.id} value={seller.id}>
                  {seller.first_name} {seller.last_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="interested_vehicle_id">{t('interestedVehicle')}</Label>
          <Select value={formData.interested_vehicle_id} onValueChange={(value) => onInputChange('interested_vehicle_id', value)}>
            <SelectTrigger>
              <SelectValue placeholder={t('selectVehicle')} />
            </SelectTrigger>
            <SelectContent>
              {vehicles.map((vehicle) => (
                <SelectItem key={vehicle.id} value={vehicle.id}>
                  {vehicle.year} {vehicle.name} {vehicle.model} - R$ {vehicle.sale_price?.toLocaleString()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="deal_status">{t('dealStatus')}</Label>
          <Select value={formData.deal_status} onValueChange={(value) => onInputChange('deal_status', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="quote">{t('quote')}</SelectItem>
              <SelectItem value="pending">Venda Pendente</SelectItem>
              <SelectItem value="completed">{t('completedSale')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="payment_type">{t('paymentType')}</Label>
          <Select value={formData.payment_type} onValueChange={(value) => onInputChange('payment_type', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cash">{t('cash')}</SelectItem>
              <SelectItem value="financing">{t('financing')}</SelectItem>
              <SelectItem value="bhph">{t('bhph')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
