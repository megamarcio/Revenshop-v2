
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface WhatsAppGroup {
  id: string;
  name: string;
  phone: string;
}

export const useWhatsAppGroups = () => {
  const [groups, setGroups] = useState<WhatsAppGroup[]>([]);

  const loadGroups = async () => {
    try {
      const { data, error } = await supabase
        .from('whatsapp_groups')
        .select('id, name, phone')
        .order('name');

      if (error) throw error;
      setGroups(data || []);
    } catch (error) {
      console.error('Erro ao carregar grupos:', error);
    }
  };

  useEffect(() => {
    loadGroups();
  }, []);

  return {
    groups,
    loadGroups
  };
};
