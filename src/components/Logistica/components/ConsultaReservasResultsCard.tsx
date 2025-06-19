
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ReservationTable from './ReservationTable';
import { Reservation } from '../types/reservationTypes';

interface ConsultaReservasResultsCardProps {
  columnType: "pick_up_date" | "return_date";
  reservations: Reservation[];
  loading: boolean;
  error: string | null;
  rawApiData: any;
  rowKommoLeadIds: { [r: string]: string };
  onShareClick: (reservation: Reservation) => void;
}

const ConsultaReservasResultsCard: React.FC<ConsultaReservasResultsCardProps> = ({
  columnType,
  reservations,
  loading,
  error,
  rawApiData,
  rowKommoLeadIds,
  onShareClick,
}) => {
  // Definir badgeType baseado no columnType para mostrar a data correta nos resultados
  const badgeType = columnType === "pick_up_date" ? "pickup" : "return";

  return (
    <Card>
      <CardHeader className="p-3 sm:p-6">
        <CardTitle className="text-base sm:text-lg md:text-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <span>
            Resultados da Busca {columnType === "pick_up_date" ? "(por Check-in)" : "(por Return)"}
          </span>
          {reservations.length > 0 && (
            <span className="text-xs sm:text-sm font-normal text-muted-foreground">
              {reservations.length} reserva{reservations.length !== 1 ? 's' : ''} encontrada{reservations.length !== 1 ? 's' : ''}
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 sm:p-6 sm:pt-0">
        <ReservationTable
          reservations={reservations}
          loading={loading}
          error={error}
          rawApiData={rawApiData}
          rowKommoLeadIds={rowKommoLeadIds}
          badgeType={badgeType}
          onShareClick={onShareClick}
        />
      </CardContent>
    </Card>
  );
};

export default ConsultaReservasResultsCard;
