
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface TitleLocation {
  id: string;
  code: string;
  name: string;
  is_default: boolean;
  allows_custom: boolean;
}

export const useTitleLocations = () => {
  const [titleLocations, setTitleLocations] = useState<TitleLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTitleLocations = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('title_locations')
          .select('*')
          .order('name', { ascending: true });

        if (error) {
          setError(error.message);
          console.error('Error fetching title locations:', error);
        } else {
          setTitleLocations(data || []);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
        setError(errorMessage);
        console.error('Error fetching title locations:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTitleLocations();
  }, []);

  return { titleLocations, loading, error };
};
