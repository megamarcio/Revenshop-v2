
import React from 'react';
import { Badge } from '@/components/ui/badge';
import ReservationBadges from '@/components/Logistica/components/ReservationBadges';
import { LocationBadge } from '@/components/Logistica/LocationBadge';
import { ParsedReservationData, getLocationFromString } from '../utils/reservationDataParser';

interface ReservationBadgesDisplayProps {
  parsedData: ParsedReservationData;
}

const ReservationBadgesDisplay = ({ parsedData }: ReservationBadgesDisplayProps) => {
  const pickupLocationBadge = getLocationFromString(parsedData.pickupLocation);
  const returnLocationBadge = getLocationFromString(parsedData.returnLocation);
  
  return (
    <div className="flex flex-wrap gap-1 mt-1">
      {/* Badges de localização */}
      {pickupLocationBadge && (
        <div className="flex items-center gap-1">
          <span className="text-[8px] text-gray-500">In:</span>
          <LocationBadge location={pickupLocationBadge} />
        </div>
      )}
      
      {returnLocationBadge && returnLocationBadge !== pickupLocationBadge && (
        <div className="flex items-center gap-1">
          <span className="text-[8px] text-gray-500">Out:</span>
          <LocationBadge location={returnLocationBadge} />
        </div>
      )}
      
      {/* Badges de equipamentos */}
      {parsedData.carSeat && (
        <Badge className="bg-blue-500 text-white text-[8px] font-bold px-1 py-0.5 h-4">
          Car Seat
        </Badge>
      )}
      
      {parsedData.stroller && (
        <Badge className="bg-yellow-500 text-black text-[8px] font-bold px-1 py-0.5 h-4">
          Stroller
        </Badge>
      )}
      
      {/* Badge de assinatura */}
      {parsedData.signStatus && parsedData.signStatus.toLowerCase().includes('não') && (
        <Badge className="bg-red-500 text-white text-[8px] font-bold px-1 py-0.5 h-4">
          Sign
        </Badge>
      )}
      
      {/* Badges usando o componente existente ReservationBadges */}
      <ReservationBadges rawText={parsedData.rawMetadata} />
    </div>
  );
};

export default ReservationBadgesDisplay;
