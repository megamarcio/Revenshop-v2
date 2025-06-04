
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';
import { useCreateFirstAdmin } from '@/hooks/useCreateFirstAdmin';
import AdminCreationForm from './AdminCreationForm';

interface CreateFirstAdminButtonProps {
  onAdminCreated: () => void;
}

const CreateFirstAdminButton = ({ onAdminCreated }: CreateFirstAdminButtonProps) => {
  const [showForm, setShowForm] = useState(false);
  const { loading, createAdmin } = useCreateFirstAdmin(onAdminCreated);

  const handleFormSubmit = async (formData: any) => {
    const success = await createAdmin(formData);
    if (success) {
      setShowForm(false);
    }
  };

  if (!showForm) {
    return (
      <div className="text-center mt-6">
        <p className="text-sm text-gray-600 mb-4">
          Nenhum usuário encontrado no sistema
        </p>
        <Button
          onClick={() => setShowForm(true)}
          className="bg-revenshop-primary hover:bg-revenshop-primary/90"
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Criar Primeiro Admin
        </Button>
      </div>
    );
  }

  return (
    <AdminCreationForm
      onSubmit={handleFormSubmit}
      onCancel={() => setShowForm(false)}
      loading={loading}
    />
  );
};

export default CreateFirstAdminButton;
