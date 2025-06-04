
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface AdminFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export const useCreateFirstAdmin = (onAdminCreated: () => void) => {
  const [loading, setLoading] = useState(false);

  const createAdmin = async (formData: AdminFormData) => {
    setLoading(true);

    try {
      console.log('Creating first admin user...');
      
      // Create the user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
          },
        },
      });

      if (authError) {
        console.error('Error creating admin user:', authError);
        throw authError;
      }

      console.log('Auth user created:', authData);

      if (authData.user) {
        // Wait for the trigger to create the profile
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Try to update the profile to admin role
        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            role: 'admin',
          })
          .eq('id', authData.user.id);

        if (updateError) {
          console.error('Error updating profile to admin:', updateError);
          
          // If update failed, try to insert the profile manually
          const { error: insertError } = await supabase
            .from('profiles')
            .insert({
              id: authData.user.id,
              first_name: formData.firstName,
              last_name: formData.lastName,
              email: formData.email,
              role: 'admin',
            });

          if (insertError) {
            console.error('Error inserting admin profile:', insertError);
            throw insertError;
          }
        }

        toast({
          title: 'Sucesso',
          description: 'Primeiro usuário admin criado com sucesso!',
        });

        onAdminCreated();
        return true;
      }

      return false;
    } catch (error: any) {
      console.error('Error in admin creation:', error);
      toast({
        title: 'Erro',
        description: error.message || 'Erro ao criar usuário admin',
        variant: 'destructive',
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    createAdmin,
  };
};
