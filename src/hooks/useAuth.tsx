
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

    const { data: { subscription } } = onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        
        if (!mounted) return;
        
        if (event === 'SIGNED_IN' && session?.user) {
          try {
            console.log('Fetching user profile for signed in user:', session.user.id);
            const profile = await fetchUserProfile(session.user.id);
            if (profile && mounted) {
              console.log('Successfully loaded profile for signed in user:', profile);
              setUser(profile);
              setLoading(false);
            } else if (mounted) {
              console.log('Profile not found for signed in user');
              setLoading(false);
            }
          } catch (error) {
            console.error('Error fetching profile for signed in user:', error);
            if (mounted) {
              setLoading(false);
            }
          }
        } else if (event === 'SIGNED_OUT') {
          if (mounted) {
            setUser(null);
            setLoading(false);
          }
        } else if (event === 'INITIAL_SESSION' && session?.user) {
          // Não fazer nada no INITIAL_SESSION para evitar duplicação
          // O checkSession vai lidar com isso
        }
      }
    );

    const checkSession = async () => {
      try {
        console.log('Checking initial session...');
        const { data: { session }, error } = await getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          if (mounted) setLoading(false);
          return;
        }
        
        console.log('Initial session check result:', session?.user?.id || 'No session');
        
        if (session?.user && mounted) {
          try {
            console.log('Fetching initial user profile for:', session.user.id);
            const profile = await fetchUserProfile(session.user.id);
            if (profile && mounted) {
              console.log('Successfully loaded initial profile:', profile);
              setUser(profile);
            } else if (mounted) {
              console.log('No profile found during initial check');
            }
          } catch (error) {
            console.error('Error in initial profile fetch:', error);
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
