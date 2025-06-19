
import React from 'react';
import { ReservationDetails } from '@/hooks/useReservationById';
import ReservationActionButtons from '@/components/Reservas/components/ReservationActionButtons';

interface LogisticaReservationThirdLineProps {
  data: ReservationDetails;
  vehicleName?: string;
  cleanLabel?: string;
}

const LogisticaReservationThirdLine = ({
  data,
  cleanLabel
}: LogisticaReservationThirdLineProps) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
      {cleanLabel && (
        <div className="flex-1 min-w-0">
          <span className="text-gray-700 text-xs font-semibold break-words">
            {cleanLabel}
          </span>
        </div>
      )}
      
      <div className="shrink-0">
        <ReservationActionButtons data={data} />
      </div>
    </div>
  );
};

export default LogisticaReservationThirdLine;
