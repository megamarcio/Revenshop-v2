
import React from 'react';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { User } from 'lucide-react';

interface ReservationHeaderProps {
  customerName: string;
}

const ReservationHeader = ({ customerName }: ReservationHeaderProps) => {
  return (
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <User className="h-5 w-5" />
        Detalhes da Reserva - {customerName}
      </CardTitle>
    </CardHeader>
  );
};

export default ReservationHeader;
