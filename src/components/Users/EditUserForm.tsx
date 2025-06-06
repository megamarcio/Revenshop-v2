
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { editUserSchema, EditUserFormData, EditUserFormProps } from './EditUserTypes';
import EditUserBasicInfo from './EditUserBasicInfo';
import EditUserRoleSection from './EditUserRoleSection';
import EditUserCommissionSection from './EditUserCommissionSection';

const EditUserForm = ({ user, onSubmit, isLoading = false }: EditUserFormProps) => {
  const { t } = useLanguage();
  const { isAdmin } = useAuth();

  const form = useForm<EditUserFormData>({
    resolver: zodResolver(editUserSchema),
    defaultValues: {
      firstName: user.first_name || '',
      lastName: user.last_name || '',
      email: user.email || '',
      phone: user.phone || '',
      facebook: user.facebook || '',
      role: user.role || 'seller',
      commissionClientReferral: user.commission_client_referral || 0,
      commissionClientBrought: user.commission_client_brought || 0,
      commissionFullSale: user.commission_full_sale || 0
    }
  });

  const handleSubmit = (data: EditUserFormData) => {
    onSubmit(data);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          Editar Usuário
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <EditUserBasicInfo form={form} />
            
            <EditUserRoleSection form={form} isAdmin={isAdmin} />
            
            <EditUserCommissionSection form={form} />

            <Button 
              type="submit" 
              className="w-full bg-revenshop-primary hover:bg-revenshop-primary/90" 
              disabled={isLoading}
            >
              {isLoading ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default EditUserForm;
