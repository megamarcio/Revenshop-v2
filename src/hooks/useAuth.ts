
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useUserProfile } from './useUserProfile';
import { useAuthActions } from './useAuthActions';

export const useAuth = () => {
  const [loading, setLoading] = useState(true);
  const { user, setUser, fetchUserProfile, clearUser } = useUserProfile();
  const { signIn, signUp, signOut } = useAuthActions(fetchUserProfile, clearUser);

  useEffect(() => {
    let mounted = true;
    
    console.log('Setting up auth state listener');
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        
        console.log('Auth state changed:', event, 'Session:', session?.user?.id || 'null');
        
        if (event === 'SIGNED_OUT' || !session?.user) {
          console.log('User signed out or no session, clearing user state');
          if (mounted) {
            clearUser();
            setLoading(false);
          }
        } else if (session?.user) {
          console.log('User session found, fetching profile');
          // Use setTimeout to avoid potential auth callback issues
          setTimeout(() => {
            if (mounted) {
              fetchUserProfile(session.user.id);
              setLoading(false);
            }
          }, 0);
        }
      }
    );

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;
      
      console.log('Initial session check:', session?.user?.id || 'no session');
      if (session?.user) {
        fetchUserProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      console.log('Cleaning up auth subscription');
      subscription.unsubscribe();
    };
  }, []); // Remove dependencies to prevent infinite loops

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin';
  const isManager = user?.role === 'manager';
  const isInternalSeller = user?.role === 'internal_seller';
  const isSeller = user?.role === 'seller' || user?.role === 'internal_seller';
  const canEditVehicles = isAdmin || isManager || isInternalSeller;
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
  const canCreateTasks = isAdmin || isManager || isInternalSeller;

  console.log('useAuth state:', { 
    user: user?.email || 'null', 
    isAuthenticated, 
    loading 
  });

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
    canCreateTasks,
    signIn,
    signUp,
    signOut,
  };
};
