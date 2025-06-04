
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
    let isProcessing = false;

    const handleAuthChange = async (event: string, session: any) => {
      console.log('Auth state changed:', event, session?.user?.id);
      
      if (!mounted || isProcessing) return;
      
      if (event === 'SIGNED_IN' && session?.user) {
        isProcessing = true;
        try {
          console.log('User signed in, fetching profile:', session.user.id);
          const profile = await fetchUserProfile(session.user.id);
          if (profile && mounted) {
            console.log('Profile loaded successfully:', profile);
            setUser(profile);
          } else if (mounted) {
            console.log('No profile found, user not authenticated');
            setUser(null);
          }
        } catch (error) {
          console.error('Error fetching profile after sign in:', error);
          if (mounted) setUser(null);
        } finally {
          if (mounted) {
            setLoading(false);
            isProcessing = false;
          }
        }
      } else if (event === 'SIGNED_OUT') {
        if (mounted) {
          console.log('User signed out');
          setUser(null);
          setLoading(false);
        }
      }
    };

    const { data: { subscription } } = onAuthStateChange(handleAuthChange);

    // Check initial session only once
    const checkInitialSession = async () => {
      if (isProcessing) return;
      
      try {
        console.log('Checking initial session...');
        const { data: { session }, error } = await getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          if (mounted) setLoading(false);
          return;
        }
        
        if (session?.user && mounted) {
          isProcessing = true;
          console.log('Initial session found, fetching profile:', session.user.id);
          try {
            const profile = await fetchUserProfile(session.user.id);
            if (profile && mounted) {
              console.log('Initial profile loaded:', profile);
              setUser(profile);
            } else if (mounted) {
              console.log('No initial profile found');
              setUser(null);
            }
          } catch (error) {
            console.error('Error fetching initial profile:', error);
            if (mounted) setUser(null);
          } finally {
            if (mounted) {
              setLoading(false);
              isProcessing = false;
            }
          }
        } else {
          if (mounted) {
            console.log('No initial session found');
            setLoading(false);
          }
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
