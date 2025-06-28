import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  role: 'admin' | 'manager' | 'seller' | 'internal_seller';
  photo?: string;
  facebook?: string;
  created_at: string;
  updated_at?: string;
}

export const useProfiles = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfiles = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, email, phone, role, photo, facebook, created_at, updated_at')
        .order('first_name', { ascending: true });

      if (error) {
        console.error('Erro ao buscar perfis:', error);
        setError('Erro ao carregar usuários');
        setProfiles([]);
      } else {
        console.log('Perfis carregados:', data?.length || 0);
        setProfiles(data || []);
      }
    } catch (err) {
      console.error('Erro inesperado ao buscar perfis:', err);
      setError('Erro inesperado ao carregar usuários');
      setProfiles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  const getProfileById = (id: string): Profile | undefined => {
    return profiles.find(profile => profile.id === id);
  };

  const getProfileName = (id: string): string => {
    const profile = getProfileById(id);
    if (profile) {
      return `${profile.first_name} ${profile.last_name}`;
    }
    return 'Usuário não encontrado';
  };

  return {
    profiles,
    loading,
    error,
    fetchProfiles,
    getProfileById,
    getProfileName
  };
}; 