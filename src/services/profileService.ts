
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
      console.error('Supabase error fetching user profile:', error);
      return null;
    }
    
    if (!data) {
      console.log('No profile data returned for user:', userId);
      return null;
    }
    
    console.log('User profile fetched successfully:', data);
    return data;
  } catch (error) {
    console.error('Error in fetchUserProfile service:', error);
    return null;
  }
};
