import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  assigned_to: string | null;
  created_by: string | null;
  due_date: string | null;
  created_at: string;
  updated_at: string;
  completed_at: string | null;
  assignee: {
    first_name: string | null;
    last_name: string | null;
    email: string | null;
  } | null;
  creator: {
    first_name: string | null;
    last_name: string | null;
    email: string | null;
  } | null;
  collaborators: any[];
}

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  const createTask = async (newTask: Omit<Task, 'id' | 'created_at' | 'updated_at' | 'completed_at' | 'assignee' | 'creator' | 'collaborators'>) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('tasks')
        .insert([newTask])
        .select()

      if (error) throw error;

      fetchTasks();
    } catch (error) {
      console.error('Error creating task:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateTask = async (id: string, updatedTask: Partial<Task>) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('tasks')
        .update(updatedTask)
        .eq('id', id)
        .select()

      if (error) throw error;

      fetchTasks();
    } catch (error) {
      console.error('Error updating task:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async (id: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id)

      if (error) throw error;

      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('tasks')
        .select(`
          *,
          assignee:assigned_to(first_name, last_name, email),
          creator:created_by(first_name, last_name, email),
          collaborators(*)
        `);

      if (error) throw error;

      const transformedTasks = data.map(task => ({
        id: task.id,
        title: task.title,
        description: task.description,
        status: task.status as 'pending' | 'in_progress' | 'completed',
        priority: task.priority as 'low' | 'medium' | 'high',
        assigned_to: task.assigned_to,
        created_by: task.created_by,
        due_date: task.due_date,
        created_at: task.created_at,
        updated_at: task.updated_at,
        completed_at: task.completed_at,
        assignee: task.assignee && !Array.isArray(task.assignee) && typeof task.assignee === 'object' && 'first_name' in task.assignee 
          ? {
              first_name: task.assignee.first_name,
              last_name: task.assignee.last_name,
              email: task.assignee.email
            }
          : { first_name: '', last_name: '', email: '' },
        creator: task.creator && !Array.isArray(task.creator) && typeof task.creator === 'object' && 'first_name' in task.creator
          ? {
              first_name: task.creator.first_name,
              last_name: task.creator.last_name,
              email: task.creator.email
            }
          : { first_name: '', last_name: '', email: '' },
        collaborators: Array.isArray(task.collaborators) ? task.collaborators : []
      }));

      setTasks(transformedTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    tasks,
    loading,
    createTask,
    updateTask,
    deleteTask,
    unreadTasksCount: 0
  };
};
