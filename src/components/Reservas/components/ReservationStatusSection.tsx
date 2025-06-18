
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { DollarSign } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface ReservationStatusSectionProps {
  status: string;
  reservationId: string | number;
  outstandingBalance: string;
  totalPrice?: string;
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
  totalPrice
}: ReservationStatusSectionProps) => {
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-3">
        <Badge className={getStatusColor(status)}>
          {status}
        </Badge>
        <span className="text-sm text-muted-foreground">
          #{reservationId || 'N/A'}
        </span>
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
