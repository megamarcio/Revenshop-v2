
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X, CheckSquare } from 'lucide-react';
import { useTaskForm } from '../../hooks/useTaskForm';
import TaskBasicInfoForm from './forms/TaskBasicInfoForm';
import TaskStatusForm from './forms/TaskStatusForm';
import TaskAssignmentForm from './forms/TaskAssignmentForm';
import TaskFormActions from './forms/TaskFormActions';

interface TaskFormProps {
  task?: any;
  onSave: () => void;
  onCancel: () => void;
}

const TaskForm = ({ task, onSave, onCancel }: TaskFormProps) => {
  const { formData, handleInputChange, handleSubmit, isLoading, isEditing } = useTaskForm({ task, onSave });

  return (
    <div className="p-6">
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckSquare className="h-6 w-6 text-revenshop-primary" />
            <CardTitle>{isEditing ? 'Editar Tarefa' : 'Nova Tarefa'}</CardTitle>
          </div>
          <Button variant="ghost" size="icon" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <TaskBasicInfoForm
              title={formData.title}
              description={formData.description}
              onTitleChange={(value) => handleInputChange('title', value)}
              onDescriptionChange={(value) => handleInputChange('description', value)}
            />

            <TaskStatusForm
              priority={formData.priority}
              status={formData.status}
              onPriorityChange={(value) => handleInputChange('priority', value)}
              onStatusChange={(value) => handleInputChange('status', value)}
            />

            <TaskAssignmentForm
              vehicleId={formData.vehicle_id}
              assignedTo={formData.assigned_to}
              dueDate={formData.due_date}
              onVehicleChange={(value) => handleInputChange('vehicle_id', value)}
              onAssignedToChange={(value) => handleInputChange('assigned_to', value)}
              onDueDateChange={(value) => handleInputChange('due_date', value)}
            />

            <TaskFormActions
              onCancel={onCancel}
              isLoading={isLoading}
              isEditing={isEditing}
            />
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default TaskForm;
