
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { CalendarDays, MapPin, User, DollarSign, Clock, ExternalLink, MessageCircle, Info, Building2 } from 'lucide-react';
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

  const shouldShowPlate = () => {
    const status = reservation.reservation.status.toLowerCase();
    return status === 'open' || status === 'rental' || status === 'completed';
  };

  const getVehicleLabel = () => {
    return reservation.reservation.vehicles?.vehicle?.label || 'N/A';
  };

  const getVehicleClassLabel = () => {
    return reservation.reservation.vehicle?.vehicle_class?.label || 
           reservation.vehicle_class?.label || 'N/A';
  };

  const getVehiclePlate = () => {
    return reservation.reservation.vehicles?.vehicle?.plate || 
           reservation.vehicle?.plate || 'N/A';
  };

  const kommoLink = `https://r3rentalcar.kommo.com/leads/detail/${reservation.customer.f855}`;
  const hqRentalLink = `https://r3-rental.us5.hqrentals.app/car-rental/reservations/step7?id=${reservation.reservation.id}`;

  return (
    <TooltipProvider>
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Detalhes da Reserva - {reservation.customer.first_name}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Status, Número da Reserva e Saldo */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Badge className={getStatusColor(reservation.reservation.status)}>
                {reservation.reservation.status}
              </Badge>
              <span className="text-sm text-muted-foreground">
                #{reservation.reservation.id || 'N/A'}
              </span>
            </div>
            <div className="flex items-center gap-1 text-lg font-semibold">
              <DollarSign className="h-4 w-4" />
              {reservation.reservation.outstanding_balance}
            </div>
          </div>

          {/* Informações do Cliente e Botões */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Cliente:</span>
                <span>{reservation.customer.first_name}</span>
                {reservation.customer.phone_number && (
                  <span className="text-sm text-muted-foreground">
                    ({reservation.customer.phone_number})
                  </span>
                )}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-5 w-5 p-0">
                      <Info className="h-3 w-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Nome completo: {reservation.customer.first_name} {reservation.customer.last_name}</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>

            {/* Botões HQ Rental, Kommo e WhatsApp */}
            <div className="flex justify-end gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                asChild
                className="h-8 px-3"
              >
                <a href={hqRentalLink} target="_blank" rel="noopener noreferrer">
                  <img 
                    src="/lovable-uploads/e3703660-4058-4893-918f-dbc178a72a69.png" 
                    alt="HQ Rental" 
                    className="h-4 w-4"
                  />
                </a>
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                asChild
                className="h-8 px-3"
              >
                <a href={kommoLink} target="_blank" rel="noopener noreferrer">
                  <img 
                    src="/lovable-uploads/de9684e1-1c0d-4484-9ed9-a0252882c9e4.png" 
                    alt="Kommo" 
                    className="h-4 w-4"
                  />
                </a>
              </Button>
              {reservation.customer.phone_number && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  asChild
                  className="h-8 px-3 bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
                >
                  <a 
                    href={`http://wa.me/${reservation.customer.phone_number}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <img 
                      src="/lovable-uploads/e69b8938-5a38-4b74-b5c3-342f53c90e3c.png" 
                      alt="WhatsApp" 
                      className="h-4 w-4"
                    />
                  </a>
                </Button>
              )}
            </div>
          </div>

          {/* Datas e Locais - Layout Compacto */}
          <div className="space-y-3">
            {/* Retirada */}
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-3">
                <CalendarDays className="h-4 w-4 text-green-600" />
                <div>
                  <div className="font-medium text-sm">Retirada</div>
                  <div className="text-lg">{formatDate(reservation.reservation.pick_up_date)}</div>
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {formatTime(reservation.reservation.pick_up_date)}
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                </div>
                <div className="text-sm font-medium max-w-[200px] text-right">
                  {reservation.reservation.pick_up_location_label}
                </div>
              </div>
            </div>

            {/* Devolução */}
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
              <div className="flex items-center gap-3">
                <CalendarDays className="h-4 w-4 text-red-600" />
                <div>
                  <div className="font-medium text-sm">Devolução</div>
                  <div className="text-lg">{formatDate(reservation.reservation.return_date)}</div>
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {formatTime(reservation.reservation.return_date)}
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                </div>
                <div className="text-sm font-medium max-w-[200px] text-right">
                  {reservation.reservation.return_location_label}
                </div>
              </div>
            </div>

            {/* Classe do Veículo */}
            <div className="p-3 bg-blue-50 rounded-lg">
              <div className="text-sm text-muted-foreground">Classe do Veículo</div>
              <div className="font-medium">{getVehicleClassLabel()}</div>
            </div>

            {/* Veículo Selecionado */}
            <div className="p-3 bg-purple-50 rounded-lg">
              <div className="text-sm text-muted-foreground">Veículo Selecionado</div>
              <div className="font-medium">{getVehicleLabel()}</div>
            </div>

            {/* Placa do Veículo */}
            {shouldShowPlate() && (
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="text-sm text-muted-foreground">Placa</div>
                <div className="font-medium">{getVehiclePlate()}</div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};

export default ReservationDetailsCard;
