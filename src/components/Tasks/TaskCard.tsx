
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Calendar, User, Car, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface TaskCardProps {
  task: any;
  onEdit: (task: any) => void;
}

const TaskCard = ({ task, onEdit }: TaskCardProps) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'secondary';
      case 'in_progress': return 'default';
      case 'completed': return 'default';
      case 'cancelled': return 'destructive';
      default: return 'secondary';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'Pendente';
      case 'in_progress': return 'Em Andamento';
      case 'completed': return 'Concluída';
      case 'cancelled': return 'Cancelada';
      default: return status;
    }
  };

  const isOverdue = (dueDate: string | null) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date();
  };

  return (
    <div className="border rounded-lg p-4 space-y-2">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-medium">{task.title}</h3>
            <div className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority)}`} />
            {task.due_date && isOverdue(task.due_date) && task.status !== 'completed' && (
              <AlertTriangle className="h-4 w-4 text-red-500" />
            )}
          </div>
          {task.description && (
            <p className="text-sm text-gray-600 mt-1">{task.description}</p>
          )}
          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
            {task.vehicle && (
              <div className="flex items-center gap-1">
                <Car className="h-3 w-3" />
                <span>{task.vehicle.name}</span>
              </div>
            )}
            {task.assigned_user && (
              <div className="flex items-center gap-1">
                <User className="h-3 w-3" />
                <span>{task.assigned_user.first_name} {task.assigned_user.last_name}</span>
              </div>
            )}
            {task.due_date && (
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{format(new Date(task.due_date), 'dd/MM/yyyy', { locale: ptBR })}</span>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={getStatusColor(task.status)} className="text-xs">
            {getStatusLabel(task.status)}
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(task)}
            className="h-6 w-6 p-0"
          >
            <Edit className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
