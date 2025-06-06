
import React, { useState } from 'react';
import { useTasks } from '../../hooks/useTasks';
import { CheckSquare, Clock, AlertTriangle } from 'lucide-react';
import TaskForm from '../Tasks/TaskForm';
import TaskList from '../Tasks/TaskList';

const PendingTasks = () => {
  const { tasks, loading } = useTasks();
  const [editingTask, setEditingTask] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const pendingTasks = tasks.filter(task => 
    task.status === 'pending' || task.status === 'in_progress'
  );

  const handleEditTask = (task: any) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingTask(null);
  };

  if (showForm) {
    return (
      <TaskForm 
        task={editingTask}
        onSave={handleCloseForm}
        onCancel={handleCloseForm}
      />
    );
  }

  if (loading) {
    return (
      <div className="bg-card rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
          <CheckSquare className="h-5 w-5" />
          Tarefas Pendentes
        </h2>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center space-x-3 p-3 bg-muted rounded-lg animate-pulse">
              <div className="bg-gray-300 p-2 rounded-full w-8 h-8"></div>
              <div className="flex-1">
                <div className="bg-gray-300 h-4 rounded mb-1"></div>
                <div className="bg-gray-300 h-3 rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (pendingTasks.length === 0) {
    return (
      <div className="bg-card rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
          <CheckSquare className="h-5 w-5" />
          Tarefas Pendentes
        </h2>
        <div className="text-center py-8">
          <CheckSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Nenhuma tarefa pendente!</p>
          <p className="text-sm text-muted-foreground mt-1">Todas as tarefas estão em dia.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
        <CheckSquare className="h-5 w-5" />
        Tarefas Pendentes
        <span className="text-sm bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
          {pendingTasks.length}
        </span>
      </h2>
      
      <TaskList 
        onEditTask={handleEditTask} 
        compact={true} 
        limit={5}
      />
      
      {pendingTasks.length > 5 && (
        <div className="mt-4 pt-4 border-t">
          <p className="text-sm text-muted-foreground text-center">
            E mais {pendingTasks.length - 5} tarefas...
          </p>
        </div>
      )}
    </div>
  );
};

export default PendingTasks;
