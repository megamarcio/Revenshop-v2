
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  assigned_to: string;
  created_by: string;
  due_date: string;
  created_at: string;
  updated_at: string;
  assignee: {
    first_name: string;
    last_name: string;
    email: string;
  };
}

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      console.log('Fetching tasks from database...');
      const { data, error } = await supabase
        .from('tasks')
        .select(`
          *,
          assignee:assigned_to(first_name, last_name, email)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error fetching tasks:', error);
        throw error;
      }
      
      console.log('Tasks fetched successfully:', data?.length || 0, 'tasks');
      
      // Transform the data to match our interface
      const transformedTasks = data?.map(task => ({
        ...task,
        assignee: task.assignee || { first_name: '', last_name: '', email: '' }
      })) || [];
      
      setTasks(transformedTasks);
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

  const createTask = async (taskData: Omit<Task, 'id' | 'created_at' | 'updated_at' | 'assignee'>) => {
    try {
      console.log('Creating task with data:', taskData);
      
      const { data, error } = await supabase
        .from('tasks')
        .insert(taskData)
        .select(`
          *,
          assignee:assigned_to(first_name, last_name, email)
        `)
        .single();

      if (error) {
        console.error('Supabase error creating task:', error);
        throw error;
      }
      
      console.log('Task created successfully:', data);
      
      const transformedTask = {
        ...data,
        assignee: data.assignee || { first_name: '', last_name: '', email: '' }
      };
      
      setTasks(prev => [transformedTask, ...prev]);
      return transformedTask;
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  };

  const updateTask = async (id: string, taskData: Partial<Task>) => {
    try {
      console.log('Updating task:', id, 'with data:', taskData);
      
      const { data, error } = await supabase
        .from('tasks')
        .update(taskData)
        .eq('id', id)
        .select(`
          *,
          assignee:assigned_to(first_name, last_name, email)
        `)
        .single();

      if (error) {
        console.error('Supabase error updating task:', error);
        throw error;
      }
      
      console.log('Task updated successfully:', data);
      
      const transformedTask = {
        ...data,
        assignee: data.assignee || { first_name: '', last_name: '', email: '' }
      };
      
      setTasks(prev => prev.map(t => t.id === id ? transformedTask : t));
      return transformedTask;
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  };

  const deleteTask = async (id: string) => {
    try {
      console.log('Deleting task:', id);
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Supabase error deleting task:', error);
        throw error;
      }
      
      console.log('Task deleted successfully');
      setTasks(prev => prev.filter(t => t.id !== id));
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  };

  const getUnreadTasksCount = () => {
    return tasks.filter(task => task.status === 'pending').length;
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return {
    tasks,
    loading,
    createTask,
    updateTask,
    deleteTask,
    refetch: fetchTasks,
    unreadTasksCount: getUnreadTasksCount(),
  };
};
