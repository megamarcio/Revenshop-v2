
import React from 'react';
import { Button } from '@/components/ui/button';

interface TaskListFilterProps {
  filter: 'all' | 'pending' | 'in_progress' | 'completed';
  onFilterChange: (filter: 'all' | 'pending' | 'in_progress' | 'completed') => void;
}

const TaskListFilter = ({ filter, onFilterChange }: TaskListFilterProps) => {
  const filterOptions = [
    { key: 'all', label: 'Todas' },
    { key: 'pending', label: 'Pendentes' },
    { key: 'in_progress', label: 'Em Andamento' },
    { key: 'completed', label: 'Concluídas' }
  ];

  return (
    <div className="flex gap-2">
      {filterOptions.map((option) => (
        <Button
          key={option.key}
          variant={filter === option.key ? 'default' : 'outline'}
          size="sm"
          onClick={() => onFilterChange(option.key as any)}
        >
          {option.label}
        </Button>
      ))}
    </div>
  );
};

export default TaskListFilter;
