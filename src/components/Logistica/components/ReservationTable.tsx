
import React from "react";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { Reservation } from "../types/reservationTypes";
import { getOrderedReservations } from "../utils/reservationUtils";
import LogisticaCompactReservationItem from "./LogisticaCompactReservationItem";

interface ReservationTableProps {
  error: string | null;
  rawApiData: any;
  reservations: Reservation[];
  rowKommoLeadIds: { [r: string]: string };
  badgeType: "pickup" | "return";
  loading: boolean;
  onShareClick: (reservation: Reservation) => void;
  onGeneratePDF?: () => void;
}

const ReservationTable: React.FC<ReservationTableProps> = ({
  error,
  rawApiData,
  reservations,
  rowKommoLeadIds,
  badgeType,
  loading,
  onShareClick,
  onGeneratePDF,
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
        <div className="mb-4 flex gap-2">
          <Button
            variant="secondary"
            onClick={handleDownloadJson}
          >
            Baixar JSON do Resultado
          </Button>
          
          {onGeneratePDF && (
            <Button
              variant="outline"
              onClick={onGeneratePDF}
              className="flex items-center gap-2"
            >
              <FileText className="h-4 w-4" />
              Gerar PDF Logística
            </Button>
          )}
        </div>
      )}

      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-4">Resultados</h3>
        
        {orderedReservations.length === 0 ? (
          <div className="flex flex-col items-center text-muted-foreground py-8">
            <div className="text-4xl mb-2">📋</div>
            <p className="text-lg font-medium">Nenhum resultado encontrado</p>
            <p className="text-sm">Tente ajustar os filtros de data</p>
          </div>
        ) : (
          <div className="space-y-3">
            {orderedReservations.map((reservation, idx) => {
              try {
                return (
                  <LogisticaCompactReservationItem
                    key={`${reservation.id}-${idx}`}
                    reservation={reservation}
                    kommoLeadId={rowKommoLeadIds[reservation.id]}
                    onShareClick={onShareClick}
                  />
                );
              } catch (error) {
                console.error('Error rendering reservation card:', error, { reservation, idx });
                return (
                  <div key={`error-${idx}`} className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="text-red-700 text-sm">
                      Erro ao carregar reserva #{reservation.id || idx}
                    </div>
                  </div>
                );
              }
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReservationTable;
