
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface TitleType {
  id: string;
  code: string;
  name: string;
  description: string;
  is_default: boolean;
}

export const useTitleTypes = () => {
  const [titleTypes, setTitleTypes] = useState<TitleType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTitleTypes = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('title_types')
          .select('*')
          .order('name', { ascending: true });

        if (error) {
          setError(error.message);
          console.error('Error fetching title types:', error);
        } else {
          setTitleTypes(data || []);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
        setError(errorMessage);
        console.error('Error fetching title types:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTitleTypes();
  }, []);

  return { titleTypes, loading, error };
};
