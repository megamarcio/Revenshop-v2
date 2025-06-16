
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";
import { Reservation } from "../types/reservationTypes";
import { LocationBadge } from "../LocationBadge";
import { adjustTimeForFlorida, formatDateTimeForFlorida } from "../utils/reservationUtils";

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
  const formatDateTime = (dateStr: string, timeStr: string) => {
    if (!dateStr) return "N/A";
    
    let displayTime = "N/A";
    if (timeStr) {
      // Ajusta o horário para +4h (fuso da Flórida)
      displayTime = adjustTimeForFlorida(timeStr);
    }
    
    const date = new Date(dateStr);
    const formattedDate = date.toLocaleDateString("pt-BR");
    
    return `${formattedDate} ${displayTime}`;
  };

  const formatCurrency = (amount: number | string) => {
    const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "USD",
    }).format(numAmount || 0);
  };

  return (
    <tr className="border-b hover:bg-gray-50">
      <td className="px-4 py-3">
        <div className="font-medium text-blue-600">
          #{reservation.confirmation || reservation.reservation_id}
        </div>
        {kommoLeadId && (
          <div className="text-xs text-gray-500 mt-1">
            Lead: {kommoLeadId}
          </div>
        )}
      </td>
      
      <td className="px-4 py-3">
        <div className="font-medium">{reservation.renter_name || `${reservation.customer_first_name} ${reservation.customer_last_name}`.trim()}</div>
        <div className="text-sm text-gray-600">{reservation.renter_email}</div>
        <div className="text-sm text-gray-600">{reservation.renter_phone || reservation.phone_number}</div>
      </td>
      
      <td className="px-4 py-3">
        <div className="flex flex-col gap-1">
          <Badge variant={badgeType === "pickup" ? "default" : "secondary"}>
            {badgeType === "pickup" ? "Retirada" : "Devolução"}
          </Badge>
          <div className="text-sm">
            {formatDateTime(
              badgeType === "pickup" ? (reservation.pick_up_date || reservation.pickup_date) : reservation.return_date,
              badgeType === "pickup" ? reservation.pick_up_time : reservation.return_time
            )}
          </div>
        </div>
      </td>
      
      <td className="px-4 py-3">
        <div className="space-y-1">
          <LocationBadge 
            location={badgeType === "pickup" ? reservation.pick_up_location : reservation.return_location} 
          />
          {reservation.vehicle_category && (
            <div className="text-sm text-gray-600">
              Categoria: {reservation.vehicle_category}
            </div>
          )}
        </div>
      </td>
      
      <td className="px-4 py-3">
        <div className="text-right">
          <div className="font-medium">
            {formatCurrency(reservation.total_cost || 0)}
          </div>
          {reservation.daily_rate && (
            <div className="text-sm text-gray-600">
              Diária: {formatCurrency(reservation.daily_rate)}
            </div>
          )}
        </div>
      </td>
      
      <td className="px-4 py-3">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onShareClick(reservation)}
            className="flex items-center gap-1"
          >
            <Share2 className="h-3 w-3" />
            Compartilhar
          </Button>
        </div>
      </td>
    </tr>
  );
};

export default ReservationTableRow;
