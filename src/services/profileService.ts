
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
      
      // Se for erro PGRST116 (sem linhas), o perfil não existe
      if (error.code === 'PGRST116') {
        console.log('Profile not found for user:', userId);
        return null;
      }
      
      // Para outros erros, tentar criar o perfil básico
      if (error.code === 'PGRST301' || error.message.includes('violates row-level security')) {
        console.log('RLS policy issue, creating basic profile for user:', userId);
        
        // Tentar obter dados do usuário autenticado
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user && user.id === userId) {
          // Criar perfil básico
          const { data: newProfile, error: insertError } = await supabase
            .from('profiles')
            .insert({
              id: userId,
              first_name: user.user_metadata?.first_name || 'User',
              last_name: user.user_metadata?.last_name || '',
              email: user.email || '',
              role: 'seller'
            })
            .select()
            .single();
            
          if (insertError) {
            console.error('Error creating profile:', insertError);
            return null;
          }
          
          console.log('Created new profile:', newProfile);
          return newProfile;
        }
      }
      
      return null;
    }
    
    if (!data) {
      console.log('No data returned for user profile:', userId);
      return null;
    }
    
    console.log('User profile fetched successfully:', data);
    return data;
  } catch (error) {
    console.error('Error in fetchUserProfile service:', error);
    return null;
  }
};
