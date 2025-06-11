
import React, { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { supabase } from '../../integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useCustomerDocuments } from '@/hooks/useCustomerDocuments';
import { BasicInfoSection } from './forms/BasicInfoSection';
import { EmploymentSection } from './forms/EmploymentSection';
import { DocumentsSection } from './forms/DocumentsSection';
import { ReferencesSection } from './forms/ReferencesSection';
import { BusinessInfoSection } from './forms/BusinessInfoSection';
import { CustomerFormActions } from './forms/CustomerFormActions';

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
  reference1_phone?: string;
  reference2_name?: string;
  reference2_email?: string;
  reference2_phone?: string;
  responsible_seller_id?: string;
  interested_vehicle_id?: string;
  deal_status?: string;
  payment_type?: string;
  monthly_income?: number;
  current_job?: string;
  employer_name?: string;
  employer_phone?: string;
  employment_duration?: string;
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
    reference1_phone: '',
    reference2_name: '',
    reference2_email: '',
    reference2_phone: '',
    responsible_seller_id: '',
    interested_vehicle_id: '',
    deal_status: 'quote',
    payment_type: 'cash',
    monthly_income: 0,
    current_job: '',
    employer_name: '',
    employer_phone: '',
    employment_duration: '',
  });

  const [employmentOpen, setEmploymentOpen] = useState(false);
  const [referencesOpen, setReferencesOpen] = useState(false);
  const [documentsOpen, setDocumentsOpen] = useState(false);

  // Use the document hooks
  const {
    bankStatements,
    paymentDocuments,
    fetchBankStatements,
    fetchPaymentDocuments,
    addBankStatement,
    addPaymentDocument,
    removeBankStatement,
    removePaymentDocument,
  } = useCustomerDocuments(customer?.id);

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
        reference1_phone: customer.reference1_phone || '',
        reference2_name: customer.reference2_name || '',
        reference2_email: customer.reference2_email || '',
        reference2_phone: customer.reference2_phone || '',
        responsible_seller_id: customer.responsible_seller_id || '',
        interested_vehicle_id: customer.interested_vehicle_id || '',
        deal_status: customer.deal_status || 'quote',
        payment_type: customer.payment_type || 'cash',
        monthly_income: customer.monthly_income || 0,
        current_job: customer.current_job || '',
        employer_name: customer.employer_name || '',
        employer_phone: customer.employer_phone || '',
        employment_duration: customer.employment_duration || '',
      });

      // Fetch documents when customer is loaded
      fetchBankStatements();
      fetchPaymentDocuments();
    }
  }, [customer, fetchBankStatements, fetchPaymentDocuments]);

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
        .select('id, name, model, year, sale_price')
        .eq('category', 'forSale')
        .order('year', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const saveCustomerMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      // Clean up UUID fields - convert empty strings to null
      const cleanedData = {
        ...data,
        responsible_seller_id: data.responsible_seller_id || null,
        interested_vehicle_id: data.interested_vehicle_id || null,
      };

      if (customer?.id) {
        const { error } = await supabase
          .from('bhph_customers')
          .update(cleanedData)
          .eq('id', customer.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('bhph_customers')
          .insert([cleanedData]);
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
      console.error('Error saving customer:', error);
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

  const handleInputChange = (field: string, value: string | number) => {
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
            <BasicInfoSection
              formData={formData}
              onInputChange={handleInputChange}
            />

            <EmploymentSection
              formData={formData}
              onInputChange={handleInputChange}
              isOpen={employmentOpen}
              onToggle={setEmploymentOpen}
            />

            <DocumentsSection
              customerId={customer?.id}
              bankStatements={bankStatements}
              paymentDocuments={paymentDocuments}
              onAddBankStatement={addBankStatement}
              onAddPaymentDocument={addPaymentDocument}
              onRemoveBankStatement={removeBankStatement}
              onRemovePaymentDocument={removePaymentDocument}
              isOpen={documentsOpen}
              onToggle={setDocumentsOpen}
            />

            <ReferencesSection
              formData={formData}
              onInputChange={handleInputChange}
              isOpen={referencesOpen}
              onToggle={setReferencesOpen}
            />

            <BusinessInfoSection
              formData={formData}
              onInputChange={handleInputChange}
              sellers={sellers}
              vehicles={vehicles}
            />

            <CustomerFormActions
              onSubmit={handleSubmit}
              onCancel={onCancel}
              isSaving={saveCustomerMutation.isPending}
            />
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerForm;
