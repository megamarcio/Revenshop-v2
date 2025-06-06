
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
  const { canEditVehicles, canViewAllTasks, user } = useAuth();
  const [filter, setFilter] = useState<'all' | 'pending' | 'in_progress' | 'completed'>('all');

  // Filter tasks based on user role
  const getFilteredTasks = () => {
    let filteredTasks = tasks;

    // If user cannot view all tasks, show only their own tasks
    if (!canViewAllTasks && user) {
      filteredTasks = tasks.filter(task => 
        task.assigned_to === user.id || task.created_by === user.id
      );
    }

    // Apply status filter
    if (filter !== 'all') {
      filteredTasks = filteredTasks.filter(task => task.status === filter);
    }

    // Apply limit if specified
    if (limit) {
      filteredTasks = filteredTasks.slice(0, limit);
    }

    return filteredTasks;
  };

  const filteredTasks = getFilteredTasks();

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
            <p className="text-muted-foreground">
              {!canViewAllTasks ? 'Nenhuma tarefa atribuída a você' : 'Nenhuma tarefa encontrada'}
            </p>
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
