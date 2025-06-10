
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import WhatsAppGroupCard from './WhatsAppGroupCard';
import WhatsAppGroupForm from './WhatsAppGroupForm';

interface WhatsAppGroup {
  id?: string;
  name: string;
  description: string;
  phone: string;
}

const WhatsAppIntegration = () => {
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
        // Criar novo grupo - obter user_id primeiro
        const { data: user } = await supabase.auth.getUser();
        if (!user.user) {
          throw new Error('Usuário não autenticado');
        }

        const { error } = await supabase
          .from('whatsapp_groups')
          .insert({
            name: group.name,
            description: group.description,
            phone: group.phone,
            user_id: user.user.id
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

  if (isLoadingGroups) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-muted-foreground">Carregando grupos...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MessageCircle className="h-5 w-5" />
              <span>Integração WhatsApp</span>
            </div>
            <Button 
              onClick={() => setIsAddingGroup(true)}
              disabled={isAddingGroup || editingGroup !== null}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Adicionar Grupo
            </Button>
          </CardTitle>
          <CardDescription>
            Gerencie os grupos do WhatsApp para integração com o sistema
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Formulário para novo grupo */}
          {isAddingGroup && (
            <WhatsAppGroupForm
              newGroup={newGroup}
              isLoading={isLoading}
              onSave={saveGroup}
              onCancel={handleCancelEdit}
              onChange={setNewGroup}
            />
          )}

          {/* Lista de grupos */}
          <div className="space-y-3">
            {groups.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Nenhum grupo cadastrado. Clique em "Adicionar Grupo" para começar.
              </div>
            ) : (
              groups.map((group) => (
                <WhatsAppGroupCard
                  key={group.id}
                  group={group}
                  isEditing={editingGroup?.id === group.id}
                  editingGroup={editingGroup}
                  isLoading={isLoading}
                  onEdit={handleEdit}
                  onSave={saveGroup}
                  onDelete={deleteGroup}
                  onCancel={handleCancelEdit}
                  onEditingChange={setEditingGroup}
                />
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WhatsAppIntegration;
