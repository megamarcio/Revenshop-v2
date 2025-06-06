import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit, Trash2, Calendar, User, Car, AlertTriangle } from 'lucide-react';
import { useTasks } from '../../hooks/useTasks';
import { useAuth } from '../../contexts/AuthContext';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface TaskListProps {
  onEditTask: (task: any) => void;
  compact?: boolean;
  limit?: number;
}

const TaskList = ({ onEditTask, compact = false, limit }: TaskListProps) => {
  const { tasks, updateTask, deleteTask, isDeleting } = useTasks();
  const { canEditVehicles, user } = useAuth();
  const [filter, setFilter] = useState<'all' | 'pending' | 'in_progress' | 'completed'>('all');

  const filteredTasks = tasks
    .filter(task => filter === 'all' || task.status === filter)
    .slice(0, limit);

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

  const handleStatusChange = (taskId: string, newStatus: string) => {
    const updates: any = { status: newStatus };
    if (newStatus === 'completed') {
      updates.completed_at = new Date().toISOString();
    }
    updateTask({ id: taskId, updates });
  };

  const handleDelete = (taskId: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta tarefa?')) {
      deleteTask(taskId);
    }
  };

  const isOverdue = (dueDate: string | null) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date();
  };

  if (compact) {
    return (
      <div className="space-y-3">
        {!compact && (
          <div className="flex gap-2 mb-4">
            {['all', 'pending', 'in_progress', 'completed'].map((status) => (
              <Button
                key={status}
                variant={filter === status ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter(status as any)}
                className="capitalize"
              >
                {status === 'all' ? 'Todas' : 
                 status === 'pending' ? 'Pendentes' :
                 status === 'in_progress' ? 'Em Andamento' : 'Concluídas'}
              </Button>
            ))}
          </div>
        )}
        
        {filteredTasks.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Nenhuma tarefa encontrada</p>
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div key={task.id} className="border rounded-lg p-4 space-y-2">
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
                    onClick={() => onEditTask(task)}
                    className="h-6 w-6 p-0"
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {['all', 'pending', 'in_progress', 'completed'].map((status) => (
          <Button
            key={status}
            variant={filter === status ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter(status as any)}
            className="capitalize"
          >
            {status === 'all' ? 'Todas' : 
             status === 'pending' ? 'Pendentes' :
             status === 'in_progress' ? 'Em Andamento' : 'Concluídas'}
          </Button>
        ))}
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tarefa</TableHead>
              <TableHead>Veículo</TableHead>
              <TableHead>Responsável</TableHead>
              <TableHead>Prioridade</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Vencimento</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTasks.map((task) => (
              <TableRow key={task.id}>
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
                    onChange={(e) => handleStatusChange(task.id, e.target.value)}
                    className="text-sm border rounded px-2 py-1"
                    disabled={!canEditVehicles && task.assigned_to !== user?.id}
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
                      onClick={() => onEditTask(task)}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    {canEditVehicles && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => handleDelete(task.id)}
                        disabled={isDeleting}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        {filteredTasks.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Nenhuma tarefa encontrada</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskList;
