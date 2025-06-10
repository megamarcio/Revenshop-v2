
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { MessageCircle, Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

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
        // Criar novo grupo
        const { error } = await supabase
          .from('whatsapp_groups')
          .insert([{
            name: group.name,
            description: group.description,
            phone: group.phone
          }]);

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
            <Card className="border-dashed">
              <CardContent className="p-4 space-y-4">
                <h4 className="font-medium">Novo Grupo</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="new-name">Nome do Grupo *</Label>
                    <Input
                      id="new-name"
                      value={newGroup.name}
                      onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
                      placeholder="Ex: Vendas Orlando"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-phone">Telefone do Grupo *</Label>
                    <Input
                      id="new-phone"
                      value={newGroup.phone}
                      onChange={(e) => setNewGroup({ ...newGroup, phone: e.target.value })}
                      placeholder="Ex: +1234567890"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-description">Descrição</Label>
                  <Textarea
                    id="new-description"
                    value={newGroup.description}
                    onChange={(e) => setNewGroup({ ...newGroup, description: e.target.value })}
                    placeholder="Descrição do grupo..."
                    rows={2}
                  />
                </div>
                <div className="flex gap-2">
                  <Button 
                    onClick={() => saveGroup(newGroup)}
                    disabled={isLoading}
                    className="flex items-center gap-2"
                  >
                    <Save className="h-4 w-4" />
                    Salvar
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handleCancelEdit}
                    disabled={isLoading}
                  >
                    <X className="h-4 w-4" />
                    Cancelar
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Lista de grupos */}
          <div className="space-y-3">
            {groups.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Nenhum grupo cadastrado. Clique em "Adicionar Grupo" para começar.
              </div>
            ) : (
              groups.map((group) => (
                <Card key={group.id}>
                  <CardContent className="p-4">
                    {editingGroup?.id === group.id ? (
                      // Modo de edição
                      <div className="space-y-4">
                        <h4 className="font-medium">Editando Grupo</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Nome do Grupo *</Label>
                            <Input
                              value={editingGroup.name}
                              onChange={(e) => setEditingGroup({ ...editingGroup, name: e.target.value })}
                              placeholder="Ex: Vendas Orlando"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Telefone do Grupo *</Label>
                            <Input
                              value={editingGroup.phone}
                              onChange={(e) => setEditingGroup({ ...editingGroup, phone: e.target.value })}
                              placeholder="Ex: +1234567890"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Descrição</Label>
                          <Textarea
                            value={editingGroup.description}
                            onChange={(e) => setEditingGroup({ ...editingGroup, description: e.target.value })}
                            placeholder="Descrição do grupo..."
                            rows={2}
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            onClick={() => saveGroup(editingGroup)}
                            disabled={isLoading}
                            className="flex items-center gap-2"
                          >
                            <Save className="h-4 w-4" />
                            Salvar
                          </Button>
                          <Button 
                            variant="outline" 
                            onClick={handleCancelEdit}
                            disabled={isLoading}
                          >
                            <X className="h-4 w-4" />
                            Cancelar
                          </Button>
                        </div>
                      </div>
                    ) : (
                      // Modo de visualização
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-medium">{group.name}</h4>
                          <p className="text-sm text-muted-foreground">{group.phone}</p>
                          {group.description && (
                            <p className="text-sm text-muted-foreground mt-1">{group.description}</p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(group)}
                            disabled={isLoading || editingGroup !== null || isAddingGroup}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteGroup(group.id!)}
                            disabled={isLoading || editingGroup !== null || isAddingGroup}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WhatsAppIntegration;
