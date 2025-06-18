
import React from 'react';
import { Car } from 'lucide-react';
import { ReservationDetails } from '@/hooks/useReservationById';
import ReservationActionButtons from '@/components/Reservas/components/ReservationActionButtons';

interface LogisticaReservationThirdLineProps {
  data: ReservationDetails;
  vehicleName?: string;
}

const LogisticaReservationThirdLine = ({ data, vehicleName }: LogisticaReservationThirdLineProps) => {
  return (
    <div className="flex items-center gap-2">
      {vehicleName && (
        <div className="flex items-center gap-1 flex-1">
          <Car className="h-3 w-3 text-blue-600" />
          <span className="text-xs text-blue-700">{vehicleName}</span>
        </div>
      )}
      
      <ReservationActionButtons data={data} />
    </div>
  );
};

export default LogisticaReservationThirdLine;
