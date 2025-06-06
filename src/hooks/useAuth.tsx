
import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User } from '@/types/auth';
import { toast } from '@/hooks/use-toast';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const subscriptionRef = useRef<any>(null);

  const fetchUserProfile = useCallback(async (userId: string) => {
    try {
      console.log('Fetching user profile for:', userId);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }
      
      if (data) {
        console.log('User profile fetched:', data);
        setUser(data);
        return data;
      } else {
        console.log('No profile found for user:', userId);
        return null;
      }
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
      return null;
    }
  }, []);

  const clearUser = useCallback(() => {
    setUser(null);
  }, []);

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
      // Check if there's an active session before attempting to sign out
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
      }
      
      // Always clear the user state, even if there was no active session
      clearUser();
      toast({
        title: 'Sucesso',
        description: 'Logout realizado com sucesso!',
      });
    } catch (error) {
      console.error('Error signing out:', error);
      // Still clear the user state even if logout failed
      clearUser();
      toast({
        title: 'Erro',
        description: 'Erro ao fazer logout.',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    console.log('Setting up auth state listener');
    
    if (subscriptionRef.current) {
      subscriptionRef.current.unsubscribe();
    }
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        
        if (session?.user) {
          setTimeout(() => {
            fetchUserProfile(session.user.id);
          }, 0);
        } else {
          clearUser();
        }
        setLoading(false);
      }
    );

    subscriptionRef.current = subscription;

    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session:', session?.user?.id);
      if (session?.user) {
        fetchUserProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    return () => {
      console.log('Cleaning up auth subscription');
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
      }
    };
  }, []);

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin';
  const isManager = user?.role === 'manager';
  const isInternalSeller = user?.role === 'internal_seller';
  const isSeller = user?.role === 'seller';
  const canEditVehicles = isAdmin || isManager;
  const canEditCustomers = isAdmin || isManager;
  const canManageUsers = isAdmin || isManager;
  const canAccessAdmin = isAdmin || isManager;
  const canEditBHPHSettings = isAdmin;
  const canViewCostPrices = isAdmin || isManager;
  const canAccessAuctions = isAdmin || isManager || isSeller;
  const canViewAllTasks = isAdmin || isManager;
  const canViewAllCustomers = isAdmin || isManager;
  const canViewBHPHDetails = isAdmin || isManager;
  const canAccessDashboard = isAdmin || isManager || isSeller || isInternalSeller;

  return {
    user,
    loading,
    isAuthenticated,
    isAdmin,
    isManager,
    isInternalSeller,
    isSeller,
    canEditVehicles,
    canEditCustomers,
    canManageUsers,
    canAccessAdmin,
    canEditBHPHSettings,
    canViewCostPrices,
    canAccessAuctions,
    canViewAllTasks,
    canViewAllCustomers,
    canViewBHPHDetails,
    canAccessDashboard,
    signIn,
    signUp,
    signOut,
  };
};
