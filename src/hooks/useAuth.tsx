import { useState, useEffect } from 'react';
import { User } from '@/types/auth';
import { fetchUserProfile } from '@/services/profileService';
import { signIn as authSignIn, signUp as authSignUp, signOut as authSignOut, onAuthStateChange, getSession } from '@/services/authService';
import { supabase } from '@/integrations/supabase/client';

export { User } from '@/types/auth';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    const result = await authSignIn(email, password);
    setLoading(false);
    return result;
  };

  const signUp = async (email: string, password: string, firstName: string, lastName: string) => {
    return await authSignUp(email, password, firstName, lastName);
  };

  const signOut = async () => {
    const result = await authSignOut();
    if (result) setUser(null);
    return result;
  };

  useEffect(() => {
    console.log('Setting up auth state listener');
    let mounted = true;

    // First set up the auth state listener
    const { data: { subscription } } = onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        
        if (!mounted) return;
        
        if (event === 'SIGNED_IN' && session?.user) {
          // Use setTimeout to prevent potential deadlocks with Supabase auth
          setTimeout(async () => {
            if (!mounted) return;
            const profile = await fetchUserProfile(session.user.id);
            if (profile && mounted) {
              console.log('Setting user in onAuthStateChange:', profile);
              setUser(profile);
              setLoading(false);
            }
          }, 0);
        } else if (event === 'SIGNED_OUT') {
          if (mounted) {
            setUser(null);
            setLoading(false);
          }
        }
      }
    );

    // Then check for existing session
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          if (mounted) setLoading(false);
          return;
        }
        
        console.log('Initial session check:', session?.user?.id);
        
        if (session?.user && mounted) {
          const profile = await fetchUserProfile(session.user.id);
          if (profile && mounted) {
            console.log('Setting initial user from session:', profile);
            setUser(profile);
          }
        }
        
        if (mounted) setLoading(false);
      } catch (error) {
        console.error('Error in checkSession:', error);
        if (mounted) setLoading(false);
      }
    };

    checkSession();

    return () => {
      console.log('Cleaning up auth subscription');
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

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
