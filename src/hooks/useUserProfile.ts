
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User } from '@/types/auth';

export const useUserProfile = () => {
  const [user, setUser] = useState<User | null>(null);

  const fetchUserProfile = async (userId: string) => {
    try {
      console.log('Fetching user profile for:', userId);
      
      // Selecionando apenas os campos necessários em vez de todos (*)
      const { data, error } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, email, phone, photo, role')
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
    console.log('Clearing user state in useUserProfile');
    setUser(null);
  };

  return {
    user,
    setUser,
    fetchUserProfile,
    clearUser,
  };
};
