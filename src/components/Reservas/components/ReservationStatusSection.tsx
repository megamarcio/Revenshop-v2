
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { DollarSign } from 'lucide-react';

interface ReservationStatusSectionProps {
  status: string;
  reservationId: string | number;
  outstandingBalance: string;
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
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const ReservationStatusSection = ({ 
  status, 
  reservationId, 
  outstandingBalance 
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
        <DollarSign className="h-4 w-4" />
        {outstandingBalance}
      </div>
    </div>
  );
};

export default ReservationStatusSection;
