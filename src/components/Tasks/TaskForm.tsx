
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '../../contexts/AuthContext';

interface TaskFormProps {
  initialData?: any;
  onSubmit: (data: any) => void;
}

const TaskForm = ({ initialData, onSubmit }: TaskFormProps) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    assigned_to: '',
    due_date: '',
    collaborators: [] as string[],
  });
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        priority: initialData.priority || 'medium',
        assigned_to: initialData.assigned_to || '',
        due_date: initialData.due_date || '',
        collaborators: initialData.collaborators || [],
      });
    }
  }, [initialData]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, email, role')
        .order('first_name');

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const submitData = {
      ...formData,
      assigned_to: formData.assigned_to === 'unassigned' ? null : formData.assigned_to,
      due_date: formData.due_date || null,
    };

    await onSubmit(submitData);
    setLoading(false);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCollaboratorChange = (userId: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      collaborators: checked 
        ? [...prev.collaborators, userId]
        : prev.collaborators.filter(id => id !== userId)
    }));
  };

  // Filtrar usuários para colaboradores (excluir o assignee e o criador)
  const availableCollaborators = users.filter(userOption => 
    userOption.id !== formData.assigned_to && 
    userOption.id !== user?.id
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Título *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => handleChange('title', e.target.value)}
          placeholder="Digite o título da tarefa"
          required
        />
      </div>

      <div>
        <Label htmlFor="description">Descrição</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="Descreva os detalhes da tarefa"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="priority">Prioridade</Label>
          <Select value={formData.priority} onValueChange={(value) => handleChange('priority', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Baixa</SelectItem>
              <SelectItem value="medium">Média</SelectItem>
              <SelectItem value="high">Alta</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="due_date">Data de Vencimento</Label>
          <Input
            id="due_date"
            type="date"
            value={formData.due_date}
            onChange={(e) => handleChange('due_date', e.target.value)}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="assigned_to">Atribuir para</Label>
        <Select value={formData.assigned_to || 'unassigned'} onValueChange={(value) => handleChange('assigned_to', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione um usuário (opcional)" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="unassigned">Nenhum usuário</SelectItem>
            {users.map((userOption) => (
              <SelectItem key={userOption.id} value={userOption.id}>
                {userOption.first_name} {userOption.last_name}
                {userOption.role === 'manager' && ' (Gerente)'}
                {userOption.role === 'admin' && ' (Admin)'}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Colaboradores */}
      <div>
        <Label>Colaboradores/Envolvidos</Label>
        <div className="mt-2 space-y-2 max-h-40 overflow-y-auto border rounded p-3">
          {availableCollaborators.length > 0 ? (
            availableCollaborators.map((userOption) => (
              <div key={userOption.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`collaborator-${userOption.id}`}
                  checked={formData.collaborators.includes(userOption.id)}
                  onCheckedChange={(checked) => handleCollaboratorChange(userOption.id, checked as boolean)}
                />
                <Label htmlFor={`collaborator-${userOption.id}`} className="text-sm">
                  {userOption.first_name} {userOption.last_name}
                  {userOption.role === 'manager' && ' (Gerente)'}
                  {userOption.role === 'admin' && ' (Admin)'}
                </Label>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">Nenhum colaborador disponível</p>
          )}
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="submit" disabled={loading}>
          {loading ? 'Salvando...' : (initialData ? 'Atualizar' : 'Criar')} Tarefa
        </Button>
      </div>
    </form>
  );
};

export default TaskForm;
