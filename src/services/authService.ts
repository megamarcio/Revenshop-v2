
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const signIn = async (email: string, password: string): Promise<boolean> => {
  try {
    console.log('Attempting to sign in with:', email);
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Sign in error:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao fazer login. Verifique suas credenciais.',
        variant: 'destructive',
      });
      return false;
    }

    console.log('Sign in successful:', data);
    
    toast({
      title: 'Sucesso',
      description: 'Login realizado com sucesso!',
    });
    
    return true;
  } catch (error) {
    console.error('Error signing in:', error);
    toast({
      title: 'Erro',
      description: 'Erro ao fazer login. Verifique suas credenciais.',
      variant: 'destructive',
    });
    return false;
  }
};

export const signUp = async (email: string, password: string, firstName: string, lastName: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
        },
      },
    });

    if (error) throw error;

    toast({
      title: 'Sucesso',
      description: 'Conta criada com sucesso! Verifique seu email.',
    });

    return true;
  } catch (error) {
    console.error('Error signing up:', error);
    toast({
      title: 'Erro',
      description: 'Erro ao criar conta.',
      variant: 'destructive',
    });
    return false;
  }
};

export const signOut = async (): Promise<boolean> => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    
    toast({
      title: 'Sucesso',
      description: 'Logout realizado com sucesso!',
    });
    return true;
  } catch (error) {
    console.error('Error signing out:', error);
    toast({
      title: 'Erro',
      description: 'Erro ao fazer logout.',
      variant: 'destructive',
    });
    return false;
  }
};

export const getSession = async () => {
  return await supabase.auth.getSession();
};

export const onAuthStateChange = (callback: (event: string, session: any) => void) => {
  return supabase.auth.onAuthStateChange(callback);
};
