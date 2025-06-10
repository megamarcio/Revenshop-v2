
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { MessageCircle, Plus, Trash2, Edit, Save, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface WhatsAppGroup {
  id: string;
  name: string;
  description: string;
  phone: string;
}

const WhatsAppIntegration = () => {
  const [groups, setGroups] = useState<WhatsAppGroup[]>([
    {
      id: '1',
      name: 'Grupo Vendas SP',
      description: 'Grupo para vendas da região de São Paulo',
      phone: '+5511999999999'
    }
  ]);
  
  const [editingGroup, setEditingGroup] = useState<string | null>(null);
  const [newGroup, setNewGroup] = useState({
    name: '',
    description: '',
    phone: ''
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const { toast } = useToast();

  const handleAddGroup = () => {
    if (!newGroup.name || !newGroup.phone) {
      toast({
        title: "Erro",
        description: "Nome e telefone são obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    const group: WhatsAppGroup = {
      id: Date.now().toString(),
      ...newGroup
    };

    setGroups([...groups, group]);
    setNewGroup({ name: '', description: '', phone: '' });
    setShowAddForm(false);
    
    toast({
      title: "Grupo adicionado",
      description: "O grupo foi adicionado com sucesso.",
    });
  };

  const handleDeleteGroup = (id: string) => {
    setGroups(groups.filter(group => group.id !== id));
    toast({
      title: "Grupo removido",
      description: "O grupo foi removido com sucesso.",
    });
  };

  const handleEditGroup = (id: string, updatedGroup: Partial<WhatsAppGroup>) => {
    setGroups(groups.map(group => 
      group.id === id ? { ...group, ...updatedGroup } : group
    ));
    setEditingGroup(null);
    toast({
      title: "Grupo atualizado",
      description: "O grupo foi atualizado com sucesso.",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageCircle className="h-5 w-5" />
            <span>Integração WhatsApp</span>
          </CardTitle>
          <CardDescription>
            Configure os grupos de WhatsApp para integração com o sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Botão Adicionar */}
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Grupos Configurados</h3>
              <Button
                onClick={() => setShowAddForm(true)}
                className="flex items-center gap-2"
                variant="outline"
              >
                <Plus className="h-4 w-4" />
                Adicionar Grupo
              </Button>
            </div>

            {/* Formulário de Adição */}
            {showAddForm && (
              <Card className="border-dashed">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor="new-name">Nome do Grupo</Label>
                        <Input
                          id="new-name"
                          placeholder="Ex: Vendas SP"
                          value={newGroup.name}
                          onChange={(e) => setNewGroup({...newGroup, name: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="new-phone">Telefone do Grupo</Label>
                        <Input
                          id="new-phone"
                          placeholder="Ex: +5511999999999"
                          value={newGroup.phone}
                          onChange={(e) => setNewGroup({...newGroup, phone: e.target.value})}
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="new-description">Descrição</Label>
                      <Textarea
                        id="new-description"
                        placeholder="Descrição do grupo..."
                        value={newGroup.description}
                        onChange={(e) => setNewGroup({...newGroup, description: e.target.value})}
                        rows={2}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleAddGroup} className="flex items-center gap-2">
                        <Save className="h-4 w-4" />
                        Salvar
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setShowAddForm(false);
                          setNewGroup({ name: '', description: '', phone: '' });
                        }}
                        className="flex items-center gap-2"
                      >
                        <X className="h-4 w-4" />
                        Cancelar
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Lista de Grupos */}
            <div className="space-y-3">
              {groups.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Nenhum grupo configurado</p>
                  <p className="text-sm">Clique em "Adicionar Grupo" para começar</p>
                </div>
              ) : (
                groups.map((group) => (
                  <Card key={group.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      {editingGroup === group.id ? (
                        <EditGroupForm
                          group={group}
                          onSave={(updatedGroup) => handleEditGroup(group.id, updatedGroup)}
                          onCancel={() => setEditingGroup(null)}
                        />
                      ) : (
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="font-semibold text-lg">{group.name}</h4>
                            <p className="text-sm text-gray-600 mb-2">{group.description}</p>
                            <p className="text-sm font-mono bg-gray-100 px-2 py-1 rounded inline-block">
                              {group.phone}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setEditingGroup(group.id)}
                              className="flex items-center gap-1"
                            >
                              <Edit className="h-3 w-3" />
                              Editar
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteGroup(group.id)}
                              className="flex items-center gap-1 text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-3 w-3" />
                              Remover
                            </Button>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const EditGroupForm = ({ 
  group, 
  onSave, 
  onCancel 
}: { 
  group: WhatsAppGroup; 
  onSave: (group: Partial<WhatsAppGroup>) => void; 
  onCancel: () => void; 
}) => {
  const [editData, setEditData] = useState({
    name: group.name,
    description: group.description,
    phone: group.phone
  });

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <Label>Nome do Grupo</Label>
          <Input
            value={editData.name}
            onChange={(e) => setEditData({...editData, name: e.target.value})}
          />
        </div>
        <div>
          <Label>Telefone do Grupo</Label>
          <Input
            value={editData.phone}
            onChange={(e) => setEditData({...editData, phone: e.target.value})}
          />
        </div>
      </div>
      <div>
        <Label>Descrição</Label>
        <Textarea
          value={editData.description}
          onChange={(e) => setEditData({...editData, description: e.target.value})}
          rows={2}
        />
      </div>
      <div className="flex gap-2">
        <Button onClick={() => onSave(editData)} className="flex items-center gap-2">
          <Save className="h-4 w-4" />
          Salvar
        </Button>
        <Button variant="outline" onClick={onCancel} className="flex items-center gap-2">
          <X className="h-4 w-4" />
          Cancelar
        </Button>
      </div>
    </div>
  );
};

export default WhatsAppIntegration;
