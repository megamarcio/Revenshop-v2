
import React, { useState } from "react";
import { Reservation } from "./types/reservationTypes";
import { getTodayDateString } from "./utils/reservationUtils";
import { useReservationFetch } from "./hooks/useReservationFetch";
import ReservationFilters from "./components/ReservationFilters";
import ReservationTable from "./components/ReservationTable";
import ReservationWhatsAppModal from "./ReservationWhatsAppModal";

const ConsultaReservas: React.FC = () => {
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
  const [rowKommoLeadIdsReturn, setRowKommoLeadIdsReturn] = useState<{ [reservationId: string]: string }>({});

  // --------- STATE PARA MODAL DE COMPARTILHAMENTO ---------
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [selectedReservationForShare, setSelectedReservationForShare] = useState<Reservation | null>(null);

  // DISPARADORES DOS DOIS TIPOS DE BUSCA
  const onBuscarPickup = () =>
    fetchReservas({
      dataIni: dataInicioPickup,
      dataFim: dataFimPickup,
      columnType: "pick_up_date",
      setLoading: setLoadingPickup,
      setReservations: setReservationsPickup,
      setError: setErrorPickup,
      set: setRawApiDataPickup,
      setLastRequestLog: setLastRequestLogPickup,
      setRowKommoLeadIds: setRowKommoLeadIdsPickup,
    });

  const onBuscarReturn = () =>
    fetchReservas({
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

  const handleOpenShareModal = (reservation: Reservation) => {
    setSelectedReservationForShare(reservation);
    setIsShareModalOpen(true);
  };

  const handleCloseShareModal = () => {
    setIsShareModalOpen(false);
    setSelectedReservationForShare(null);
  };

  const createDownloadHandler = (log: any, filename: string) => () => {
    if (!log) return;
    const jsonStr = JSON.stringify(log, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* Seção Pickup Date */}
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
      
      <ReservationTable
        error={errorPickup}
        rawApiData={rawApiDataPickup}
        reservations={reservationsPickup}
        rowKommoLeadIds={rowKommoLeadIdsPickup}
        badgeType="pickup"
        loading={loadingPickup}
        onShareClick={handleOpenShareModal}
      />

      {/* Seção Return Date */}
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
      
      <ReservationTable
        error={errorReturn}
        rawApiData={rawApiDataReturn}
        reservations={reservationsReturn}
        rowKommoLeadIds={rowKommoLeadIdsReturn}
        badgeType="return"
        loading={loadingReturn}
        onShareClick={handleOpenShareModal}
      />

      {/* Modal de compartilhamento */}
      <ReservationWhatsAppModal
        isOpen={isShareModalOpen}
        onClose={handleCloseShareModal}
        reservationData={selectedReservationForShare}
      />
    </div>
  );
};

export default ConsultaReservas;
