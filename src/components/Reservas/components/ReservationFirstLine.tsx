
import React from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { ReservationDetails } from '@/hooks/useReservationById';
import { getTemperatureIndicator } from '../utils/reservationHelpers';

interface ReservationFirstLineProps {
  data: ReservationDetails;
  temperature?: string;
  onRemove: (id: string) => void;
  extraActions?: React.ReactNode;
}

const ReservationFirstLine = ({ data, temperature, onRemove, extraActions }: ReservationFirstLineProps) => {
  const temperatureIndicator = getTemperatureIndicator(temperature || '');

  return (
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center gap-2 flex-1">
        <span className="font-medium text-sm">{data.reservation.confirmation_number}</span>
        {temperature && (
          <span className="text-xs px-1.5 py-0.5 rounded text-white" style={{ backgroundColor: temperatureIndicator.color }}>
            {temperatureIndicator.emoji} {temperatureIndicator.label}
          </span>
        )}
      </div>
      
      <div className="flex items-center gap-1">
        {extraActions}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onRemove(data.reservation.id)}
          className="h-7 w-7 p-0 text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
          title="Remover"
        >
          <X className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
};

export default ReservationFirstLine;
