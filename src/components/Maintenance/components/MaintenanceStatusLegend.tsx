
import React from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Info } from 'lucide-react';

const MaintenanceStatusLegend = () => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-gray-100">
          <Info className="h-3 w-3 text-gray-500" />
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="max-w-xs p-3 bg-white border shadow-lg">
        <div className="space-y-2 text-xs">
          <h4 className="font-semibold text-gray-900 mb-2">Legenda dos Status:</h4>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span><strong>Em Aberto:</strong> Sem data prometida</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
            <span><strong>Pendente:</strong> Com data prometida</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span><strong>Concluída:</strong> Com data de reparo</span>
          </div>
        </div>
      </TooltipContent>
    </Tooltip>
  );
};

export default MaintenanceStatusLegend;
