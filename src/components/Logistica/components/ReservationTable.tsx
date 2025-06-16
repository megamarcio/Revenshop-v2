
import React from "react";
import { Button } from "@/components/ui/button";
import { Reservation } from "../types/reservationTypes";
import { getOrderedReservations } from "../utils/reservationUtils";
import ReservationTableRow from "./ReservationTableRow";

interface ReservationTableProps {
  error: string | null;
  rawApiData: any;
  reservations: Reservation[];
  rowKommoLeadIds: { [r: string]: string };
  badgeType: "pickup" | "return";
  loading: boolean;
  onShareClick: (reservation: Reservation) => void;
}

const ReservationTable: React.FC<ReservationTableProps> = ({
  error,
  rawApiData,
  reservations,
  rowKommoLeadIds,
  badgeType,
  loading,
  onShareClick,
}) => {
  const orderedReservations = getOrderedReservations(reservations, badgeType);

  return (
    <>
      {error && <div className="text-red-500 mb-3">{error}</div>}

      {rawApiData && (
        <div className="mb-4">
          <Button
            variant="secondary"
            onClick={() => {
              const jsonStr = JSON.stringify(rawApiData, null, 2);
              const blob = new Blob([jsonStr], { type: "application/json" });
              const link = document.createElement("a");
              link.href = URL.createObjectURL(blob);
              link.download = "reservas.json";
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              URL.revokeObjectURL(link.href);
            }}
          >
            Baixar JSON do Resultado
          </Button>
        </div>
      )}

      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Resultados</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full border divide-y divide-gray-200">
            <thead>
              <tr className="bg-muted">
                <th className="px-4 py-2 text-left" style={{ fontSize: 13, fontWeight: 600 }}>
                  Reserva&nbsp;
                </th>
                <th className="px-4 py-2 text-left" style={{ fontSize: 13 }}>
                  Nome do Cliente
                </th>
                <th className="px-4 py-2 text-left" style={{ fontSize: 13 }}>
                  Pickup
                </th>
                <th className="px-4 py-2 text-left" style={{ fontSize: 13 }}>
                  Retorno
                </th>
                <th className="px-4 py-2 text-left" style={{ fontSize: 13 }}>
                  Veículo
                </th>
                <th className="px-2 py-2"></th>
                <th className="px-2 py-2"></th>
                <th className="px-2 py-2"></th>
                <th className="px-2 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {orderedReservations.length === 0 && !loading ? (
                <tr>
                  <td colSpan={9} className="px-4 py-3 text-center text-muted-foreground">
                    Nenhum resultado.
                  </td>
                </tr>
              ) : (
                orderedReservations.map((reservation, idx) => (
                  <ReservationTableRow
                    key={reservation.reservation_id + idx}
                    reservation={reservation}
                    badgeType={badgeType}
                    kommoLeadId={rowKommoLeadIds[reservation.reservation_id]}
                    onShareClick={onShareClick}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default ReservationTable;
