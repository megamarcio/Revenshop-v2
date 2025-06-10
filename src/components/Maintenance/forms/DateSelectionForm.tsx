import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { CalendarIcon, X, Info } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
interface DateSelectionFormProps {
  detectionDate?: Date;
  repairDate?: Date;
  promisedDate?: Date;
  onDetectionDateChange: (date: Date | undefined) => void;
  onRepairDateChange: (date: Date | undefined) => void;
  onPromisedDateChange: (date: Date | undefined) => void;
}
const DateSelectionForm = ({
  detectionDate,
  repairDate,
  promisedDate,
  onDetectionDateChange,
  onRepairDateChange,
  onPromisedDateChange
}: DateSelectionFormProps) => {
  return <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Datas da Manutenção
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" className="h-5 w-5 p-0 hover:bg-gray-100 px-[6px]">
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
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 rounded-sm bg-slate-50 px-0 mx-0 py-0 my-[8px]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Data de Detecção */}
          <div className="space-y-2">
            <Label>Data de Detecção *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !detectionDate && "text-muted-foreground")}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {detectionDate ? format(detectionDate, 'dd/MM/yyyy', {
                  locale: ptBR
                }) : 'Selecionar data'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={detectionDate} onSelect={onDetectionDateChange} initialFocus className="pointer-events-auto" />
              </PopoverContent>
            </Popover>
          </div>

          {/* Data Prometida */}
          <div className="space-y-2">
            <Label>Data Prometida</Label>
            <div className="flex gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("flex-1 justify-start text-left font-normal", !promisedDate && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {promisedDate ? format(promisedDate, 'dd/MM/yyyy', {
                    locale: ptBR
                  }) : 'Selecionar data'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={promisedDate} onSelect={onPromisedDateChange} initialFocus className="pointer-events-auto" />
                </PopoverContent>
              </Popover>
              {promisedDate && <Button variant="outline" size="icon" onClick={() => onPromisedDateChange(undefined)} className="h-10 w-10 text-red-600 hover:text-red-700 hover:bg-red-50">
                  <X className="h-4 w-4" />
                </Button>}
            </div>
          </div>

          {/* Data de Reparo */}
          <div className="space-y-2">
            <Label>Data de Reparo</Label>
            <div className="flex gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("flex-1 justify-start text-left font-normal", !repairDate && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {repairDate ? format(repairDate, 'dd/MM/yyyy', {
                    locale: ptBR
                  }) : 'Selecionar data'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={repairDate} onSelect={onRepairDateChange} initialFocus className="pointer-events-auto" />
                </PopoverContent>
              </Popover>
              {repairDate && <Button variant="outline" size="icon" onClick={() => onRepairDateChange(undefined)} className="h-10 w-10 text-red-600 hover:text-red-700 hover:bg-red-50">
                  <X className="h-4 w-4" />
                </Button>}
            </div>
          </div>
        </div>

        <div className="text-sm text-gray-600 space-y-1">
          
          
          
          
        </div>
      </CardContent>
    </Card>;
};
export default DateSelectionForm;