
import React from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Info } from 'lucide-react';

const MaintenanceStatusLegend = () => {
  return (
    <div className="fixed top-20 left-6 z-50">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" size="sm" className="h-8 w-8 p-0 bg-white shadow-md border border-gray-300 hover:bg-gray-50">
            <Info className="h-4 w-4 text-gray-600" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right" className="max-w-xs p-4 bg-white border shadow-lg">
          <div className="space-y-3 text-sm">
            <h4 className="font-semibold text-gray-900 mb-3">Legenda dos Status:</h4>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
              <span><strong>Em Aberto:</strong> Sem data prometida</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
              <span><strong>Pendente:</strong> Com data prometida</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
              <span><strong>Concluída:</strong> Com data de reparo</span>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </div>
  );
};

export default MaintenanceStatusLegend;
