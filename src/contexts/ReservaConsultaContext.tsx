
import React, { createContext, useContext, useState, ReactNode } from "react";

type ReservationItem = {
  reservation_number: string;
  customer_name: string;
  checkin_datetime: string;
  checkout_datetime: string;
};

type ConsultaState = {
  dateRange: { from?: Date; to?: Date };
  setDateRange: (r: { from?: Date; to?: Date }) => void;
  result: ReservationItem[] | null;
  setResult: (r: ReservationItem[] | null) => void;
  loading: boolean;
  setLoading: (b: boolean) => void;
  error: string;
  setError: (e: string) => void;
  clear: () => void;
};

const ReservaConsultaContext = createContext<ConsultaState | undefined>(undefined);

export const useReservaConsulta = () => {
  const ctx = useContext(ReservaConsultaContext);
  if (!ctx) throw new Error('useReservaConsulta precisa estar dentro do provider!');
  return ctx;
};

export const ReservaConsultaProvider = ({ children }: { children: ReactNode }) => {
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});
  const [result, setResult] = useState<ReservationItem[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const clear = () => {
    setDateRange({});
    setResult(null);
    setError("");
    setLoading(false);
  };

  return (
    <ReservaConsultaContext.Provider
      value={{
        dateRange,
        setDateRange,
        result,
        setResult,
        loading,
        setLoading,
        error,
        setError,
        clear,
      }}
    >
      {children}
    </ReservaConsultaContext.Provider>
  );
};
