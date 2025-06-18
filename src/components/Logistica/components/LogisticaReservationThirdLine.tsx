
import React from 'react';
import { ReservationDetails } from '@/hooks/useReservationById';
import ReservationActionButtons from '@/components/Reservas/components/ReservationActionButtons';

interface LogisticaReservationThirdLineProps {
  data: ReservationDetails;
  vehicleName?: string;
}

const LogisticaReservationThirdLine = ({ data }: LogisticaReservationThirdLineProps) => {
  return (
    <div className="flex items-center gap-2">
      {data.customer.last_name && (
        <div className="flex items-center flex-1">
          <span className="text-[10px] font-bold text-red-600">{data.customer.last_name}</span>
        </div>
      )}
      
      <ReservationActionButtons data={data} />
    </div>
  );
};

export default LogisticaReservationThirdLine;
