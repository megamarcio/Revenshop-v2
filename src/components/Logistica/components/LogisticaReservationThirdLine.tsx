
import React from 'react';
import { ReservationDetails } from '@/hooks/useReservationById';
import ReservationActionButtons from '@/components/Reservas/components/ReservationActionButtons';

interface LogisticaReservationThirdLineProps {
  data: ReservationDetails;
  vehicleName?: string;
  cleanLabel?: string;
}

const LogisticaReservationThirdLine = ({ data, cleanLabel }: LogisticaReservationThirdLineProps) => {
  return (
    <div className="flex items-center gap-2">
      {cleanLabel && (
        <div className="flex items-center flex-1">
          <span className="text-[10px] font-bold text-red-600">{cleanLabel}</span>
        </div>
      )}
      
      <ReservationActionButtons data={data} />
    </div>
  );
};

export default LogisticaReservationThirdLine;
