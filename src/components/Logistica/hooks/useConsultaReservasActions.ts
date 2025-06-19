
import { useCallback } from 'react';
import { toast } from 'sonner';
import { useReservationFetch } from './useReservationFetch';
import { exportLogisticaReservationsToPDF } from '../utils/logisticaPdfExport';
import { Reservation } from '../types/reservationTypes';

interface UseConsultaReservasActionsProps {
  dataIni: string;
  dataFim: string;
  columnType: "pick_up_date" | "return_date";
  setLoading: (loading: boolean) => void;
  setReservations: (reservations: Reservation[]) => void;
  setError: (error: string | null) => void;
  setRawApiData: (data: any) => void;
  setLastRequestLog: (log: any) => void;
  setRowKommoLeadIds: (ids: { [r: string]: string }) => void;
  setColumnType: (type: "pick_up_date" | "return_date") => void;
  reservations: Reservation[];
  lastRequestLog: any;
}

export const useConsultaReservasActions = ({
  dataIni,
  dataFim,
  columnType,
  setLoading,
  setReservations,
  setError,
  setRawApiData,
  setLastRequestLog,
  setRowKommoLeadIds,
  setColumnType,
  reservations,
  lastRequestLog,
}: UseConsultaReservasActionsProps) => {
  const { fetchReservas } = useReservationFetch();

  const fetchReservations = useCallback(() => {
    fetchReservas({
      dataIni,
      dataFim,
      columnType,
      setLoading,
      setReservations,
      setError,
      setRawApiData,
      setLastRequestLog,
      setRowKommoLeadIds,
    });
  }, [dataIni, dataFim, columnType, fetchReservas, setLoading, setReservations, setError, setRawApiData, setLastRequestLog, setRowKommoLeadIds]);

  const handleSearch = useCallback(() => {
    if (!dataIni || !dataFim) {
      toast.error('Por favor, selecione as datas inicial e final');
      return;
    }
    
    if (new Date(dataIni) > new Date(dataFim)) {
      toast.error('A data inicial deve ser anterior à data final');
      return;
    }
    
    fetchReservations();
  }, [dataIni, dataFim, fetchReservations]);

  const handleDateTypeChange = useCallback((newDateType: "pick_up_date" | "return_date") => {
    setColumnType(newDateType);
    // Limpar resultados quando trocar o tipo de filtro
    setReservations([]);
    setError(null);
    setRawApiData(null);
  }, [setColumnType, setReservations, setError, setRawApiData]);

  const handleExportPDF = useCallback(() => {
    if (reservations.length === 0) {
      toast.error('Não há reservas para exportar');
      return;
    }
    
    exportLogisticaReservationsToPDF(reservations, { start: dataIni, end: dataFim });
  }, [reservations, dataIni, dataFim]);

  const handleDownloadRequestLog = useCallback(() => {
    if (!lastRequestLog) return;
    
    try {
      const jsonStr = JSON.stringify(lastRequestLog, null, 2);
      const blob = new Blob([jsonStr], { type: "application/json" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "request-log.json";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error('Error downloading request log:', error);
    }
  }, [lastRequestLog]);

  return {
    handleSearch,
    handleDateTypeChange,
    handleExportPDF,
    handleDownloadRequestLog,
  };
};
