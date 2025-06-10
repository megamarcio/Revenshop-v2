
import React from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';

interface DateSelectionFormProps {
  detectionDate?: Date;
  repairDate?: Date;
  onDetectionDateChange: (date: Date | undefined) => void;
  onRepairDateChange: (date: Date | undefined) => void;
}

const DateSelectionForm = ({
  detectionDate,
  repairDate,
  onDetectionDateChange,
  onRepairDateChange
}: DateSelectionFormProps) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label>Data de Detecção do Problema</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-start text-left">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {detectionDate ? format(detectionDate, 'dd/MM/yyyy') : 'Selecionar data'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={detectionDate}
              onSelect={onDetectionDateChange}
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-2">
        <Label>Data do Reparo</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-start text-left">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {repairDate ? format(repairDate, 'dd/MM/yyyy') : 'Selecionar data'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={repairDate}
              onSelect={onRepairDateChange}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default DateSelectionForm;
