
import React from 'react';
import LogisticaErrorBoundary from './components/LogisticaErrorBoundary';
import ReservationWhatsAppModal from './ReservationWhatsAppModal';
import { useReservationWhatsApp } from './useReservationWhatsApp';
import { useConsultaReservasState } from './hooks/useConsultaReservasState';
import { useConsultaReservasActions } from './hooks/useConsultaReservasActions';
import ConsultaReservasHeader from './components/ConsultaReservasHeader';
import ConsultaReservasFiltersCard from './components/ConsultaReservasFiltersCard';
import ConsultaReservasResultsCard from './components/ConsultaReservasResultsCard';

const ConsultaReservas = () => {
  const state = useConsultaReservasState();
  const actions = useConsultaReservasActions({
    ...state,
    lastRequestLog: state.lastRequestLog,
  });

  const {
    selectedReservation,
    isWhatsAppModalOpen,
    handleShareClick,
    handleCloseWhatsAppModal
  } = useReservationWhatsApp();

  return (
    <LogisticaErrorBoundary>
      <div className="w-full max-w-7xl mx-auto p-2 sm:p-4 space-y-4">
        <ConsultaReservasHeader
          reservationsCount={state.reservations.length}
          loading={state.loading}
          onSearch={actions.handleSearch}
          onExportPDF={actions.handleExportPDF}
        />

        <ConsultaReservasFiltersCard
          dataInicio={state.dataIni}
          setDataInicio={state.setDataIni}
          dataFim={state.dataFim}
          setDataFim={state.setDataFim}
          onBuscar={actions.handleSearch}
          loading={state.loading}
          lastRequestLog={state.lastRequestLog}
          handleDownloadRequestLog={actions.handleDownloadRequestLog}
          dateType={state.columnType}
          onDateTypeChange={actions.handleDateTypeChange}
        />

        <ConsultaReservasResultsCard
          columnType={state.columnType}
          reservations={state.reservations}
          loading={state.loading}
          error={state.error}
          rawApiData={state.rawApiData}
          rowKommoLeadIds={state.rowKommoLeadIds}
          onShareClick={handleShareClick}
        />

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
