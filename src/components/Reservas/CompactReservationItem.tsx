
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ReservationListItem } from '@/hooks/useReservationsList';
import { getTemperatureIndicator } from './utils/reservationHelpers';
import ReservationLoadingState from './components/ReservationLoadingState';
import ReservationErrorState from './components/ReservationErrorState';
import ReservationFirstLine from './components/ReservationFirstLine';
import ReservationSecondLine from './components/ReservationSecondLine';
import ReservationThirdLine from './components/ReservationThirdLine';

interface CompactReservationItemProps {
  reservation: ReservationListItem;
  onRemove: (id: string) => void;
  onUpdateField: (id: string, field: 'temperature' | 'notes', value: string) => void;
  extraActions?: React.ReactNode;
}

const CompactReservationItem = ({ reservation, onRemove, onUpdateField, extraActions }: CompactReservationItemProps) => {
  if (reservation.loading) {
    return <ReservationLoadingState reservationId={reservation.id} onRemove={onRemove} />;
  }

  if (reservation.error) {
    return (
      <ReservationErrorState 
        reservationId={reservation.id} 
        error={reservation.error} 
        onRemove={onRemove} 
      />
    );
  }

  if (!reservation.data) {
    return null;
  }

  const data = reservation.data;
  const temperatureIndicator = getTemperatureIndicator(reservation.temperature || '');

  return (
    <Card style={{ backgroundColor: reservation.temperature ? temperatureIndicator.bgColor : undefined }}>
      <CardContent className="p-3">
        <ReservationFirstLine 
          data={data} 
          temperature={reservation.temperature} 
          onRemove={onRemove} 
          extraActions={extraActions}
        />
        
        <ReservationSecondLine data={data} />
        
        <ReservationThirdLine 
          data={data} 
          temperature={reservation.temperature} 
          notes={reservation.notes} 
          onUpdateField={onUpdateField} 
          reservationId={reservation.id} 
        />
      </CardContent>
    </Card>
  );
};

export default CompactReservationItem;
