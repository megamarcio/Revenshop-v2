
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
      
      // If it's a PGRST116 error (no rows), the profile doesn't exist
      if (error.code === 'PGRST116') {
        console.error('Profile not found for user:', userId);
        return null;
      }
      
      // For other errors, throw so we can handle them properly
      throw error;
    }
    
    if (!data) {
      console.error('No data returned for user profile:', userId);
      return null;
    }
    
    console.log('User profile fetched successfully:', data);
    return data;
  } catch (error) {
    console.error('Error in fetchUserProfile service:', error);
    // Return null instead of throwing to prevent app crashes
    return null;
  }
};
