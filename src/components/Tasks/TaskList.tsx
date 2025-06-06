
import React, { useState } from 'react';
import { useTasks } from '../../hooks/useTasks';
import { useAuth } from '../../contexts/AuthContext';
import TaskListFilter from './TaskListFilter';
import TaskCard from './TaskCard';
import TaskTable from './TaskTable';

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

  if (compact) {
    return (
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Nenhuma tarefa encontrada</p>
          </div>
        ) : (
          filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={onEditTask}
            />
          ))
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <TaskListFilter filter={filter} onFilterChange={setFilter} />
      
      <TaskTable
        tasks={filteredTasks}
        canEditVehicles={canEditVehicles}
        userId={user?.id}
        onEditTask={onEditTask}
        onStatusChange={handleStatusChange}
        onDelete={handleDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default TaskList;
