
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  vehicle_id: string | null;
  assigned_to: string | null;
  created_by: string;
  due_date: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
  vehicle?: {
    name: string;
    internal_code: string;
  };
  assigned_user?: {
    first_name: string;
    last_name: string;
  };
  created_user?: {
    first_name: string;
    last_name: string;
  };
}

export const useTasks = () => {
  const queryClient = useQueryClient();

  const { data: tasks, isLoading, error } = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      console.log('Fetching tasks...');
      const { data, error } = await supabase
        .from('tasks')
        .select(`
          *,
          vehicle:vehicles(name, internal_code),
          assigned_user:profiles!tasks_assigned_to_fkey(first_name, last_name),
          created_user:profiles!tasks_created_by_fkey(first_name, last_name)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching tasks:', error);
        throw error;
      }
      
      console.log('Tasks fetched:', data);
      return data as Task[];
    },
  });

  const createTaskMutation = useMutation({
    mutationFn: async (newTask: Omit<Task, 'id' | 'created_at' | 'updated_at' | 'vehicle' | 'assigned_user' | 'created_user'>) => {
      const { data, error } = await supabase
        .from('tasks')
        .insert([newTask])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast({
        title: 'Sucesso',
        description: 'Tarefa criada com sucesso!',
      });
    },
    onError: (error) => {
      console.error('Error creating task:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao criar tarefa.',
        variant: 'destructive',
      });
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Task> }) => {
      const { data, error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast({
        title: 'Sucesso',
        description: 'Tarefa atualizada com sucesso!',
      });
    },
    onError: (error) => {
      console.error('Error updating task:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao atualizar tarefa.',
        variant: 'destructive',
      });
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast({
        title: 'Sucesso',
        description: 'Tarefa excluída com sucesso!',
      });
    },
    onError: (error) => {
      console.error('Error deleting task:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao excluir tarefa.',
        variant: 'destructive',
      });
    },
  });

  return {
    tasks: tasks || [],
    isLoading,
    error,
    createTask: createTaskMutation.mutate,
    updateTask: updateTaskMutation.mutate,
    deleteTask: deleteTaskMutation.mutate,
    isCreating: createTaskMutation.isPending,
    isUpdating: updateTaskMutation.isPending,
    isDeleting: deleteTaskMutation.isPending,
  };
};
