
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User } from '@/types/auth';

export const useUserProfile = () => {
  const [user, setUser] = useState<User | null>(null);

  const fetchUserProfile = async (userId: string) => {
    try {
      console.log('Fetching user profile for:', userId);
      
      // Try to get the profile, but don't fail if it doesn't exist yet
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
  };

  const clearUser = () => {
    setUser(null);
  };

  return {
    user,
    setUser,
    fetchUserProfile,
    clearUser,
  };
};
