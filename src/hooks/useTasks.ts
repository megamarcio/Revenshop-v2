import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '../contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  assigned_to: string | null;
  created_by: string;
  due_date: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
  assignee?: {
    first_name: string;
    last_name: string;
    email: string;
  } | null;
  creator?: {
    first_name: string;
    last_name: string;
    email: string;
  };
  collaborators?: string[];
}

export const useTasks = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('tasks')
        .select(`
          *,
          assignee:assigned_to(first_name, last_name, email),
          creator:created_by(first_name, last_name, email)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform and validate the data to match our Task interface
      const validatedTasks: Task[] = (data || []).map(task => ({
        id: task.id,
        title: task.title,
        description: task.description || '',
        status: ['pending', 'in_progress', 'completed'].includes(task.status) 
          ? task.status as 'pending' | 'in_progress' | 'completed'
          : 'pending',
        priority: ['low', 'medium', 'high'].includes(task.priority)
          ? task.priority as 'low' | 'medium' | 'high'
          : 'medium',
        assigned_to: task.assigned_to,
        created_by: task.created_by,
        due_date: task.due_date,
        completed_at: task.completed_at,
        created_at: task.created_at,
        updated_at: task.updated_at,
        assignee: task.assignee && !task.assignee.error ? task.assignee : null,
        creator: task.creator && !task.creator.error ? task.creator : null,
        collaborators: []
      }));

      setTasks(validatedTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao carregar tarefas.',
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

  // Calculate unread tasks count (tasks assigned to current user that are pending)
  const unreadTasksCount = tasks.filter(
    task => task.assigned_to === user?.id && task.status === 'pending'
  ).length;

  useEffect(() => {
    fetchTasks();
  }, [user]);

  return {
    tasks,
    loading,
    unreadTasksCount,
    createTask: async (taskData: {
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
    },
    updateTask: async (taskId: string, updates: Partial<Task>) => {
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
    },
    deleteTask: async (taskId: string) => {
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
    },
    fetchTasks,
  };
};
