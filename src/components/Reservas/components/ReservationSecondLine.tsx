import React from 'react';
import { Calendar, MapPin, Car, Clock } from 'lucide-react';
import { ReservationDetails } from '@/hooks/useReservationById';
import { extractFirstLocationName } from '../utils/reservationHelpers';

interface ReservationSecondLineProps {
  data: ReservationDetails;
  extraActions?: React.ReactNode;
}

const ReservationSecondLine = ({
  data,
  extraActions
}: ReservationSecondLineProps) => {
  const pickupLocationShort = extractFirstLocationName(data.reservation.pick_up_location_label);
  const returnLocationShort = extractFirstLocationName(data.reservation.return_location_label || data.reservation.pick_up_location_label);
  
  // Extract time from date strings if available
  const extractTimeFromDate = (dateString: string) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '';
      
      // Check if the original string contains time information
      if (dateString.includes('T') && dateString.includes(':')) {
        return date.toLocaleTimeString('pt-BR', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: false 
        });
      }
      return '';
    } catch {
      return '';
    }
  };

  const pickupTime = extractTimeFromDate(data.reservation.pick_up_date);
  const returnTime = extractTimeFromDate(data.reservation.return_date);
  
  // Format dates for display
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '';
      return date.toLocaleDateString('pt-BR');
    } catch {
      return '';
    }
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 text-xs gap-2">
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 flex-1 min-w-0">
        <div className="flex items-center gap-1">
          <Calendar className="h-3 w-3 text-green-600 flex-shrink-0" />
          <span className="text-green-700">Check-in:</span>
          <span className="truncate">{formatDate(data.reservation.pick_up_date)}</span>
          {pickupTime && (
            <>
              <Clock className="h-3 w-3 text-green-600 ml-1 flex-shrink-0" />
              <span className="text-green-700">{pickupTime}</span>
            </>
          )}
        </div>
        <div className="flex items-center gap-1">
          <Calendar className="h-3 w-3 text-red-600 flex-shrink-0" />
          <span className="text-red-700">Return:</span>
          <span className="truncate">{formatDate(data.reservation.return_date)}</span>
          {returnTime && (
            <>
              <Clock className="h-3 w-3 text-red-600 ml-1 flex-shrink-0" />
              <span className="text-red-700">{returnTime}</span>
            </>
          )}
        </div>
        <div className="flex items-center gap-1">
          <MapPin className="h-3 w-3 text-green-600 flex-shrink-0" />
          <span className="text-green-700 truncate max-w-[60px] sm:max-w-[80px]">{pickupLocationShort}</span>
        </div>
        <div className="flex items-center gap-1">
          <MapPin className="h-3 w-3 text-red-600 flex-shrink-0" />
          <span className="text-red-700 truncate max-w-[60px] sm:max-w-[80px]">{returnLocationShort}</span>
        </div>
        {data.selected_vehicle_class?.vehicle_class?.label && (
          <div className="flex items-center gap-1">
            <Car className="h-3 w-3 text-blue-600 flex-shrink-0" />
            <span className="text-blue-700 truncate max-w-[80px] sm:max-w-[100px]">{data.selected_vehicle_class.vehicle_class.label}</span>
          </div>
        )}
        {data.vehicles?.[0]?.vehicle?.label && (
          <span className="truncate max-w-[80px] sm:max-w-[100px]">{data.vehicles[0].vehicle.label}</span>
        )}
      </div>
      {extraActions && (
        <div className="flex items-center self-end sm:self-auto">
          {extraActions}
        </div>
      )}
    </div>
  );
};

export default ReservationSecondLine;