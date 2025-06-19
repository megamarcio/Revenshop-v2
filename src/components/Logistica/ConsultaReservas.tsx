
import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, Calendar, Download } from 'lucide-react';
import { useReservationFetch } from './hooks/useReservationFetch';
import ReservationFilters from './components/ReservationFilters';
import ReservationTable from './components/ReservationTable';
import LogisticaErrorBoundary from './components/LogisticaErrorBoundary';
import ReservationWhatsAppModal from './ReservationWhatsAppModal';
import { useReservationWhatsApp } from './useReservationWhatsApp';
import { Reservation } from './types/reservationTypes';
import { toast } from 'sonner';

const ConsultaReservas = () => {
  const [dataIni, setDataIni] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  
  const [dataFim, setDataFim] = useState(() => {
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);
    return nextWeek.toISOString().split('T')[0];
  });
  
  const [columnType, setColumnType] = useState<"pick_up_date" | "return_date">("pick_up_date");

  // State management for reservations data
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rawApiData, setRawApiData] = useState<any>(null);
  const [lastRequestLog, setLastRequestLog] = useState<any>(null);
  const [rowKommoLeadIds, setRowKommoLeadIds] = useState<{ [r: string]: string }>({});

  const { fetchReservas } = useReservationFetch();

  const {
    selectedReservation,
    isWhatsAppModalOpen,
    handleShareClick,
    handleCloseWhatsAppModal
  } = useReservationWhatsApp();

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
  }, [dataIni, dataFim, columnType, fetchReservas]);

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

  const handleExportPDF = useCallback(() => {
    if (reservations.length === 0) {
      toast.error('Não há reservas para exportar');
      return;
    }
    
    // Implementar exportação para PDF
    toast.info('Funcionalidade de exportação em desenvolvimento');
  }, [reservations]);

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

  return (
    <LogisticaErrorBoundary>
      <div className="w-full max-w-7xl mx-auto p-2 sm:p-4 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">Logística - Consulta de Reservas</h1>
            <p className="text-xs sm:text-sm text-muted-foreground">Consulte e gerencie as reservas de veículos</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              onClick={handleExportPDF}
              variant="outline"
              size="sm"
              disabled={reservations.length === 0}
              className="w-full sm:w-auto text-xs"
            >
              <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Exportar PDF</span>
              <span className="sm:hidden">PDF</span>
            </Button>
            
            <Button
              onClick={handleSearch}
              disabled={loading}
              size="sm"
              className="w-full sm:w-auto text-xs"
            >
              {loading ? (
                <RefreshCw className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 animate-spin" />
              ) : (
                <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              )}
              <span className="hidden sm:inline">Buscar Reservas</span>
              <span className="sm:hidden">Buscar</span>
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader className="p-3 sm:p-6">
            <CardTitle className="text-base sm:text-lg md:text-xl">Filtros de Busca</CardTitle>
          </CardHeader>
          <CardContent className="p-3 sm:p-6 pt-0">
            <ReservationFilters
              header="Filtros de Data"
              dataInicio={dataIni}
              setDataInicio={setDataIni}
              dataFim={dataFim}
              setDataFim={setDataFim}
              onBuscar={handleSearch}
              loading={loading}
              lastRequestLog={lastRequestLog}
              handleDownloadRequestLog={handleDownloadRequestLog}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="p-3 sm:p-6">
            <CardTitle className="text-base sm:text-lg md:text-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span>Resultados da Busca</span>
              {reservations.length > 0 && (
                <span className="text-xs sm:text-sm font-normal text-muted-foreground">
                  {reservations.length} reserva{reservations.length !== 1 ? 's' : ''} encontrada{reservations.length !== 1 ? 's' : ''}
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 sm:p-6 sm:pt-0">
            <ReservationTable
              reservations={reservations}
              loading={loading}
              error={error}
              rawApiData={rawApiData}
              rowKommoLeadIds={rowKommoLeadIds}
              badgeType="pickup"
              onShareClick={handleShareClick}
            />
          </CardContent>
        </Card>

        <ReservationWhatsAppModal
          isOpen={isWhatsAppModalOpen}
          onClose={handleCloseWhatsAppModal}
          reservationData={selectedReservation}
        />
      </div>
    </LogisticaErrorBoundary>
  );
};

export default ConsultaReservas;
