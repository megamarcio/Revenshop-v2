
import { useState, useEffect } from 'react';
import { User } from '@/types/auth';
import { fetchUserProfile } from '@/services/profileService';
import { signIn as authSignIn, signUp as authSignUp, signOut as authSignOut, onAuthStateChange, getSession } from '@/services/authService';

export type { User } from '@/types/auth';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    const result = await authSignIn(email, password);
    if (!result) {
      setLoading(false);
    }
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

    const handleAuthChange = async (event: string, session: any) => {
      console.log('Auth state changed:', event, session?.user?.id);
      
      if (!mounted) return;
      
      if (event === 'SIGNED_IN' && session?.user) {
        console.log('User signed in, fetching profile:', session.user.id);
        const profile = await fetchUserProfile(session.user.id);
        if (profile && mounted) {
          console.log('Profile loaded successfully:', profile);
          setUser(profile);
        }
        if (mounted) setLoading(false);
      } else if (event === 'SIGNED_OUT') {
        if (mounted) {
          console.log('User signed out');
          setUser(null);
          setLoading(false);
        }
      }
    };

    const { data: { subscription } } = onAuthStateChange(handleAuthChange);

    // Check initial session
    const checkInitialSession = async () => {
      try {
        console.log('Checking initial session...');
        const { data: { session }, error } = await getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          if (mounted) setLoading(false);
          return;
        }
        
        if (session?.user && mounted) {
          console.log('Initial session found, fetching profile:', session.user.id);
          const profile = await fetchUserProfile(session.user.id);
          if (profile && mounted) {
            console.log('Initial profile loaded:', profile);
            setUser(profile);
          }
        }
        
        if (mounted) {
          console.log('Initial check complete');
          setLoading(false);
        }
      } catch (error) {
        console.error('Error in checkInitialSession:', error);
        if (mounted) setLoading(false);
      }
    };

    checkInitialSession();

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
