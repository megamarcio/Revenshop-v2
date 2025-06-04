import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserPlus, Eye, EyeOff } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface CreateFirstAdminButtonProps {
  onAdminCreated: () => void;
}

const CreateFirstAdminButton = ({ onAdminCreated }: CreateFirstAdminButtonProps) => {
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
        setShowForm(false);
      }
    } catch (error: any) {
      console.error('Error in admin creation:', error);
      toast({
        title: 'Erro',
        description: error.message || 'Erro ao criar usuário admin',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="text-center">Criar Primeiro Administrador</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">Nome</Label>
              <Input
                id="firstName"
                type="text"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Sobrenome</Label>
              <Input
                id="lastName"
                type="text"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className="pr-10"
                required
                minLength={6}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              type="submit"
              className="flex-1 bg-revenshop-primary hover:bg-revenshop-primary/90"
              disabled={loading}
            >
              {loading ? 'Criando...' : 'Criar Admin'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowForm(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreateFirstAdminButton;
