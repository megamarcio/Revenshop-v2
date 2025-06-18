
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, MapPin, User, DollarSign, Hash } from 'lucide-react';
import { ReservationDetails } from '@/hooks/useReservationById';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ReservationDetailsCardProps {
  reservation: ReservationDetails;
}

const ReservationDetailsCard = ({ reservation }: ReservationDetailsCardProps) => {
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy', { locale: ptBR });
    } catch {
      return dateString;
    }
  };

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

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Detalhes da Reserva - {reservation.customer.first_name}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Status e Saldo */}
        <div className="flex justify-between items-center">
          <Badge className={getStatusColor(reservation.reservation.status)}>
            {reservation.reservation.status}
          </Badge>
          <div className="flex items-center gap-1 text-lg font-semibold">
            <DollarSign className="h-4 w-4" />
            {reservation.reservation.outstanding_balance}
          </div>
        </div>

        {/* Informações do Cliente */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Cliente:</span>
              <span>{reservation.customer.first_name}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Hash className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Kommo Lead ID:</span>
              <span>{reservation.customer.f855}</span>
            </div>
          </div>
        </div>

        {/* Datas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-green-600" />
              <span className="font-medium">Data de Retirada:</span>
            </div>
            <div className="pl-6 text-lg">
              {formatDate(reservation.reservation.pick_up_date)}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-red-600" />
              <span className="font-medium">Data de Devolução:</span>
            </div>
            <div className="pl-6 text-lg">
              {formatDate(reservation.reservation.return_date)}
            </div>
          </div>
        </div>

        {/* Locais */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-green-600" />
              <span className="font-medium">Local de Retirada:</span>
            </div>
            <div className="pl-6">
              {reservation.reservation.pick_up_location_label}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-red-600" />
              <span className="font-medium">Local de Devolução:</span>
            </div>
            <div className="pl-6">
              {reservation.reservation.return_location_label}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReservationDetailsCard;
