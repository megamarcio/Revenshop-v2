
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types/auth';

export const fetchUserProfile = async (userId: string): Promise<User | null> => {
  try {
    console.log('Fetching user profile for:', userId);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
    
    console.log('User profile fetched:', data);
    return data;
  } catch (error) {
    console.error('Error in fetchUserProfile:', error);
    return null;
  }
};
