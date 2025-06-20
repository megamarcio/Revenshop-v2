
import React from 'react';
import { MapPin, Car } from 'lucide-react';
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
  
  // Get vehicle information
  const vehicleName = data.vehicles?.[0]?.vehicle?.label || 'N/A';

  return (
    <div className="flex items-center justify-between mb-2 text-xs">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1">
          <MapPin className="h-3 w-3 text-green-600" />
          <span className="text-green-700 truncate max-w-[80px]">{pickupLocationShort}</span>
        </div>
        <div className="flex items-center gap-1">
          <MapPin className="h-3 w-3 text-red-600" />
          <span className="text-red-700 truncate max-w-[80px]">{returnLocationShort}</span>
        </div>
        {data.selected_vehicle_class?.vehicle_class?.label && (
          <div className="flex items-center gap-1">
            <Car className="h-3 w-3 text-blue-600" />
            <span className="text-blue-700 truncate max-w-[100px]">{data.selected_vehicle_class.vehicle_class.label}</span>
          </div>
        )}
        {vehicleName !== 'N/A' && (
          <div className="flex items-center gap-1">
            <Car className="h-3 w-3 text-purple-600" />
            <span className="text-purple-700 font-medium">{vehicleName}</span>
          </div>
        )}
      </div>
      {extraActions && (
        <div className="flex items-center">
          {extraActions}
        </div>
      )}
    </div>
  );
};

export default ReservationSecondLine;
