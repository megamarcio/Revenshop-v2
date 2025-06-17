
import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Reservation } from "../types/reservationTypes";
import { formatToAmericanDateTime } from "../utils/dateFormatter";

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

  // Extract the specific fields as requested
  const id = reservation.id || 'N/A';
  const customerLabel = reservation.customer?.label || 'N/A';
  const phoneNumber = reservation.customer?.phone_number || 'N/A';
  const pickupDate = formatToAmericanDateTime(reservation.pick_up_date);
  const returnDate = formatToAmericanDateTime(reservation.return_date);
  const plate = reservation.reservation_vehicle_information?.plate || 'N/A';

  return (
    <TableRow className="hover:bg-muted/50">
      <TableCell className="text-[10px] font-bold p-2">
        {id}
      </TableCell>
      
      <TableCell className="text-[10px] font-bold p-2">
        {customerLabel}
      </TableCell>
      
      <TableCell className="text-[10px] font-bold p-2">
        {phoneNumber}
      </TableCell>
      
      <TableCell className="text-[10px] font-bold p-2">
        {pickupDate}
      </TableCell>
      
      <TableCell className="text-[10px] font-bold p-2">
        {returnDate}
      </TableCell>
      
      <TableCell className="text-[10px] font-bold p-2">
        {plate}
      </TableCell>
    </TableRow>
  );
};

export default ReservationTableRow;
