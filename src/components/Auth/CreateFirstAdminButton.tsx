
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { UserPlus, Eye, EyeOff } from 'lucide-react';

const firstAdminSchema = z.object({
  firstName: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  lastName: z.string().min(2, 'Sobrenome deve ter pelo menos 2 caracteres'),
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
});

type FirstAdminFormData = z.infer<typeof firstAdminSchema>;

interface CreateFirstAdminButtonProps {
  onAdminCreated: () => void;
}

const CreateFirstAdminButton = ({ onAdminCreated }: CreateFirstAdminButtonProps) => {
  const [showForm, setShowForm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FirstAdminFormData>({
    resolver: zodResolver(firstAdminSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    },
  });

  const handleCreateFirstAdmin = async (data: FirstAdminFormData) => {
    setIsLoading(true);
    
    try {
      // Criar usuário admin
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            first_name: data.firstName,
            last_name: data.lastName,
          },
        },
      });

      if (authError) throw authError;

      if (authData.user) {
        // Atualizar o perfil com role de admin
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            role: 'admin',
          })
          .eq('id', authData.user.id);

        if (profileError) throw profileError;
      }

      toast({
        title: 'Sucesso',
        description: 'Primeiro administrador criado com sucesso!',
      });

      setShowForm(false);
      onAdminCreated();
    } catch (error) {
      console.error('Error creating first admin:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao criar administrador. Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
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
          variant="outline"
          className="w-full"
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Criar Primeiro Administrador
        </Button>
      </div>
    );
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="text-center text-lg">
          Criar Primeiro Administrador
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleCreateFirstAdmin)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="João" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sobrenome</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Silva" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-mail</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" placeholder="admin@exemplo.com" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        className="pr-10"
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
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex space-x-2">
              <Button 
                type="submit" 
                className="flex-1 bg-revenshop-primary hover:bg-revenshop-primary/90" 
                disabled={isLoading}
              >
                {isLoading ? 'Criando...' : 'Criar Admin'}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setShowForm(false)}
                disabled={isLoading}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CreateFirstAdminButton;
