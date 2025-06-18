
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Trash2, User, Calendar, MapPin, Car } from 'lucide-react';
import { ReservationListItem } from '@/hooks/useReservationsList';

interface CompactReservationItemProps {
  reservation: ReservationListItem;
  onRemove: (id: string) => void;
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

const CompactReservationItem = ({ reservation, onRemove }: CompactReservationItemProps) => {
  if (reservation.loading) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm">Carregando reserva #{reservation.id}...</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onRemove(reservation.id)}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (reservation.error) {
    return (
      <Card className="border-red-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-red-500">⚠️</div>
              <div>
                <div className="text-sm font-medium text-red-700">
                  Erro ao carregar #{reservation.id}
                </div>
                <div className="text-xs text-red-600">{reservation.error}</div>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onRemove(reservation.id)}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!reservation.data) {
    return null;
  }

  const data = reservation.data;
  const kommoLink = `https://r3rentalcar.kommo.com/leads/detail/${data.customer.f855}`;
  const hqRentalLink = `https://r3-rental.us5.hqrentals.app/car-rental/reservations/step7?id=${data.reservation.id}`;

  return (
    <Card>
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Header com ID, Status e botão de remover */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Badge className={getStatusColor(data.reservation.status)}>
                {data.reservation.status}
              </Badge>
              <span className="text-sm text-muted-foreground">
                #{data.reservation.id}
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onRemove(reservation.id)}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          {/* Informações do cliente */}
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">{data.customer.first_name}</span>
            {data.customer.phone_number && (
              <span className="text-xs text-muted-foreground">
                ({data.customer.phone_number})
              </span>
            )}
          </div>

          {/* Datas */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3 text-muted-foreground" />
              <span>Pickup: {new Date(data.reservation.pick_up_date).toLocaleDateString('pt-BR')}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3 text-muted-foreground" />
              <span>Retorno: {new Date(data.reservation.return_date).toLocaleDateString('pt-BR')}</span>
            </div>
          </div>

          {/* Locais */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3 text-muted-foreground" />
              <span className="truncate">{data.reservation.pick_up_location_label}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3 text-muted-foreground" />
              <span className="truncate">{data.reservation.return_location_label}</span>
            </div>
          </div>

          {/* Veículo */}
          {data.vehicles?.[0]?.vehicle?.label && (
            <div className="flex items-center gap-1 text-xs">
              <Car className="h-3 w-3 text-muted-foreground" />
              <span>{data.vehicles[0].vehicle.label}</span>
            </div>
          )}

          {/* Botões de ação */}
          <div className="flex justify-end gap-2 pt-2 border-t">
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
            {data.customer.phone_number && (
              <Button 
                variant="outline" 
                size="sm" 
                asChild
                className="h-8 px-3 bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
              >
                <a 
                  href={`http://wa.me/${data.customer.phone_number}`} 
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
      </CardContent>
    </Card>
  );
};

export default CompactReservationItem;
