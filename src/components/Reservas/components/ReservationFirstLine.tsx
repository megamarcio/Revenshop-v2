import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { User, Trash2 } from 'lucide-react';
import { ReservationDetails } from '@/hooks/useReservationById';
import { getStatusColor, getTemperatureIndicator, getChildEquipmentInfo, getLogisticaBadges } from '../utils/reservationHelpers';

interface ReservationFirstLineProps {
  data: ReservationDetails;
  temperature?: string;
  onRemove: (id: string) => void;
  isLogistica?: boolean;
}

const ReservationFirstLine = ({ data, temperature, onRemove, isLogistica = false }: ReservationFirstLineProps) => {
  const hasPhoneNumber = data.customer.phone_number && data.customer.phone_number.trim() !== '';
  const childEquipments = getChildEquipmentInfo(data.customer.last_name);
  const logisticaBadges = isLogistica ? getLogisticaBadges(data.customer.last_name, data.customer.label) : [];
  const shouldShowNoSign = !data.reservation.signed_at && data.reservation.status.toLowerCase() !== 'quote';
  const temperatureIndicator = getTemperatureIndicator(temperature || '');

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-2">
      <div className="flex flex-wrap items-center gap-1 sm:gap-2 flex-1 min-w-0">
        <Badge className={`${getStatusColor(data.reservation.status)} text-xs px-2 py-1`}>
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
        {logisticaBadges.map((badge, index) => (
          <span key={`logistica-${index}`} className={`text-xs px-1.5 py-0.5 rounded ${badge.color}`}>
            {badge.text}
          </span>
        ))}
        {temperature && (
          <span className={`text-xs px-1.5 py-0.5 rounded ${temperatureIndicator.color}`}>
            {temperatureIndicator.emoji} {temperature}
          </span>
        )}
        <span className="text-xs text-muted-foreground">#{data.reservation.id}</span>
        <User className="h-3 w-3 text-muted-foreground flex-shrink-0" />
        <span className="text-sm font-medium truncate min-w-0">{data.customer.first_name}</span>
        {hasPhoneNumber && (
          <span className="text-xs text-muted-foreground truncate">{data.customer.phone_number}</span>
        )}
      </div>
      <div className="flex items-center gap-1 sm:gap-2 self-end sm:self-auto">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onRemove(data.reservation.id?.toString() || '')}
          className="text-red-600 hover:text-red-700 h-6 px-2 text-xs"
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
};

export default ReservationFirstLine;
