
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import TaskList from './TaskList';
import TaskForm from './TaskForm';
import { useTasks } from '../../hooks/useTasks';
import { useAuth } from '../../contexts/AuthContext';

const TaskManagement = () => {
  const { canEditVehicles } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const { tasks } = useTasks();

  const handleAddTask = () => {
    setEditingTask(null);
    setShowForm(true);
  };

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

  const pendingTasks = tasks.filter(task => task.status === 'pending').length;
  const inProgressTasks = tasks.filter(task => task.status === 'in_progress').length;
  const completedTasks = tasks.filter(task => task.status === 'completed').length;

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                Gerenciamento de Tarefas
              </CardTitle>
              <p className="text-gray-600">Organize e delegue tarefas relacionadas aos veículos</p>
              
              <div className="flex gap-4 mt-4 text-sm">
                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded">
                  {pendingTasks} Pendentes
                </span>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">
                  {inProgressTasks} Em Andamento
                </span>
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded">
                  {completedTasks} Concluídas
                </span>
              </div>
            </div>
            {canEditVehicles && (
              <Button 
                onClick={handleAddTask}
                className="bg-revenshop-primary hover:bg-revenshop-primary/90"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nova Tarefa
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <TaskList onEditTask={handleEditTask} />
        </CardContent>
      </Card>
    </div>
  );
};

export default TaskManagement;
