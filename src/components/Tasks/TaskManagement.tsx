import React, { useState } from 'react';
import { useTasks } from '../../hooks/useTasks';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit, Trash2, CheckSquare, Clock, AlertCircle } from 'lucide-react';
import TaskForm from './TaskForm';

const TaskManagement = () => {
  const { tasks, loading, createTask, updateTask, deleteTask } = useTasks();
  const { user } = useAuth();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<any>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  const filteredTasks = tasks.filter(task => {
    const statusMatch = statusFilter === 'all' || task.status === statusFilter;
    const priorityMatch = priorityFilter === 'all' || task.priority === priorityFilter;
    return statusMatch && priorityMatch;
  });

  const handleCreateTask = async (taskData: any) => {
    const success = await createTask(taskData);
    if (success) {
      setIsCreateDialogOpen(false);
    }
  };

  const handleUpdateTask = async (taskData: any) => {
    if (!editingTask) return;
    const success = await updateTask(editingTask.id, taskData);
    if (success) {
      setEditingTask(null);
    }
  };

  const handleStatusChange = async (taskId: string, newStatus: 'pending' | 'in_progress' | 'completed') => {
    await updateTask(taskId, { status: newStatus });
  };

  const handleDeleteTask = async (taskId: string) => {
    if (confirm('Tem certeza que deseja excluir esta tarefa?')) {
      await deleteTask(taskId);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed': return 'Concluída';
      case 'in_progress': return 'Em Progresso';
      case 'pending': return 'Pendente';
      default: return status;
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high': return 'Alta';
      case 'medium': return 'Média';
      case 'low': return 'Baixa';
      default: return priority;
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-gray-600">Carregando tarefas...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tarefas</h1>
          <p className="text-gray-600 mt-1">Gerencie suas tarefas e da equipe</p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-revenshop-primary hover:bg-revenshop-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Nova Tarefa
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Criar Nova Tarefa</DialogTitle>
            </DialogHeader>
            <TaskForm onSubmit={handleCreateTask} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Filtros */}
      <div className="flex space-x-4">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filtrar por status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os status</SelectItem>
            <SelectItem value="pending">Pendente</SelectItem>
            <SelectItem value="in_progress">Em Progresso</SelectItem>
            <SelectItem value="completed">Concluída</SelectItem>
          </SelectContent>
        </Select>

        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filtrar por prioridade" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as prioridades</SelectItem>
            <SelectItem value="high">Alta</SelectItem>
            <SelectItem value="medium">Média</SelectItem>
            <SelectItem value="low">Baixa</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Lista de Tarefas */}
      <div className="grid gap-4">
        {filteredTasks.map((task) => (
          <Card key={task.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{task.title}</h3>
                    <Badge className={getPriorityColor(task.priority)}>
                      {getPriorityLabel(task.priority)}
                    </Badge>
                    <Badge className={getStatusColor(task.status)}>
                      {getStatusLabel(task.status)}
                    </Badge>
                  </div>
                  
                  {task.description && (
                    <p className="text-gray-600 mb-3">{task.description}</p>
                  )}
                  
                  <div className="flex items-center space-x-6 text-sm text-gray-500">
                    <div className="flex items-center space-x-2">
                      <span>Criado por:</span>
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs">
                          {task.creator?.first_name?.charAt(0)}{task.creator?.last_name?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span>{task.creator?.first_name} {task.creator?.last_name}</span>
                    </div>
                    
                    {task.assignee && (
                      <div className="flex items-center space-x-2">
                        <span>Atribuído para:</span>
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="text-xs">
                            {task.assignee?.first_name?.charAt(0)}{task.assignee?.last_name?.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span>{task.assignee?.first_name} {task.assignee?.last_name}</span>
                      </div>
                    )}
                    
                    {task.due_date && (
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>Vence: {new Date(task.due_date).toLocaleDateString('pt-BR')}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {(task.created_by === user?.id || task.assigned_to === user?.id) && (
                    <Select 
                      value={task.status} 
                      onValueChange={(value) => handleStatusChange(task.id, value as 'pending' | 'in_progress' | 'completed')}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pendente</SelectItem>
                        <SelectItem value="in_progress">Em Progresso</SelectItem>
                        <SelectItem value="completed">Concluída</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                  
                  {task.created_by === user?.id && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingTask(task)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteTask(task.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Dialog de Edição */}
      <Dialog open={!!editingTask} onOpenChange={() => setEditingTask(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Tarefa</DialogTitle>
          </DialogHeader>
          {editingTask && (
            <TaskForm 
              initialData={editingTask} 
              onSubmit={handleUpdateTask} 
            />
          )}
        </DialogContent>
      </Dialog>

      {filteredTasks.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <CheckSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">Nenhuma tarefa encontrada</h3>
            <p className="text-gray-500">Comece criando uma nova tarefa para sua equipe.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TaskManagement;
