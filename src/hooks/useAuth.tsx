
import { useState, useEffect } from 'react';
import { User } from '@/types/auth';
import { fetchUserProfile } from '@/services/profileService';
import { signIn as authSignIn, signUp as authSignUp, signOut as authSignOut, onAuthStateChange, getSession } from '@/services/authService';
import { supabase } from '@/integrations/supabase/client';

export type { User } from '@/types/auth';

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

  // Helper function to create user from auth session when profile fetch fails
  const createUserFromAuthSession = (authUser: any): User => {
    return {
      id: authUser.id,
      first_name: authUser.user_metadata?.first_name || authUser.raw_user_meta_data?.first_name || 'User',
      last_name: authUser.user_metadata?.last_name || authUser.raw_user_meta_data?.last_name || '',
      email: authUser.email,
      phone: authUser.phone || '',
      role: 'seller', // Default role when we can't fetch from profiles
      photo: authUser.user_metadata?.avatar_url || '',
      facebook: '',
      commission_client_referral: 0,
      commission_client_brought: 0,
      commission_full_sale: 0,
    };
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
            
            try {
              const profile = await fetchUserProfile(session.user.id);
              if (profile && mounted) {
                console.log('Setting user from profile:', profile);
                setUser(profile);
              } else if (mounted) {
                // If we can't fetch profile, create user from auth session
                console.log('Profile fetch failed, creating user from auth session');
                const fallbackUser = createUserFromAuthSession(session.user);
                setUser(fallbackUser);
              }
            } catch (error) {
              console.error('Error fetching profile, using fallback user:', error);
              if (mounted) {
                const fallbackUser = createUserFromAuthSession(session.user);
                setUser(fallbackUser);
              }
            }
            
            if (mounted) {
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
          try {
            const profile = await fetchUserProfile(session.user.id);
            if (profile && mounted) {
              console.log('Setting initial user from profile:', profile);
              setUser(profile);
            } else if (mounted) {
              console.log('Initial profile fetch failed, using fallback user');
              const fallbackUser = createUserFromAuthSession(session.user);
              setUser(fallbackUser);
            }
          } catch (error) {
            console.error('Error in initial profile fetch, using fallback user:', error);
            if (mounted) {
              const fallbackUser = createUserFromAuthSession(session.user);
              setUser(fallbackUser);
            }
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
