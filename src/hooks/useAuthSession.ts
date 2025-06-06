
import { useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User } from '@/types/auth';

export const useAuthSession = (
  setUser: (user: User | null) => void,
  setLoading: (loading: boolean) => void,
  clearUser: () => void
) => {
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
  }, [setUser]);

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
  }, [fetchUserProfile, clearUser, setLoading]);

  return { fetchUserProfile };
};
