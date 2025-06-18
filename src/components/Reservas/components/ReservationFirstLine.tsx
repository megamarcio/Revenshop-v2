
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { User, DollarSign, Trash2 } from 'lucide-react';
import { ReservationDetails } from '@/hooks/useReservationById';
import { getStatusColor, getTemperatureIndicator, getChildEquipmentInfo } from '../utils/reservationHelpers';

interface ReservationFirstLineProps {
  data: ReservationDetails;
  temperature?: string;
  onRemove: (id: string) => void;
}

const ReservationFirstLine = ({ data, temperature, onRemove }: ReservationFirstLineProps) => {
  const hasPhoneNumber = data.customer.phone_number && data.customer.phone_number.trim() !== '';
  const childEquipments = getChildEquipmentInfo(data.customer.last_name);
  const shouldShowNoSign = !data.reservation.signed_at && data.reservation.status.toLowerCase() !== 'quote';
  const temperatureIndicator = getTemperatureIndicator(temperature || '');

  return (
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center gap-2 flex-1">
        <Badge className={getStatusColor(data.reservation.status)}>
          {data.reservation.status}
        </Badge>
        {shouldShowNoSign && (
          <span className="text-xs bg-red-100 text-red-800 px-1.5 py-0.5 rounded">
            No Sign
          </span>
        )}
        {childEquipments.map((equipment, index) => (
          <span key={index} className={`text-xs px-1.5 py-0.5 rounded ${equipment.color}`}>
            {equipment.type}
          </span>
        ))}
        {temperature && (
          <span className={`text-xs px-1.5 py-0.5 rounded ${temperatureIndicator.color}`}>
            {temperatureIndicator.emoji} {temperature}
          </span>
        )}
        <span className="text-xs text-muted-foreground">#{data.reservation.id}</span>
        <User className="h-3 w-3 text-muted-foreground" />
        <span className="text-sm font-medium truncate">{data.customer.first_name}</span>
        {hasPhoneNumber && (
          <span className="text-xs text-muted-foreground">({data.customer.phone_number})</span>
        )}
      </div>
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          <DollarSign className="h-3 w-3 text-muted-foreground" />
          <span className="text-sm font-semibold">{data.reservation.outstanding_balance}</span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onRemove(data.reservation.id?.toString() || '')}
          className="text-red-600 hover:text-red-700 h-6 px-2"
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
};

export default ReservationFirstLine;
