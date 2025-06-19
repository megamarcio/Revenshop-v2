
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

  const {
    reservations,
    loading,
    error,
    rawApiData,
    lastRequestLog,
    rowKommoLeadIds,
    setReservations,
    setError,
    setRawApiData,
    setLastRequestLog,
    setRowKommoLeadIds,
    fetchReservations
  } = useReservationFetch({
    dataIni,
    dataFim,
    columnType,
    setLoading: () => {},
    setReservations,
    setError,
    setRawApiData,
    setLastRequestLog,
    setRowKommoLeadIds
  });

  const {
    selectedReservation,
    isWhatsAppModalOpen,
    handleShareClick,
    handleCloseWhatsAppModal
  } = useReservationWhatsApp();

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

  return (
    <LogisticaErrorBoundary>
      <div className="w-full max-w-7xl mx-auto p-2 sm:p-4 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Logística - Consulta de Reservas</h1>
            <p className="text-sm text-muted-foreground">Consulte e gerencie as reservas de veículos</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              onClick={handleExportPDF}
              variant="outline"
              size="sm"
              disabled={reservations.length === 0}
              className="w-full sm:w-auto"
            >
              <Download className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Exportar PDF</span>
              <span className="sm:hidden">PDF</span>
            </Button>
            
            <Button
              onClick={handleSearch}
              disabled={loading}
              size="sm"
              className="w-full sm:w-auto"
            >
              {loading ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Calendar className="h-4 w-4 mr-2" />
              )}
              <span className="hidden sm:inline">Buscar Reservas</span>
              <span className="sm:hidden">Buscar</span>
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader className="p-3 sm:p-6">
            <CardTitle className="text-lg sm:text-xl">Filtros de Busca</CardTitle>
          </CardHeader>
          <CardContent className="p-3 sm:p-6 pt-0">
            <ReservationFilters
              dataIni={dataIni}
              dataFim={dataFim}
              columnType={columnType}
              onDataIniChange={setDataIni}
              onDataFimChange={setDataFim}
              onColumnTypeChange={setColumnType}
              onSearch={handleSearch}
              loading={loading}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="p-3 sm:p-6">
            <CardTitle className="text-lg sm:text-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span>Resultados da Busca</span>
              {reservations.length > 0 && (
                <span className="text-sm font-normal text-muted-foreground">
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
              rowKommoLeadIds={rowKommoLeadIds}
              onShareClick={handleShareClick}
            />
          </CardContent>
        </Card>

        <ReservationWhatsAppModal
          isOpen={isWhatsAppModalOpen}
          onClose={handleCloseWhatsAppModal}
          reservation={selectedReservation}
        />
      </div>
    </LogisticaErrorBoundary>
  );
};

export default ConsultaReservas;
