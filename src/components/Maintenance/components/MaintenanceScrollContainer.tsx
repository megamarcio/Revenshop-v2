import React from 'react';
import { cn } from '@/lib/utils';

interface MaintenanceScrollContainerProps {
  children: React.ReactNode;
  className?: string;
  maxHeight?: string;
}

const MaintenanceScrollContainer: React.FC<MaintenanceScrollContainerProps> = ({
  children,
  className,
  maxHeight = "max-h-60"
}) => {
  return (
    <div 
      className={cn(
        "overflow-y-auto overflow-x-hidden border rounded-lg p-4",
        "-webkit-overflow-scrolling-touch",
        "overscroll-behavior-contain",
        "touch-action-pan-y",
        maxHeight,
        className
      )}
      style={{
        WebkitOverflowScrolling: 'touch',
        overscrollBehavior: 'contain',
        touchAction: 'pan-y'
      }}
    >
      {children}
    </div>
  );
};

export default MaintenanceScrollContainer; 