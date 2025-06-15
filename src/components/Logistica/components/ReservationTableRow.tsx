
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Phone, Share2 } from "lucide-react";
import { LocationBadge } from "../LocationBadge";
import { Reservation } from "../types/reservationTypes";
import { formatDateTime, getLocationBadge, getExtraItemBadges } from "../utils/reservationUtils";

interface ReservationTableRowProps {
  reservation: Reservation;
  badgeType: "pickup" | "return";
  kommoLeadId?: string;
  onShareClick: (reservation: Reservation) => void;
  index: number;
}

const ReservationTableRow: React.FC<ReservationTableRowProps> = ({
  reservation,
  badgeType,
  kommoLeadId,
  onShareClick,
  index,
}) => {
  const pickup = formatDateTime(reservation.pickup_date);
  const ret = formatDateTime(reservation.return_date);
  const cleanedPhone = (reservation.phone_number || "-").replace(/\D/g, "");
  const badgeText = getLocationBadge(reservation.customer_last_name, badgeType) as "Mco" | "Fort" | "Mia" | "Tampa" | null;
  const extraItemBadges = getExtraItemBadges(reservation.customer_last_name);

  return (
    <tr key={reservation.reservation_id + index} className="border-t align-top">
      {/* Reservation ID + phone_number */}
      <td className="px-4 py-2 align-middle" style={{ fontSize: 13, fontWeight: 700 }}>
        {reservation.reservation_id}
        <div style={{ fontSize: 11, color: "#757575", fontWeight: 400, marginTop: 2 }}>
          {reservation.phone_number || "-"}
        </div>
      </td>
      
      {/* Customer First Name + Last Name + BADGE */}
      <td className="px-4 py-2">
        <div style={{ display: "flex", alignItems: "center", gap: 4, flexWrap: "wrap" }}>
          <span style={{ display: "block", fontSize: 12, fontWeight: 600 }}>
            {reservation.customer_first_name}
          </span>
          <LocationBadge location={badgeText} />
          {extraItemBadges.map((badge) => (
            <Badge
              key={badge.text}
              variant="secondary"
              className={`
                ${badge.text === 'Carrinho'
                  ? 'bg-lime-400 text-black border-lime-400'
                  : badge.text === 'Cadeirinha'
                  ? 'bg-purple-600 text-white border-purple-600'
                  : badge.type === 'alert'
                  ? 'bg-red-500 text-white border-red-500'
                  : 'bg-[#2563eb] text-white border-[#2563eb]'
                }
                font-bold h-auto py-0 px-2
              `}
              style={{ fontSize: '7px' }}
            >
              {badge.text}
            </Badge>
          ))}
        </div>
        <span style={{ display: "block", fontSize: 10, color: "#757575" }}>
          {reservation.customer_last_name}
        </span>
      </td>
      
      {/* Pickup */}
      <td className="px-4 py-2">
        <div className="flex flex-col">
          <span className="font-semibold text-sm">{pickup.date}</span>
          <span className="text-muted-foreground text-xs">{pickup.time}</span>
        </div>
      </td>
      
      {/* Return */}
      <td className="px-4 py-2">
        <div className="flex flex-col">
          <span className="font-semibold text-sm">{ret.date}</span>
          <span className="text-muted-foreground text-xs">{ret.time}</span>
        </div>
      </td>
      
      {/* Veículo - plate */}
      <td className="px-4 py-2 align-middle" style={{ fontSize: 13 }}>
        {reservation.plate || "-"}
      </td>
      
      {/* Botão para abrir reserva */}
      <td className="px-2 py-2 align-middle">
        <Button
          size="icon"
          variant="ghost"
          onClick={() => window.open(`https://r3-rental.us5.hqrentals.app/car-rental/reservations/step3?id=${encodeURIComponent(reservation.reservation_id)}`, '_blank')}
          title="Abrir reserva do cliente"
          aria-label="Abrir reserva do cliente"
          tabIndex={0}
          className="h-8 w-8"
        >
          <ExternalLink className="w-4 h-4" />
        </Button>
      </td>
      
      {/* Botão WhatsApp */}
      <td className="px-2 py-2 align-middle">
        {cleanedPhone && cleanedPhone !== "-" ? (
          <Button
            asChild
            size="icon"
            variant="ghost"
            className="h-8 w-8 text-green-600"
            title="Enviar mensagem no WhatsApp"
            aria-label="Enviar mensagem no WhatsApp"
            tabIndex={0}
          >
            <a
              href={`http://wa.me/${cleanedPhone}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Phone className="w-4 h-4" />
            </a>
          </Button>
        ) : null}
      </td>
      
      {/* Botão Kommo */}
      <td className="px-2 py-2 align-middle">
        {kommoLeadId ? (
          <Button
            asChild
            size="icon"
            variant="ghost"
            className="h-8 w-8 text-blue-600 hover:text-blue-800"
            title="Ver lead no Kommo"
            aria-label="Ver lead no Kommo"
            tabIndex={0}
          >
            <a
              href={`https://r3rentalcar.kommo.com/leads/detail/${encodeURIComponent(kommoLeadId)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </Button>
        ) : (
          <Button
            size="icon"
            variant="ghost"
            disabled
            className="h-8 w-8 text-gray-300"
            title="Lead Kommo não encontrado"
          >
            <ExternalLink className="w-4 h-4" />
          </Button>
        )}
      </td>
      
      {/* Botão de compartilhar */}
      <td className="px-2 py-2 align-middle">
        <Button
          size="icon"
          variant="ghost"
          onClick={() => onShareClick(reservation)}
          title="Compartilhar reserva no WhatsApp"
          aria-label="Compartilhar reserva no WhatsApp"
          tabIndex={0}
          className="h-8 w-8"
        >
          <Share2 className="w-4 h-4 text-gray-600" />
        </Button>
      </td>
    </tr>
  );
};

export default ReservationTableRow;
