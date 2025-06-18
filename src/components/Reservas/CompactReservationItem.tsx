import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Trash2, User, Calendar, MapPin, Car, DollarSign } from 'lucide-react';
import { ReservationListItem } from '@/hooks/useReservationsList';

interface CompactReservationItemProps {
  reservation: ReservationListItem;
  onRemove: (id: string) => void;
  onUpdateField: (id: string, field: 'temperature' | 'notes', value: string) => void;
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

const CompactReservationItem = ({ reservation, onRemove, onUpdateField }: CompactReservationItemProps) => {
  if (reservation.loading) {
    return (
      <Card>
        <CardContent className="p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm">Carregando reserva #{reservation.id}...</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onRemove(reservation.id)}
              className="text-red-600 hover:text-red-700 h-6 px-2"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (reservation.error) {
    return (
      <Card className="border-red-200">
        <CardContent className="p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
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
              className="text-red-600 hover:text-red-700 h-6 px-2"
            >
              <Trash2 className="h-3 w-3" />
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

  // Função para obter informações de equipamentos infantis
  const getChildEquipmentInfo = () => {
    const lastNameLower = data.customer.last_name.toLowerCase();
    const equipments = [];
    
    // Check for Car Seat Badge
    const hasCarSeatNegative = lastNameLower.includes('no car seat') || 
                              lastNameLower.includes('nao preciso car seat');
    
    if (!hasCarSeatNegative) {
      const hasCarSeatPattern = lastNameLower.includes('1x car seat') ||
                               lastNameLower.includes('2x car seat') ||
                               lastNameLower.includes('1x cadeirinha') ||
                               lastNameLower.includes('2x cadeirinhas');
      
      if (hasCarSeatPattern) {
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
    const hasStrollerNegative = lastNameLower.includes('no stroller') ||
                               lastNameLower.includes('nao preciso carrinho');
    
    if (!hasStrollerNegative) {
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
  const shouldShowNoSign = !data.reservation.signed_at && data.reservation.status.toLowerCase() !== 'quote';

  return (
    <Card>
      <CardContent className="p-3">
        {/* Linha 1: Status, ID, Cliente, Valor e Botão Remover */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 flex-1">
            <Badge className={getStatusColor(data.reservation.status)}>
              {data.reservation.status}
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
            <span className="text-xs text-muted-foreground">#{data.reservation.id}</span>
            <User className="h-3 w-3 text-muted-foreground" />
            <span className="text-sm font-medium truncate">{data.customer.first_name}</span>
            {data.customer.phone_number && (
              <span className="text-xs text-muted-foreground">({data.customer.phone_number})</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <DollarSign className="h-3 w-3 text-muted-foreground" />
              <span className="text-sm font-semibold">{data.reservation.outstanding_balance}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onRemove(reservation.id)}
              className="text-red-600 hover:text-red-700 h-6 px-2"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {/* Linha 2: Datas, Locais e Veículo */}
        <div className="flex items-center gap-4 mb-2 text-xs">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3 text-muted-foreground" />
            <span>{new Date(data.reservation.pick_up_date).toLocaleDateString('pt-BR')}</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="h-3 w-3 text-muted-foreground" />
            <span className="truncate max-w-[120px]">{data.reservation.pick_up_location_label}</span>
          </div>
          {data.vehicles?.[0]?.vehicle?.label && (
            <div className="flex items-center gap-1">
              <Car className="h-3 w-3 text-muted-foreground" />
              <span className="truncate max-w-[100px]">{data.vehicles[0].vehicle.label}</span>
            </div>
          )}
        </div>

        {/* Linha 3: Temperatura, Observações e Botões de Ação */}
        <div className="flex items-center gap-2">
          <Select 
            value={reservation.temperature || ''} 
            onValueChange={(value) => onUpdateField(reservation.id, 'temperature', value)}
          >
            <SelectTrigger className="w-24 h-7 text-xs">
              <SelectValue placeholder="Temp" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sol">Sol</SelectItem>
              <SelectItem value="quente">Quente</SelectItem>
              <SelectItem value="morno">Morno</SelectItem>
              <SelectItem value="frio">Frio</SelectItem>
              <SelectItem value="congelado">Congelado</SelectItem>
            </SelectContent>
          </Select>
          
          <Textarea
            placeholder="Observações..."
            value={reservation.notes || ''}
            onChange={(e) => onUpdateField(reservation.id, 'notes', e.target.value)}
            className="flex-1 h-7 min-h-7 max-h-7 text-xs resize-none"
          />
          
          <div className="flex gap-1">
            <Button 
              variant="outline" 
              size="sm" 
              asChild
              className="h-7 w-7 p-0"
            >
              <a href={hqRentalLink} target="_blank" rel="noopener noreferrer">
                <img 
                  src="/lovable-uploads/e3703660-4058-4893-918f-dbc178a72a69.png" 
                  alt="HQ Rental" 
                  className="h-3 w-3"
                />
              </a>
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              asChild
              className="h-7 w-7 p-0"
            >
              <a href={kommoLink} target="_blank" rel="noopener noreferrer">
                <img 
                  src="/lovable-uploads/de9684e1-1c0d-4484-9ed9-a0252882c9e4.png" 
                  alt="Kommo" 
                  className="h-3 w-3"
                />
              </a>
            </Button>
            {data.customer.phone_number && (
              <Button 
                variant="outline" 
                size="sm" 
                asChild
                className="h-7 w-7 p-0 bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
              >
                <a 
                  href={`http://wa.me/${data.customer.phone_number}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <img 
                    src="/lovable-uploads/e69b8938-5a38-4b74-b5c3-342f53c90e3c.png" 
                    alt="WhatsApp" 
                    className="h-3 w-3"
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
