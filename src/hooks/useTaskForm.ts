
import { useState } from 'react';
import { useTasks } from './useTasks';
import { useAuth } from '../contexts/AuthContext';

interface UseTaskFormProps {
  task?: any;
  onSave: () => void;
}

export const useTaskForm = ({ task, onSave }: UseTaskFormProps) => {
  const { createTask, updateTask, isCreating, isUpdating } = useTasks();
  const { user } = useAuth();
  const isEditing = !!task;

  const [formData, setFormData] = useState({
    title: task?.title || '',
    description: task?.description || '',
    priority: task?.priority || 'medium',
    status: task?.status || 'pending',
    vehicle_id: task?.vehicle_id || '',
    assigned_to: task?.assigned_to || '',
    due_date: task?.due_date || '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      return;
    }

    const taskData = {
      ...formData,
      created_by: user?.id || '',
      vehicle_id: formData.vehicle_id || null,
      assigned_to: formData.assigned_to || null,
      due_date: formData.due_date || null,
    };

    if (isEditing) {
      updateTask({ id: task.id, updates: taskData });
    } else {
      createTask(taskData);
    }
    
    onSave();
  };

  return {
    formData,
    handleInputChange,
    handleSubmit,
    isLoading: isCreating || isUpdating,
    isEditing
  };
};
