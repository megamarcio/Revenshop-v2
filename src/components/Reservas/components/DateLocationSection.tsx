
import React from 'react';
import { CalendarDays, MapPin, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface DateLocationSectionProps {
  pickUpDate: string;
  pickUpLocation: string;
  returnDate: string;
  returnLocation: string;
}

const DateLocationSection = ({ 
  pickUpDate, 
  pickUpLocation, 
  returnDate, 
  returnLocation 
}: DateLocationSectionProps) => {
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy', { locale: ptBR });
    } catch {
      return dateString;
    }
  };

  const formatTime = (dateString: string) => {
    try {
      return format(new Date(dateString), 'HH:mm', { locale: ptBR });
    } catch {
      return '';
    }
  };

  return (
    <div className="space-y-3">
      {/* Retirada */}
      <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
        <div className="flex items-center gap-3">
          <CalendarDays className="h-4 w-4 text-green-600" />
          <div>
            <div className="font-medium text-sm">Retirada</div>
            <div className="text-lg">{formatDate(pickUpDate)}</div>
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Clock className="h-3 w-3" />
            {formatTime(pickUpDate)}
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="h-3 w-3" />
          </div>
          <div className="text-sm font-medium max-w-[200px] text-right">
            {pickUpLocation}
          </div>
        </div>
      </div>

      {/* Devolução */}
      <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
        <div className="flex items-center gap-3">
          <CalendarDays className="h-4 w-4 text-red-600" />
          <div>
            <div className="font-medium text-sm">Devolução</div>
            <div className="text-lg">{formatDate(returnDate)}</div>
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Clock className="h-3 w-3" />
            {formatTime(returnDate)}
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="h-3 w-3" />
          </div>
          <div className="text-sm font-medium max-w-[200px] text-right">
            {returnLocation}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DateLocationSection;
