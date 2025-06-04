
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useHasUsers = () => {
  const [hasUsers, setHasUsers] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUsers = async () => {
      try {
        console.log('Checking if users exist...');
        const { data, error } = await supabase
          .from('profiles')
          .select('id')
          .limit(1);

        if (error) {
          console.error('Error checking users:', error);
          setHasUsers(null);
          return;
        }

        const userExists = data && data.length > 0;
        console.log('Users exist:', userExists);
        setHasUsers(userExists);
      } catch (error) {
        console.error('Error in checkUsers:', error);
        setHasUsers(null);
      } finally {
        setLoading(false);
      }
    };

    checkUsers();
  }, []);

  return { hasUsers, loading };
};
