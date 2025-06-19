
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ReservationFilters from './ReservationFilters';

interface ConsultaReservasFiltersCardProps {
  dataInicio: string;
  setDataInicio: (val: string) => void;
  dataFim: string;
  setDataFim: (val: string) => void;
  onBuscar: () => void;
  loading: boolean;
  lastRequestLog: any;
  handleDownloadRequestLog: () => void;
  dateType: "pick_up_date" | "return_date";
  onDateTypeChange: (type: "pick_up_date" | "return_date") => void;
}

const ConsultaReservasFiltersCard: React.FC<ConsultaReservasFiltersCardProps> = ({
  dataInicio,
  setDataInicio,
  dataFim,
  setDataFim,
  onBuscar,
  loading,
  lastRequestLog,
  handleDownloadRequestLog,
  dateType,
  onDateTypeChange,
}) => {
  return (
    <Card>
      <CardHeader className="p-3 sm:p-6">
        <CardTitle className="text-base sm:text-lg md:text-xl">Filtros de Busca</CardTitle>
      </CardHeader>
      <CardContent className="p-3 sm:p-6 pt-0">
        <ReservationFilters
          header="Filtros de Data"
          dataInicio={dataInicio}
          setDataInicio={setDataInicio}
          dataFim={dataFim}
          setDataFim={setDataFim}
          onBuscar={onBuscar}
          loading={loading}
          lastRequestLog={lastRequestLog}
          handleDownloadRequestLog={handleDownloadRequestLog}
          dateType={dateType}
          onDateTypeChange={onDateTypeChange}
        />
      </CardContent>
    </Card>
  );
};

export default ConsultaReservasFiltersCard;
