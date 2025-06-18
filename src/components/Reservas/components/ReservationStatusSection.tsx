
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { DollarSign } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface ReservationStatusSectionProps {
  status: string;
  reservationId: string | number;
  outstandingBalance: string;
  totalPrice?: string;
  phoneNumber?: string;
  hasSignature: boolean;
  lastName: string;
}

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'confirmed':
    case 'confirmada':
      return 'bg-green-100 text-green-800';
    case 'pending':
    case 'pendente':
      return 'bg-yellow-100 text-yellow-800';
    case 'cancelled':
    case 'cancelada':
      return 'bg-red-100 text-red-800';
    case 'open':
      return 'bg-blue-100 text-blue-800';
    case 'completed':
      return 'bg-green-100 text-green-800';
    case 'rental':
      return 'bg-purple-100 text-purple-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const ReservationStatusSection = ({ 
  status, 
  reservationId, 
  outstandingBalance,
  totalPrice,
  phoneNumber,
  hasSignature,
  lastName
}: ReservationStatusSectionProps) => {
  const shouldShowNoSign = !hasSignature && status.toLowerCase() !== 'quote';

  // Check if Last_Name contains Car Seat, Stroller, or Booster Seat
  const getChildEquipmentInfo = () => {
    const lastNameLower = lastName.toLowerCase();
    const equipments = [];
    
    // Check for Car Seat Badge
    // Não mostre se contém frases negativas
    const hasCarSeatNegative = lastNameLower.includes('no car seat') || 
                              lastNameLower.includes('nao preciso car seat');
    
    if (!hasCarSeatNegative) {
      // Mostre se tiver padrões específicos
      const hasCarSeatPattern = lastNameLower.includes('1x car seat') ||
                               lastNameLower.includes('2x car seat') ||
                               lastNameLower.includes('1x cadeirinha') ||
                               lastNameLower.includes('2x cadeirinhas');
      
      if (hasCarSeatPattern) {
        // Determinar se é Car Seat A ou B
        let carSeatType = 'Car Seat';
        if (lastNameLower.includes('car seat a') || lastNameLower.includes('cadeirinha a')) {
          carSeatType = 'Car Seat A';
        } else if (lastNameLower.includes('car seat b') || lastNameLower.includes('cadeirinha b')) {
          carSeatType = 'Car Seat B';
        }
        equipments.push({ type: carSeatType, color: 'bg-yellow-100 text-yellow-800' });
      }
    }
    
    // Check for Stroller Badge
    // Não mostre se contém frases negativas
    const hasStrollerNegative = lastNameLower.includes('no stroller') ||
                               lastNameLower.includes('nao preciso carrinho');
    
    if (!hasStrollerNegative) {
      // Mostre se tiver padrões específicos
      const hasStrollerPattern = lastNameLower.includes('1x stroller') ||
                                lastNameLower.includes('2x stroller') ||
                                lastNameLower.includes('1x carrinho') ||
                                lastNameLower.includes('2x carrinhos');
      
      if (hasStrollerPattern) {
        equipments.push({ type: 'Stroller', color: 'bg-green-100 text-green-800' });
      }
    }
    
    // Check for Booster Badge
    if (lastNameLower.includes('booster')) {
      equipments.push({ type: 'Booster', color: 'bg-purple-100 text-purple-800' });
    }
    
    return equipments;
  };

  const childEquipments = getChildEquipmentInfo();

  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Badge className={getStatusColor(status)}>
            {status}
          </Badge>
          {shouldShowNoSign && (
            <span className="text-xs bg-red-100 text-red-800 px-1.5 py-0.5 rounded">
              No Sign
            </span>
          )}
          {childEquipments.map((equipment, index) => (
            <span key={index} className={`text-xs px-1.5 py-0.5 rounded ${equipment.color}`}>
              {equipment.type}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>#{reservationId || 'N/A'}</span>
          {phoneNumber && (
            <span>({phoneNumber})</span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-1 text-lg font-semibold">
        <Tooltip>
          <TooltipTrigger asChild>
            <button className="hover:bg-gray-100 p-1 rounded">
              <DollarSign className="h-4 w-4" />
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Preço Total: {totalPrice || 'N/A'}</p>
          </TooltipContent>
        </Tooltip>
        {outstandingBalance}
      </div>
    </div>
  );
};

export default ReservationStatusSection;
