
import { useState } from 'react';
import { Reservation } from '../types/reservationTypes';

export const useConsultaReservasState = () => {
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
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rawApiData, setRawApiData] = useState<any>(null);
  const [lastRequestLog, setLastRequestLog] = useState<any>(null);
  const [rowKommoLeadIds, setRowKommoLeadIds] = useState<{ [r: string]: string }>({});

  return {
    dataIni,
    setDataIni,
    dataFim,
    setDataFim,
    columnType,
    setColumnType,
    reservations,
    setReservations,
    loading,
    setLoading,
    error,
    setError,
    rawApiData,
    setRawApiData,
    lastRequestLog,
    setLastRequestLog,
    rowKommoLeadIds,
    setRowKommoLeadIds,
  };
};
