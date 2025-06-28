import React from 'react';
import { Button } from '@/components/ui/button';
import { LayoutGrid, List, Table } from 'lucide-react';
import { ViewMode } from '@/hooks/useViewPreferences';

interface ViewModeSelectorProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  className?: string;
}

const ViewModeSelector: React.FC<ViewModeSelectorProps> = ({
  viewMode,
  onViewModeChange,
  className = ''
}) => {
  const modes = [
    {
      key: 'card' as ViewMode,
      icon: LayoutGrid,
      label: 'Cards',
      tooltip: 'Visualização em cards'
    },
    {
      key: 'list' as ViewMode,
      icon: List,
      label: 'Lista',
      tooltip: 'Visualização em lista'
    },
    {
      key: 'table' as ViewMode,
      icon: Table,
      label: 'Tabela',
      tooltip: 'Visualização em tabela'
    }
  ];

  return (
    <div className={`flex items-center gap-1 border rounded-md ${className}`}>
      {modes.map((mode) => {
        const Icon = mode.icon;
        const isActive = viewMode === mode.key;
        
        return (
          <Button
            key={mode.key}
            variant={isActive ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onViewModeChange(mode.key)}
            title={mode.tooltip}
            className={`
              px-3 py-2 rounded-none first:rounded-l-md last:rounded-r-md
              ${isActive ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}
            `}
          >
            <Icon className="h-4 w-4" />
            <span className="ml-1 hidden sm:inline">{mode.label}</span>
          </Button>
        );
      })}
    </div>
  );
};

export default ViewModeSelector; 