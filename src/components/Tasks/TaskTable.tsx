
import React from 'react';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import TaskTableRow from './TaskTableRow';

interface TaskTableProps {
  tasks: any[];
  canEditVehicles: boolean;
  userId?: string;
  onEditTask: (task: any) => void;
  onStatusChange: (taskId: string, status: string) => void;
  onDelete: (taskId: string) => void;
  isDeleting: boolean;
}

const TaskTable = ({ 
  tasks, 
  canEditVehicles, 
  userId,
  onEditTask, 
  onStatusChange, 
  onDelete, 
  isDeleting 
}: TaskTableProps) => {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-xs font-medium">Tarefa</TableHead>
            <TableHead className="text-xs font-medium">Responsável</TableHead>
            <TableHead className="text-xs font-medium">Prioridade</TableHead>
            <TableHead className="text-xs font-medium">Vencimento</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task) => (
            <TaskTableRow
              key={task.id}
              task={task}
              canEditVehicles={canEditVehicles}
              userId={userId}
              onEdit={onEditTask}
              onStatusChange={onStatusChange}
              onDelete={onDelete}
              isDeleting={isDeleting}
            />
          ))}
        </TableBody>
      </Table>
      
      {tasks.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground text-xs">Nenhuma tarefa encontrada</p>
        </div>
      )}
    </div>
  );
};

export default TaskTable;
