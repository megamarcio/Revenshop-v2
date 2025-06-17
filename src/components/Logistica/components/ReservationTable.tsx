
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  console.log('ReservationTable rendering:', { 
    reservationsCount: reservations?.length, 
    badgeType, 
    loading, 
    error 
  });

  const orderedReservations = React.useMemo(() => {
    try {
      return getOrderedReservations(reservations, badgeType);
    } catch (error) {
      console.error('Error ordering reservations:', error);
      return [];
    }
  }, [reservations, badgeType]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Buscando reservas...</p>
        </div>
      </div>
    );
  }

  const handleDownloadJson = () => {
    try {
      if (!rawApiData) return;
      
      const jsonStr = JSON.stringify(rawApiData, null, 2);
      const blob = new Blob([jsonStr], { type: "application/json" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "reservas.json";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error('Error downloading JSON:', error);
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="text-red-500 mr-2">⚠️</div>
            <div className="text-red-700">{error}</div>
          </div>
        </div>
      )}

      {rawApiData && (
        <div className="mb-4">
          <Button
            variant="secondary"
            onClick={handleDownloadJson}
          >
            Baixar JSON do Resultado
          </Button>
        </div>
      )}

      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-4">Resultados</h3>
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-[10px] font-bold">ID</TableHead>
                <TableHead className="text-[10px] font-bold">Cliente</TableHead>
                <TableHead className="text-[10px] font-bold">Telefone</TableHead>
                <TableHead className="text-[10px] font-bold">Data Pickup</TableHead>
                <TableHead className="text-[10px] font-bold">Data Retorno</TableHead>
                <TableHead className="text-[10px] font-bold">Placa</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orderedReservations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <div className="flex flex-col items-center text-muted-foreground">
                      <div className="text-4xl mb-2">📋</div>
                      <p className="text-lg font-medium">Nenhum resultado encontrado</p>
                      <p className="text-sm">Tente ajustar os filtros de data</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                orderedReservations.map((reservation, idx) => {
                  try {
                    return (
                      <ReservationTableRow
                        key={`${reservation.id}-${idx}`}
                        reservation={reservation}
                        badgeType={badgeType}
                        kommoLeadId={rowKommoLeadIds[reservation.id]}
                        onShareClick={onShareClick}
                      />
                    );
                  } catch (error) {
                    console.error('Error rendering reservation row:', error, { reservation, idx });
                    return (
                      <TableRow key={`error-${idx}`}>
                        <TableCell colSpan={6} className="text-center py-4 text-red-600 text-[10px] font-bold">
                          Erro ao carregar reserva #{reservation.id || idx}
                        </TableCell>
                      </TableRow>
                    );
                  }
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default ReservationTable;
