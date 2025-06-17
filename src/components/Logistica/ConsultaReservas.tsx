import React, { useState } from "react";
import { Reservation } from "./types/reservationTypes";
import { getTodayDateString } from "./utils/reservationUtils";
import { useReservationFetch } from "./hooks/useReservationFetch";
import ReservationFilters from "./components/ReservationFilters";
import ReservationTable from "./components/ReservationTable";
import ReservationWhatsAppModal from "./ReservationWhatsAppModal";
import LogisticaErrorBoundary from "./components/LogisticaErrorBoundary";

const ConsultaReservas: React.FC = () => {
  console.log('ConsultaReservas component mounting');
  
  const { fetchReservas } = useReservationFetch();

  // --------- FILTROS PICKUP DATE ---------
  const [dataInicioPickup, setDataInicioPickup] = useState(getTodayDateString());
  const [dataFimPickup, setDataFimPickup] = useState(getTodayDateString());
  const [loadingPickup, setLoadingPickup] = useState(false);
  const [reservationsPickup, setReservationsPickup] = useState<Reservation[]>([]);
  const [errorPickup, setErrorPickup] = useState<string | null>(null);
  const [rawApiDataPickup, setRawApiDataPickup] = useState<any | null>(null);
  const [lastRequestLogPickup, setLastRequestLogPickup] = useState<any | null>(null);
  const [rowKommoLeadIdsPickup, setRowKommoLeadIdsPickup] = useState<{ [reservationId: string]: string }>({});

  // --------- FILTROS RETURN DATE ---------
  const [dataInicioReturn, setDataInicioReturn] = useState(getTodayDateString());
  const [dataFimReturn, setDataFimReturn] = useState(getTodayDateString());
  const [loadingReturn, setLoadingReturn] = useState(false);
  const [reservationsReturn, setReservationsReturn] = useState<Reservation[]>([]);
  const [errorReturn, setErrorReturn] = useState<string | null>(null);
  const [rawApiDataReturn, setRawApiDataReturn] = useState<any | null>(null);
  const [lastRequestLogReturn, setLastRequestLogReturn] = useState<any | null>(null);
  const [rowKommoLeradIdsReturn, setRowKommoLeadIdsReturn] = useState<{ [reservationId: string]: string }>({});

  // --------- STATE PARA MODAL DE COMPARTILHAMENTO ---------
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [selectedReservationForShare, setSelectedReservationForShare] = useState<Reservation | null>(null);

  // DISPARADORES DOS DOIS TIPOS DE BUSCA
  const onBuscarPickup = async () => {
    try {
      console.log('Iniciando busca por Pickup Date:', { dataInicioPickup, dataFimPickup });
      setErrorPickup(null); // Limpar erro anterior
      
      await fetchReservas({
        dataIni: dataInicioPickup,
        dataFim: dataFimPickup,
        columnType: "pick_up_date",
        setLoading: setLoadingPickup,
        setReservations: setReservationsPickup,
        setError: setErrorPickup,
        setRawApiData: setRawApiDataPickup,
        setLastRequestLog: setLastRequestLogPickup,
        setRowKommoLeadIds: setRowKommoLeadIdsPickup,
      });
      console.log('Busca por Pickup Date concluída');
    } catch (error) {
      console.error('Erro na busca por Pickup Date:', error);
      setErrorPickup('Erro inesperado na busca. Tente novamente.');
      setLoadingPickup(false);
    }
  };

  const onBuscarReturn = async () => {
    try {
      console.log('Iniciando busca por Return Date:', { dataInicioReturn, dataFimReturn });
      setErrorReturn(null); // Limpar erro anterior
      
      await fetchReservas({
        dataIni: dataInicioReturn,
        dataFim: dataFimReturn,
        columnType: "return_date",
        setLoading: setLoadingReturn,
        setReservations: setReservationsReturn,
        setError: setErrorReturn,
        setRawApiData: setRawApiDataReturn,
        setLastRequestLog: setLastRequestLogReturn,
        setRowKommoLeadIds: setRowKommoLeadIdsReturn,
      });
      console.log('Busca por Return Date concluída');
    } catch (error) {
      console.error('Erro na busca por Return Date:', error);
      setErrorReturn('Erro inesperado na busca. Tente novamente.');
      setLoadingReturn(false);
    }
  };

  const handleOpenShareModal = (reservation: Reservation) => {
    try {
      console.log('Opening share modal for reservation:', reservation.id);
      setSelectedReservationForShare(reservation);
      setIsShareModalOpen(true);
    } catch (error) {
      console.error('Error opening share modal:', error);
    }
  };

  const handleCloseShareModal = () => {
    try {
      console.log('Closing share modal');
      setIsShareModalOpen(false);
      setSelectedReservationForShare(null);
    } catch (error) {
      console.error('Error closing share modal:', error);
    }
  };

  const createDownloadHandler = (log: any, filename: string) => () => {
    try {
      if (!log) {
        console.warn('No log data to download');
        return;
      }
      
      const jsonStr = JSON.stringify(log, null, 2);
      const blob = new Blob([jsonStr], { type: "application/json" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error('Error downloading log:', error);
    }
  };

  return (
    <LogisticaErrorBoundary>
      <div className="max-w-3xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-4">Consulta de Reservas</h1>
          <p className="text-gray-600 mb-6">
            Consulte reservas por data de pickup ou retorno
          </p>
        </div>

        {/* Seção Pickup Date */}
        <div className="mb-12">
          <LogisticaErrorBoundary>
            <ReservationFilters
              header="Consulta por Pickup Date"
              dataInicio={dataInicioPickup}
              setDataInicio={setDataInicioPickup}
              dataFim={dataFimPickup}
              setDataFim={setDataFimPickup}
              onBuscar={onBuscarPickup}
              loading={loadingPickup}
              lastRequestLog={lastRequestLogPickup}
              handleDownloadRequestLog={createDownloadHandler(lastRequestLogPickup, "log_requisicao_consulta_reservas_pickup.json")}
            />
          </LogisticaErrorBoundary>
          
          <LogisticaErrorBoundary>
            <ReservationTable
              error={errorPickup}
              rawApiData={rawApiDataPickup}
              reservations={reservationsPickup}
              rowKommoLeadIds={rowKommoLeadIdsPickup}
              badgeType="pickup"
              loading={loadingPickup}
              onShareClick={handleOpenShareModal}
            />
          </LogisticaErrorBoundary>
        </div>

        {/* Seção Return Date */}
        <div className="mb-12">
          <LogisticaErrorBoundary>
            <ReservationFilters
              header="Consulta por Return Date"
              dataInicio={dataInicioReturn}
              setDataInicio={setDataInicioReturn}
              dataFim={dataFimReturn}
              setDataFim={setDataFimReturn}
              onBuscar={onBuscarReturn}
              loading={loadingReturn}
              lastRequestLog={lastRequestLogReturn}
              handleDownloadRequestLog={createDownloadHandler(lastRequestLogReturn, "log_requisicao_consulta_reservas_return.json")}
            />
          </LogisticaErrorBoundary>
          
          <LogisticaErrorBoundary>
            <ReservationTable
              error={errorReturn}
              rawApiData={rawApiDataReturn}
              reservations={reservationsReturn}
              rowKommoLeadIds={rowKommoLeradIdsReturn}
              badgeType="return"
              loading={loadingReturn}
              onShareClick={handleOpenShareModal}
            />
          </LogisticaErrorBoundary>
        </div>

        {/* Modal de compartilhamento */}
        <LogisticaErrorBoundary>
          <ReservationWhatsAppModal
            isOpen={isShareModalOpen}
            onClose={handleCloseShareModal}
            reservationData={selectedReservationForShare}
          />
        </LogisticaErrorBoundary>
      </div>
    </LogisticaErrorBoundary>
  );
};

export default ConsultaReservas;
