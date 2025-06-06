
import React from 'react';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';

interface TaskFormActionsProps {
  onCancel: () => void;
  isLoading: boolean;
  isEditing: boolean;
}

const TaskFormActions = ({ onCancel, isLoading, isEditing }: TaskFormActionsProps) => {
  return (
    <div className="flex justify-end space-x-4 pt-6 border-t">
      <Button type="button" variant="outline" onClick={onCancel}>
        Cancelar
      </Button>
      <Button type="submit" disabled={isLoading}>
        <Save className="h-4 w-4 mr-2" />
        {isLoading ? 'Salvando...' : (isEditing ? 'Atualizar' : 'Criar Tarefa')}
      </Button>
    </div>
  );
};

export default TaskFormActions;
