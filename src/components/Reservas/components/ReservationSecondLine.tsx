
import React from 'react';
import { MapPin, Calendar, User } from 'lucide-react';
import { ReservationDetails } from '@/hooks/useReservationById';
import { parseReservationMetadata } from '../utils/reservationDataParser';
import ReservationBadgesDisplay from './ReservationBadgesDisplay';

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

  // Parsear os dados da reserva
  const parsedData = parseReservationMetadata(data.customer);

  return (
    <div className="space-y-2">
      {/* Nome do cliente - usando apenas o first_name real */}
      <div className="flex items-center gap-2">
        <User className="h-3 w-3 text-gray-500" />
        <span className="text-sm font-medium text-gray-900">
          {parsedData.realFirstName}
        </span>
        {parsedData.confirmationNumber && (
          <span className="text-xs text-gray-500">
            #{parsedData.confirmationNumber}
          </span>
        )}
        {parsedData.duration && (
          <span className="text-xs text-gray-500">
            ({parsedData.duration})
          </span>
        )}
      </div>
      
      {/* Badges */}
      <ReservationBadgesDisplay parsedData={parsedData} />
      
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

      {/* Informações adicionais extraídas dos metadados */}
      <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
        {parsedData.vehicleType && (
          <span className="bg-gray-100 px-2 py-1 rounded text-gray-700">
            {parsedData.vehicleType}
          </span>
        )}
        {parsedData.passengers && (
          <span className="bg-blue-50 px-2 py-1 rounded text-blue-700">
            {parsedData.passengers}
          </span>
        )}
        {parsedData.observations && (
          <span className="bg-yellow-50 px-2 py-1 rounded text-yellow-700">
            Obs: {parsedData.observations}
          </span>
        )}
      </div>
    </div>
  );
};

export default ReservationSecondLine;
