
import React from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Edit, Trash2 } from 'lucide-react';
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

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'Urgente';
      case 'high': return 'Alta';
      case 'medium': return 'Média';
      case 'low': return 'Baixa';
      default: return priority;
    }
  };

  const isOverdue = (dueDate: string | null) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date();
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(task);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(task.id);
  };

  return (
    <TableRow className="hover:bg-gray-50">
      <TableCell className="py-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-gray-900">
            {task.title}
          </span>
          {task.due_date && isOverdue(task.due_date) && task.status !== 'completed' && (
            <AlertTriangle className="h-3 w-3 text-red-500 flex-shrink-0" />
          )}
        </div>
      </TableCell>
      <TableCell className="py-2">
        <span className="text-xs text-gray-700">
          {task.assigned_user ? (
            `${task.assigned_user.first_name} ${task.assigned_user.last_name}`
          ) : (
            <span className="text-gray-400">Não atribuída</span>
          )}
        </span>
      </TableCell>
      <TableCell className="py-2">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority)} flex-shrink-0`} />
          <span className="text-xs text-gray-700">{getPriorityText(task.priority)}</span>
        </div>
      </TableCell>
      <TableCell className="py-2">
        <span className={`text-xs ${isOverdue(task.due_date) && task.status !== 'completed' ? 'text-red-600 font-medium' : 'text-gray-700'}`}>
          {task.due_date ? (
            format(new Date(task.due_date), 'dd/MM/yyyy', { locale: ptBR })
          ) : (
            '-'
          )}
        </span>
      </TableCell>
      <TableCell className="py-2">
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleEdit}
            className="h-7 w-7 p-0 hover:bg-blue-100"
          >
            <Edit className="h-3 w-3 text-blue-600" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            disabled={isDeleting}
            className="h-7 w-7 p-0 hover:bg-red-100"
          >
            <Trash2 className="h-3 w-3 text-red-600" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default TaskTableRow;
