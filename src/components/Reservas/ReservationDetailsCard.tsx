
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CalendarDays, MapPin, User, DollarSign, Hash, Clock, ExternalLink, MessageCircle } from 'lucide-react';
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

  const formatTime = (dateString: string) => {
    try {
      return format(new Date(dateString), 'HH:mm', { locale: ptBR });
    } catch {
      return '';
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

  const kommoLink = `https://r3rentalcar.kommo.com/leads/detail/${reservation.customer.f855}`;

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

        {/* Informações do Cliente e Links */}
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
              <Button 
                variant="outline" 
                size="sm" 
                asChild
                className="h-6 px-2"
              >
                <a href={kommoLink} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-3 w-3 mr-1" />
                  Kommo
                </a>
              </Button>
            </div>
          </div>

          {/* Botão WhatsApp */}
          <div className="flex justify-end">
            {reservation.customer.phone_number && (
              <Button 
                variant="outline" 
                size="sm" 
                asChild
                className="bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
              >
                <a 
                  href={`http://wa.me/${reservation.customer.phone_number}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  WhatsApp
                </a>
              </Button>
            )}
          </div>
        </div>

        {/* Datas e Horários */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-green-600" />
              <span className="font-medium">Data de Retirada:</span>
            </div>
            <div className="pl-6 space-y-1">
              <div className="text-lg">
                {formatDate(reservation.reservation.pick_up_date)}
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Clock className="h-3 w-3" />
                {formatTime(reservation.reservation.pick_up_date)}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-red-600" />
              <span className="font-medium">Data de Devolução:</span>
            </div>
            <div className="pl-6 space-y-1">
              <div className="text-lg">
                {formatDate(reservation.reservation.return_date)}
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Clock className="h-3 w-3" />
                {formatTime(reservation.reservation.return_date)}
              </div>
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
