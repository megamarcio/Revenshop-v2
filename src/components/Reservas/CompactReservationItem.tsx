
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X, Loader2, AlertCircle, User, MapPin, Calendar, DollarSign, Hash } from 'lucide-react';
import { ReservationListItem } from '@/hooks/useReservationsList';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface CompactReservationItemProps {
  reservation: ReservationListItem;
  onRemove: (id: string) => void;
}

const CompactReservationItem = ({ reservation, onRemove }: CompactReservationItemProps) => {
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd/MM/yy', { locale: ptBR });
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
      case 'quote':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
      case 'cancelada':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (reservation.loading) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
            <span className="font-semibold text-blue-900">#{reservation.id}</span>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onRemove(reservation.id)}
            className="h-6 w-6 p-0 text-gray-500 hover:text-red-500"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
        <div className="text-sm text-blue-600 mt-1">Carregando dados da reserva...</div>
      </div>
    );
  }

  if (reservation.error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <span className="font-semibold text-red-900">#{reservation.id}</span>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onRemove(reservation.id)}
            className="h-6 w-6 p-0 text-gray-500 hover:text-red-500"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
        <div className="text-sm text-red-600 mt-1">{reservation.error}</div>
      </div>
    );
  }

  if (!reservation.data) return null;

  const { data } = reservation;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-sm transition-shadow">
      {/* Linha 1: Cliente, Status e Saldo */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <User className="h-3 w-3 text-gray-500" />
            <span className="font-semibold text-gray-900 text-sm">
              {data.customer.first_name}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Hash className="h-3 w-3 text-gray-500" />
            <span className="text-xs text-gray-600">
              {data.customer.f855}
            </span>
          </div>
          <Badge className={`text-xs px-2 py-0.5 ${getStatusColor(data.reservation.status)}`}>
            {data.reservation.status}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <DollarSign className="h-3 w-3 text-green-600" />
            <span className="font-semibold text-green-700 text-sm">
              {data.reservation.outstanding_balance}
            </span>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onRemove(reservation.id)}
            className="h-6 w-6 p-0 text-gray-400 hover:text-red-500"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Linha 2: Datas e Locais */}
      <div className="flex items-center justify-between text-xs text-gray-600">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3 text-green-600" />
            <span>{formatDate(data.reservation.pick_up_date)}</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="h-3 w-3 text-green-600" />
            <span className="truncate max-w-[120px]">
              {data.reservation.pick_up_location_label}
            </span>
          </div>
        </div>
        <span className="text-gray-400">→</span>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3 text-red-600" />
            <span>{formatDate(data.reservation.return_date)}</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="h-3 w-3 text-red-600" />
            <span className="truncate max-w-[120px]">
              {data.reservation.return_location_label}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompactReservationItem;
