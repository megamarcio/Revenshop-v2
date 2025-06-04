
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useUserProfile } from './useUserProfile';
import { useAuthActions } from './useAuthActions';

export const useAuth = () => {
  const [loading, setLoading] = useState(true);
  const { user, setUser, fetchUserProfile, clearUser } = useUserProfile();
  const { signIn, signUp, signOut } = useAuthActions(fetchUserProfile, clearUser);

  useEffect(() => {
    console.log('Setting up auth state listener');
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        
        if (session?.user) {
          // Use setTimeout to avoid potential auth callback issues
          setTimeout(() => {
            fetchUserProfile(session.user.id);
          }, 0);
        } else {
          clearUser();
        }
        setLoading(false);
      }
    );

    // Get initial session
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
      subscription.unsubscribe();
    };
  }, [fetchUserProfile, clearUser]);

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin';
  const isManager = user?.role === 'manager';
  const canEditVehicles = isAdmin || isManager;
  const canManageUsers = isAdmin || isManager;
  const canAccessAdmin = isAdmin || isManager;
  const canEditBHPHSettings = isAdmin;

  return {
    user,
    loading,
    isAuthenticated,
    isAdmin,
    isManager,
    canEditVehicles,
    canManageUsers,
    canAccessAdmin,
    canEditBHPHSettings,
    signIn,
    signUp,
    signOut,
  };
};
