
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface WhatsAppGroup {
  id?: string;
  name: string;
  description: string;
  phone: string;
}

export const useWhatsAppGroups = () => {
  const [groups, setGroups] = useState<WhatsAppGroup[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingGroups, setIsLoadingGroups] = useState(true);
  const [editingGroup, setEditingGroup] = useState<WhatsAppGroup | null>(null);
  const [newGroup, setNewGroup] = useState<WhatsAppGroup>({
    name: '',
    description: '',
    phone: ''
  });
  const [isAddingGroup, setIsAddingGroup] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadGroups();
  }, []);

  const loadGroups = async () => {
    try {
      setIsLoadingGroups(true);
      const { data, error } = await supabase
        .from('whatsapp_groups')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setGroups(data || []);
    } catch (error) {
      console.error('Erro ao carregar grupos:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar grupos do WhatsApp.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingGroups(false);
    }
  };

  const saveGroup = async (group: WhatsAppGroup) => {
    if (!group.name.trim() || !group.phone.trim()) {
      toast({
        title: "Erro",
        description: "Nome e telefone são obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      if (group.id) {
        // Atualizar grupo existente
        const { error } = await supabase
          .from('whatsapp_groups')
          .update({
            name: group.name,
            description: group.description,
            phone: group.phone,
            updated_at: new Date().toISOString()
          })
          .eq('id', group.id);

        if (error) throw error;

        toast({
          title: "Sucesso",
          description: "Grupo atualizado com sucesso!",
        });
      } else {
        // Criar novo grupo
        const { error } = await supabase
          .from('whatsapp_groups')
          .insert({
            name: group.name,
            description: group.description,
            phone: group.phone
          });

        if (error) throw error;

        toast({
          title: "Sucesso",
          description: "Grupo criado com sucesso!",
        });
      }

      setEditingGroup(null);
      setIsAddingGroup(false);
      setNewGroup({ name: '', description: '', phone: '' });
      loadGroups();
    } catch (error) {
      console.error('Erro ao salvar grupo:', error);
      toast({
        title: "Erro",
        description: "Erro ao salvar grupo. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteGroup = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este grupo?')) {
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('whatsapp_groups')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Grupo excluído com sucesso!",
      });
      
      loadGroups();
    } catch (error) {
      console.error('Erro ao excluir grupo:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir grupo. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (group: WhatsAppGroup) => {
    setEditingGroup({ ...group });
    setIsAddingGroup(false);
  };

  const handleCancelEdit = () => {
    setEditingGroup(null);
    setIsAddingGroup(false);
    setNewGroup({ name: '', description: '', phone: '' });
  };

  return {
    groups,
    isLoading,
    isLoadingGroups,
    editingGroup,
    newGroup,
    isAddingGroup,
    setIsAddingGroup,
    setNewGroup,
    setEditingGroup,
    saveGroup,
    deleteGroup,
    handleEdit,
    handleCancelEdit
  };
};
