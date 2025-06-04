
import React, { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Upload } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { supabase } from '../../integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  social_security_type?: string;
  social_security_number?: string;
  document_photo?: string;
  reference1_name?: string;
  reference1_email?: string;
  reference1_address?: string;
  reference1_phone?: string;
  reference2_name?: string;
  reference2_email?: string;
  reference2_address?: string;
  reference2_phone?: string;
  responsible_seller_id?: string;
  interested_vehicle_id?: string;
  deal_status?: string;
  payment_type?: string;
}

interface CustomerFormProps {
  customer?: Customer | null;
  onSave: () => void;
  onCancel: () => void;
}

const CustomerForm = ({ customer, onSave, onCancel }: CustomerFormProps) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    social_security_type: 'ssn',
    social_security_number: '',
    document_photo: '',
    reference1_name: '',
    reference1_email: '',
    reference1_address: '',
    reference1_phone: '',
    reference2_name: '',
    reference2_email: '',
    reference2_address: '',
    reference2_phone: '',
    responsible_seller_id: '',
    interested_vehicle_id: '',
    deal_status: 'quote',
    payment_type: 'cash',
  });

  useEffect(() => {
    if (customer) {
      setFormData({
        name: customer.name || '',
        email: customer.email || '',
        phone: customer.phone || '',
        address: customer.address || '',
        social_security_type: customer.social_security_type || 'ssn',
        social_security_number: customer.social_security_number || '',
        document_photo: customer.document_photo || '',
        reference1_name: customer.reference1_name || '',
        reference1_email: customer.reference1_email || '',
        reference1_address: customer.reference1_address || '',
        reference1_phone: customer.reference1_phone || '',
        reference2_name: customer.reference2_name || '',
        reference2_email: customer.reference2_email || '',
        reference2_address: customer.reference2_address || '',
        reference2_phone: customer.reference2_phone || '',
        responsible_seller_id: customer.responsible_seller_id || '',
        interested_vehicle_id: customer.interested_vehicle_id || '',
        deal_status: customer.deal_status || 'quote',
        payment_type: customer.payment_type || 'cash',
      });
    }
  }, [customer]);

  // Fetch sellers
  const { data: sellers = [] } = useQuery({
    queryKey: ['sellers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, first_name, last_name')
        .order('first_name');
      if (error) throw error;
      return data;
    },
  });

  // Fetch vehicles
  const { data: vehicles = [] } = useQuery({
    queryKey: ['vehicles-for-customers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vehicles')
        .select('id, name, model, year')
        .eq('category', 'forSale')
        .order('year', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const saveCustomerMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      if (customer?.id) {
        const { error } = await supabase
          .from('bhph_customers')
          .update(data)
          .eq('id', customer.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('bhph_customers')
          .insert([data]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      toast({
        title: t('success'),
        description: customer ? 'Cliente atualizado com sucesso!' : 'Cliente criado com sucesso!',
      });
      onSave();
    },
    onError: (error) => {
      toast({
        title: t('error'),
        description: `Erro ao salvar cliente: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      toast({
        title: t('error'),
        description: 'Nome e telefone são obrigatórios.',
        variant: 'destructive',
      });
      return;
    }
    saveCustomerMutation.mutate(formData);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={onCancel}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <CardTitle>
              {customer ? t('editCustomer') : t('addCustomer')}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">{t('customerName')} *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone">{t('customerPhone')} *</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">{t('customerEmail')}</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="address">{t('customerAddress')}</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                />
              </div>
            </div>

            {/* Document Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="social_security_type">{t('socialSecurityType')}</Label>
                <Select value={formData.social_security_type} onValueChange={(value) => handleInputChange('social_security_type', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ssn">{t('ssn')}</SelectItem>
                    <SelectItem value="passport">{t('passport')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="social_security_number">{t('socialSecurityNumber')}</Label>
                <Input
                  id="social_security_number"
                  value={formData.social_security_number}
                  onChange={(e) => handleInputChange('social_security_number', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="document_photo">{t('documentPhoto')}</Label>
                <Button type="button" variant="outline" className="w-full">
                  <Upload className="h-4 w-4 mr-2" />
                  {t('uploadDocument')}
                </Button>
              </div>
            </div>

            {/* References */}
            <div className="space-y-4">
              <h3 className="font-semibold">{t('reference1')}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="reference1_name">{t('referenceName')}</Label>
                  <Input
                    id="reference1_name"
                    value={formData.reference1_name}
                    onChange={(e) => handleInputChange('reference1_name', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="reference1_phone">{t('referencePhone')}</Label>
                  <Input
                    id="reference1_phone"
                    value={formData.reference1_phone}
                    onChange={(e) => handleInputChange('reference1_phone', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="reference1_email">{t('referenceEmail')}</Label>
                  <Input
                    id="reference1_email"
                    type="email"
                    value={formData.reference1_email}
                    onChange={(e) => handleInputChange('reference1_email', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="reference1_address">{t('referenceAddress')}</Label>
                  <Input
                    id="reference1_address"
                    value={formData.reference1_address}
                    onChange={(e) => handleInputChange('reference1_address', e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">{t('reference2')}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="reference2_name">{t('referenceName')}</Label>
                  <Input
                    id="reference2_name"
                    value={formData.reference2_name}
                    onChange={(e) => handleInputChange('reference2_name', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="reference2_phone">{t('referencePhone')}</Label>
                  <Input
                    id="reference2_phone"
                    value={formData.reference2_phone}
                    onChange={(e) => handleInputChange('reference2_phone', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="reference2_email">{t('referenceEmail')}</Label>
                  <Input
                    id="reference2_email"
                    type="email"
                    value={formData.reference2_email}
                    onChange={(e) => handleInputChange('reference2_email', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="reference2_address">{t('referenceAddress')}</Label>
                  <Input
                    id="reference2_address"
                    value={formData.reference2_address}
                    onChange={(e) => handleInputChange('reference2_address', e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Business Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="responsible_seller_id">{t('responsibleSeller')}</Label>
                <Select value={formData.responsible_seller_id} onValueChange={(value) => handleInputChange('responsible_seller_id', value)}>
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
                <Select value={formData.interested_vehicle_id} onValueChange={(value) => handleInputChange('interested_vehicle_id', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('selectVehicle')} />
                  </SelectTrigger>
                  <SelectContent>
                    {vehicles.map((vehicle) => (
                      <SelectItem key={vehicle.id} value={vehicle.id}>
                        {vehicle.year} {vehicle.name} {vehicle.model}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="deal_status">{t('dealStatus')}</Label>
                <Select value={formData.deal_status} onValueChange={(value) => handleInputChange('deal_status', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="quote">{t('quote')}</SelectItem>
                    <SelectItem value="completed">{t('completedSale')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="payment_type">{t('paymentType')}</Label>
                <Select value={formData.payment_type} onValueChange={(value) => handleInputChange('payment_type', value)}>
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

            <div className="flex space-x-4">
              <Button type="submit" disabled={saveCustomerMutation.isPending}>
                {saveCustomerMutation.isPending ? t('saving') : t('save')}
              </Button>
              <Button type="button" variant="outline" onClick={onCancel}>
                {t('cancel')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerForm;
