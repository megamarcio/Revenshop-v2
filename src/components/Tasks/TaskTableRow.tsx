
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TableCell, TableRow } from '@/components/ui/table';
import { Edit, Trash2, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface TaskTableRowProps {
  task: any;
  canEditVehicles: boolean;
  userId?: string;
  onEdit: (task: any) => void;
  onStatusChange: (taskId: string, status: string) => void;
  onDelete: (taskId: string) => void;
  isDeleting: boolean;
}

const TaskTableRow = ({ 
  task, 
  canEditVehicles, 
  userId,
  onEdit, 
  onStatusChange, 
  onDelete, 
  isDeleting 
}: TaskTableRowProps) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const isOverdue = (dueDate: string | null) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date();
  };

  return (
    <TableRow>
      <TableCell>
        <div>
          <div className="font-medium flex items-center gap-2">
            {task.title}
            {task.due_date && isOverdue(task.due_date) && task.status !== 'completed' && (
              <AlertTriangle className="h-4 w-4 text-red-500" />
            )}
          </div>
          {task.description && (
            <div className="text-sm text-gray-500 mt-1">{task.description}</div>
          )}
        </div>
      </TableCell>
      <TableCell>
        {task.vehicle ? (
          <div>
            <div className="font-medium text-sm">{task.vehicle.name}</div>
            <div className="text-xs text-gray-500">{task.vehicle.internal_code}</div>
          </div>
        ) : (
          '-'
        )}
      </TableCell>
      <TableCell>
        {task.assigned_user ? (
          `${task.assigned_user.first_name} ${task.assigned_user.last_name}`
        ) : (
          <span className="text-gray-400">Não atribuída</span>
        )}
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${getPriorityColor(task.priority)}`} />
          <span className="capitalize">{task.priority}</span>
        </div>
      </TableCell>
      <TableCell>
        <select
          value={task.status}
          onChange={(e) => onStatusChange(task.id, e.target.value)}
          className="text-sm border rounded px-2 py-1"
          disabled={!canEditVehicles && task.assigned_to !== userId}
        >
          <option value="pending">Pendente</option>
          <option value="in_progress">Em Andamento</option>
          <option value="completed">Concluída</option>
          <option value="cancelled">Cancelada</option>
        </select>
      </TableCell>
      <TableCell>
        {task.due_date ? (
          <span className={isOverdue(task.due_date) && task.status !== 'completed' ? 'text-red-600 font-medium' : ''}>
            {format(new Date(task.due_date), 'dd/MM/yyyy', { locale: ptBR })}
          </span>
        ) : (
          '-'
        )}
      </TableCell>
      <TableCell>
        <div className="flex gap-1">
          <Button
            variant="outline"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={() => onEdit(task)}
          >
            <Edit className="h-3 w-3" />
          </Button>
          {canEditVehicles && (
            <Button
              variant="outline"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={() => onDelete(task.id)}
              disabled={isDeleting}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
};

export default TaskTableRow;
