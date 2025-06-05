
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '../contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  created_by: string;
  assigned_to?: string;
  due_date?: string;
  created_at: string;
  updated_at: string;
  completed_at?: string;
  creator?: {
    first_name: string;
    last_name: string;
    email: string;
  };
  assignee?: {
    first_name: string;
    last_name: string;
    email: string;
  };
}

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadTasksCount, setUnreadTasksCount] = useState(0);
  const { user } = useAuth();

  const fetchTasks = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('tasks')
        .select(`
          *,
          creator:created_by(first_name, last_name, email),
          assignee:assigned_to(first_name, last_name, email)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Type assertion to ensure proper typing
      const typedTasks = (data || []).map(task => ({
        ...task,
        status: task.status as 'pending' | 'in_progress' | 'completed',
        priority: task.priority as 'low' | 'medium' | 'high'
      }));
      
      setTasks(typedTasks);
      
      // Contar tarefas não lidas (novas tarefas atribuídas ao usuário)
      const newTasksAssignedToMe = typedTasks.filter(task => 
        task.assigned_to === user.id && 
        task.status === 'pending' &&
        new Date(task.created_at) > new Date(Date.now() - 24 * 60 * 60 * 1000) // Últimas 24h
      ).length || 0;
      
      setUnreadTasksCount(newTasksAssignedToMe);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao carregar tarefas',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (taskData: {
    title: string;
    description?: string;
    priority: 'low' | 'medium' | 'high';
    assigned_to?: string;
    due_date?: string;
  }) => {
    if (!user) return false;

    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert({
          ...taskData,
          created_by: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      // Enviar email se tarefa foi atribuída a outro usuário
      if (taskData.assigned_to && taskData.assigned_to !== user.id) {
        await supabase.functions.invoke('send-task-notification', {
          body: {
            taskId: data.id,
            taskTitle: taskData.title,
            assigneeId: taskData.assigned_to,
            creatorName: `${user.first_name} ${user.last_name}`
          }
        });
      }

      await fetchTasks();
      toast({
        title: 'Sucesso',
        description: 'Tarefa criada com sucesso!',
      });
      return true;
    } catch (error) {
      console.error('Error creating task:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao criar tarefa',
        variant: 'destructive',
      });
      return false;
    }
  };

  const updateTask = async (taskId: string, updates: Partial<Task>) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
          ...(updates.status === 'completed' && { completed_at: new Date().toISOString() })
        })
        .eq('id', taskId);

      if (error) throw error;

      await fetchTasks();
      toast({
        title: 'Sucesso',
        description: 'Tarefa atualizada com sucesso!',
      });
      return true;
    } catch (error) {
      console.error('Error updating task:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao atualizar tarefa',
        variant: 'destructive',
      });
      return false;
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId);

      if (error) throw error;

      await fetchTasks();
      toast({
        title: 'Sucesso',
        description: 'Tarefa excluída com sucesso!',
      });
      return true;
    } catch (error) {
      console.error('Error deleting task:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao excluir tarefa',
        variant: 'destructive',
      });
      return false;
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [user]);

  return {
    tasks,
    loading,
    unreadTasksCount,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask
  };
};
