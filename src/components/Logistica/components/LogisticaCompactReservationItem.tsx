
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Share } from 'lucide-react';
import { Reservation } from '../types/reservationTypes';
import { mapLogisticaToReservationFormat } from '../utils/logisticaDataMapper';
import ReservationFirstLine from '@/components/Reservas/components/ReservationFirstLine';
import ReservationSecondLine from '@/components/Reservas/components/ReservationSecondLine';
import ReservationThirdLine from '@/components/Reservas/components/ReservationThirdLine';

interface LogisticaCompactReservationItemProps {
  reservation: Reservation;
  kommoLeadId?: string;
  onShareClick: (reservation: Reservation) => void;
}

const LogisticaCompactReservationItem = ({ 
  reservation, 
  kommoLeadId, 
  onShareClick 
}: LogisticaCompactReservationItemProps) => {
  const mappedReservation = mapLogisticaToReservationFormat(reservation, kommoLeadId);
  
  const handleRemove = () => {
    // Not applicable for Logística - this is read-only data
  };
  
  const handleUpdateField = () => {
    // Not applicable for Logística - this is read-only data
  };

  const shareButton = (
    <Button
      variant="outline"
      size="sm"
      onClick={() => onShareClick(reservation)}
      className="h-7 w-7 p-0 text-blue-600 hover:text-blue-700"
    >
      <Share className="h-3 w-3" />
    </Button>
  );

  return (
    <Card>
      <CardContent className="p-3">
        <ReservationFirstLine 
          data={mappedReservation.data} 
          temperature={mappedReservation.temperature} 
          onRemove={handleRemove} 
        />
        
        <ReservationSecondLine 
          data={mappedReservation.data} 
          extraActions={shareButton}
        />
        
        <ReservationThirdLine 
          data={mappedReservation.data} 
          temperature={mappedReservation.temperature} 
          notes={mappedReservation.notes} 
          onUpdateField={handleUpdateField} 
          reservationId={mappedReservation.id} 
        />
      </CardContent>
    </Card>
  );
};

export default LogisticaCompactReservationItem;
