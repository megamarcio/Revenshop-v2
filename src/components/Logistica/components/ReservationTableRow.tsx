
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { Share2 } from "lucide-react";
import { Reservation } from "../types/reservationTypes";
import { LocationBadge } from "../LocationBadge";
import { formatDateTimeForFlorida } from "../utils/reservationUtils";

interface ReservationTableRowProps {
  reservation: Reservation;
  kommoLeadId?: string;
  badgeType: "pickup" | "return";
  onShareClick: (reservation: Reservation) => void;
}

const ReservationTableRow: React.FC<ReservationTableRowProps> = ({
  reservation,
  kommoLeadId,
  badgeType,
  onShareClick,
}) => {
  console.log('ReservationTableRow rendering:', { reservation, badgeType });

  const formatDateTime = (dateStr: string, timeStr: string) => {
    try {
      if (!dateStr) return "N/A";
      
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) {
        console.warn('Invalid date:', dateStr);
        return "Data inválida";
      }
      
      if (timeStr) {
        const adjustedDateTime = `${dateStr}T${timeStr}`;
        return formatDateTimeForFlorida(adjustedDateTime);
      }
      
      return date.toLocaleDateString("pt-BR");
    } catch (error) {
      console.error('Error formatting date:', error, { dateStr, timeStr });
      return "Erro na data";
    }
  };

  // Helper function to normalize location values
  const normalizeLocation = (location: string | undefined): "Mco" | "Fort" | "Mia" | "Tampa" | null => {
    try {
      if (!location) return null;
      
      const normalized = location.toLowerCase();
      if (normalized.includes('mco') || normalized.includes('orlando')) return "Mco";
      if (normalized.includes('fort') || normalized.includes('lauderdale')) return "Fort";
      if (normalized.includes('mia') || normalized.includes('miami')) return "Mia";
      if (normalized.includes('tampa')) return "Tampa";
      
      return null;
    } catch (error) {
      console.error('Error normalizing location:', error, { location });
      return null;
    }
  };

  const safeHandleShare = () => {
    try {
      onShareClick(reservation);
    } catch (error) {
      console.error('Error in share click handler:', error);
    }
  };

  // Garantir que temos dados válidos
  const reservationId = reservation.confirmation || reservation.reservation_id || 'N/A';
  const customerName = reservation.renter_name || 
    `${reservation.customer_first_name || ''} ${reservation.customer_last_name || ''}`.trim() || 
    'Nome não disponível';
  const customerEmail = reservation.renter_email || 'Email não disponível';
  const customerPhone = reservation.renter_phone || reservation.phone_number || 'Telefone não disponível';

  return (
    <TableRow className="hover:bg-muted/50">
      <TableCell>
        <div className="space-y-1">
          <div className="font-semibold text-blue-600">
            #{reservationId}
          </div>
          {kommoLeadId && (
            <div className="text-xs text-muted-foreground">
              Lead: {kommoLeadId}
            </div>
          )}
        </div>
      </TableCell>
      
      <TableCell>
        <div className="space-y-1">
          <div className="font-medium">{customerName}</div>
          <div className="text-sm text-muted-foreground">{customerEmail}</div>
          <div className="text-sm text-muted-foreground">{customerPhone}</div>
        </div>
      </TableCell>
      
      <TableCell>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge variant="default" className="bg-blue-600 text-white hover:bg-blue-700">
              Retirada
            </Badge>
            <LocationBadge location={normalizeLocation(reservation.pick_up_location)} />
          </div>
          <div className="text-sm font-medium">
            {formatDateTime(
              reservation.pick_up_date || reservation.pickup_date,
              reservation.pick_up_time
            )}
          </div>
        </div>
      </TableCell>
      
      <TableCell>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-green-600 text-white hover:bg-green-700">
              Devolução
            </Badge>
            <LocationBadge location={normalizeLocation(reservation.return_location)} />
          </div>
          <div className="text-sm font-medium">
            {formatDateTime(
              reservation.return_date,
              reservation.return_time
            )}
          </div>
        </div>
      </TableCell>
      
      <TableCell>
        <div className="space-y-1">
          {reservation.vehicle_category && (
            <div className="text-sm font-medium">
              {reservation.vehicle_category}
            </div>
          )}
          {reservation.plate && (
            <div className="text-xs text-muted-foreground">
              Placa: {reservation.plate}
            </div>
          )}
        </div>
      </TableCell>
      
      <TableCell>
        <Button
          variant="outline"
          size="sm"
          onClick={safeHandleShare}
          className="flex items-center gap-2"
        >
          <Share2 className="h-4 w-4" />
          Compartilhar
        </Button>
      </TableCell>
    </TableRow>
  );
};

export default ReservationTableRow;
