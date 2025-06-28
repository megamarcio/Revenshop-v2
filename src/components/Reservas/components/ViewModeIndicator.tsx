import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Grid, List } from 'lucide-react';
import { ViewMode } from '@/hooks/useViewMode';

interface ViewModeIndicatorProps {
  viewMode: ViewMode;
  onToggle: () => void;
  className?: string;
}

const ViewModeIndicator = ({ viewMode, onToggle, className = '' }: ViewModeIndicatorProps) => {
  const isCompact = viewMode === 'compact';

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Badge 
        variant={isCompact ? "secondary" : "default"}
        className="cursor-pointer transition-all duration-200 hover:scale-105"
        onClick={onToggle}
      >
        <div className="flex items-center gap-1">
          {isCompact ? (
            <>
              <List className="h-3 w-3" />
              <span className="text-xs">Compacto</span>
            </>
          ) : (
            <>
              <Grid className="h-3 w-3" />
              <span className="text-xs">Detalhado</span>
            </>
          )}
        </div>
      </Badge>
      
      {/* Indicador visual adicional */}
      <div className="flex items-center gap-1 text-xs text-muted-foreground">
        <div className={`w-2 h-2 rounded-full transition-all duration-300 ${
          isCompact ? 'bg-blue-500' : 'bg-green-500'
        }`} />
        <span className="transition-all duration-300">
          {isCompact ? 'Visualização compacta' : 'Visualização detalhada'}
        </span>
      </div>
    </div>
  );
};

export default ViewModeIndicator; 