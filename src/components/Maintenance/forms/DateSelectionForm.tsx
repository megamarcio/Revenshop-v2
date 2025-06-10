
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { CalendarIcon, X } from 'lucide-react';
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
  return (
    <Card>
      <CardHeader>
        <CardTitle>Datas da Manutenção</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Data de Detecção */}
          <div className="space-y-2">
            <Label>Data de Detecção *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !detectionDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {detectionDate ? format(detectionDate, 'dd/MM/yyyy', { locale: ptBR }) : 'Selecionar data'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={detectionDate}
                  onSelect={onDetectionDateChange}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Data Prometida */}
          <div className="space-y-2">
            <Label>Data Prometida</Label>
            <div className="flex gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "flex-1 justify-start text-left font-normal",
                      !promisedDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {promisedDate ? format(promisedDate, 'dd/MM/yyyy', { locale: ptBR }) : 'Selecionar data'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={promisedDate}
                    onSelect={onPromisedDateChange}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
              {promisedDate && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onPromisedDateChange(undefined)}
                  className="h-10 w-10 text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Data de Reparo */}
          <div className="space-y-2">
            <Label>Data de Reparo</Label>
            <div className="flex gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "flex-1 justify-start text-left font-normal",
                      !repairDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {repairDate ? format(repairDate, 'dd/MM/yyyy', { locale: ptBR }) : 'Selecionar data'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={repairDate}
                    onSelect={onRepairDateChange}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
              {repairDate && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onRepairDateChange(undefined)}
                  className="h-10 w-10 text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="text-sm text-gray-600 space-y-1">
          <p>• <strong>Data de Detecção:</strong> Campo obrigatório - data em que o problema foi identificado</p>
          <p>• <strong>Data Prometida:</strong> Data prometida para conclusão do reparo (opcional)</p>
          <p>• <strong>Data de Reparo:</strong> Data em que o reparo foi concluído (obrigatório apenas para status "Concluída")</p>
          <p>• <strong>Botão X:</strong> Remove a data selecionada</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default DateSelectionForm;
