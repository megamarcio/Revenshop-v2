
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useHasUsers = () => {
  const [hasUsers, setHasUsers] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  const checkForUsers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('id')
        .limit(1);

      if (error) {
        console.error('Error checking for users:', error);
        setHasUsers(true); // Em caso de erro, assume que há usuários para não mostrar o botão
        return;
      }

      setHasUsers(data && data.length > 0);
    } catch (error) {
      console.error('Error in checkForUsers:', error);
      setHasUsers(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkForUsers();
  }, []);

  return {
    hasUsers,
    loading,
    refetch: checkForUsers,
  };
};
