
import React from 'react';
import { MapPin, Calendar } from 'lucide-react';
import { ReservationDetails } from '@/hooks/useReservationById';

interface ReservationSecondLineProps {
  data: ReservationDetails;
}

const ReservationSecondLine = ({ data }: ReservationSecondLineProps) => {
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('pt-BR');
    } catch {
      return dateString;
    }
  };

  return (
    <div className="space-y-2">
      {/* Nome do cliente */}
      <div className="flex items-center gap-2">
        <span className="font-medium text-sm text-gray-700">Cliente:</span>
        <span className="text-sm font-medium text-gray-900">
          {data.customer.first_name} {data.customer.last_name}
        </span>
      </div>
      
      {/* Datas */}
      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <Calendar className="h-3 w-3" />
          <span>Retirada: {formatDate(data.reservation.pick_up_date)}</span>
        </div>
        <div className="flex items-center gap-1">
          <Calendar className="h-3 w-3" />
          <span>Devolução: {formatDate(data.reservation.return_date)}</span>
        </div>
      </div>
      
      {/* Locais */}
      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <MapPin className="h-3 w-3" />
          <span className="truncate">
            {data.reservation.pick_up_location_label}
          </span>
        </div>
        {data.reservation.return_location_label !== data.reservation.pick_up_location_label && (
          <div className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            <span className="truncate">
              {data.reservation.return_location_label}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReservationSecondLine;
