
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const useAuthActions = (
  fetchUserProfile: (userId: string) => Promise<any>,
  clearUser: () => void
) => {
  const signIn = async (email: string, password: string) => {
    try {
      console.log('Attempting to sign in with:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Sign in error:', error);
        throw error;
      }

      console.log('Sign in successful:', data);

      if (data.user) {
        const profile = await fetchUserProfile(data.user.id);
        if (profile) {
          toast({
            title: 'Sucesso',
            description: 'Login realizado com sucesso!',
          });
          return true;
        } else {
          // User exists but no profile - might be during signup process
          console.log('User authenticated but no profile found');
          return true;
        }
      }

      return false;
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

  const signUp = async (email: string, password: string, firstName: string, lastName: string) => {
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

  const signOut = async () => {
    try {
      console.log('Starting sign out process...');
      
      // Clear user state immediately
      console.log('Clearing user state...');
      clearUser();
      
      // Sign out from Supabase
      console.log('Signing out from Supabase...');
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Supabase signOut error:', error);
        // Don't throw here, user state is already cleared
      } else {
        console.log('Supabase signOut successful');
      }
      
      toast({
        title: 'Sucesso',
        description: 'Logout realizado com sucesso!',
      });
      
    } catch (error) {
      console.error('Error during sign out:', error);
      // Still clear the user state even if logout failed
      clearUser();
      toast({
        title: 'Aviso',
        description: 'Sessão finalizada localmente.',
      });
    }
  };

  return {
    signIn,
    signUp,
    signOut,
  };
};
