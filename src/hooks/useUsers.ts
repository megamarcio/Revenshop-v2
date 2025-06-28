import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface AppUser {
  id: string;
  email: string | undefined;
  fullName: string | undefined;
}

export const useUsers = () => {
  const [users, setUsers] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      
      // This requires admin privileges. 
      // A backend function (edge function) might be needed if direct access is not available for clients.
      const { data, error } = await supabase.auth.admin.listUsers();

      if (error) {
        console.error('Error fetching users:', error);
        setError('Failed to fetch users. You might not have the required permissions.');
        setUsers([]);
      } else {
        const mappedUsers: AppUser[] = data.users.map(user => ({
          id: user.id,
          email: user.email,
          fullName: user.user_metadata?.full_name || user.email,
        }));
        setUsers(mappedUsers);
      }
      setLoading(false);
    };

    fetchUsers();
  }, []);

  return { users, loading, error };
}; 