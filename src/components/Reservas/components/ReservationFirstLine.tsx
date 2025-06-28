import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { User, Trash2 } from 'lucide-react';
import { ReservationDetails } from '@/hooks/useReservationById';
import { getStatusColor, getTemperatureIndicator, getChildEquipmentInfo, getLogisticaBadges } from '../utils/reservationHelpers';
import ReservationActionButtons from './ReservationActionButtons';

interface ReservationFirstLineProps {
  data: ReservationDetails;
  temperature?: string;
  onRemove: (id: string) => void;
  isLogistica?: boolean;
  extraActions?: React.ReactNode;
}

const ReservationFirstLine = ({ data, temperature, onRemove, isLogistica = false, extraActions }: ReservationFirstLineProps) => {
  const hasPhoneNumber = data.customer.phone_number && data.customer.phone_number.trim() !== '';
  const childEquipments = getChildEquipmentInfo(data.customer.last_name);
  const logisticaBadges = isLogistica ? getLogisticaBadges(data.customer.last_name, data.customer.label) : [];
  const shouldShowNoSign = !data.reservation.signed_at && data.reservation.status.toLowerCase() !== 'quote';

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-2">
      <div className="flex flex-wrap items-center gap-1 sm:gap-2 flex-1 min-w-0">
        <Badge className={`${getStatusColor(data.reservation.status)} text-xs px-2 py-1`}>
          {data.reservation.status}
        </Badge>
        <span className="text-sm font-semibold truncate">{data.customer.first_name}</span>
        {hasPhoneNumber && (
          <span className="text-xs text-muted-foreground truncate">{data.customer.phone_number}</span>
        )}
      </div>
      <div className="flex items-center gap-1 sm:gap-2 self-end sm:self-auto">
        <ReservationActionButtons data={data} />
        {extraActions}
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
