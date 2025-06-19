
import React from "react";
import DateTypeSelector from "./DateTypeSelector";
import DateRangeInputs from "./DateRangeInputs";
import FilterActions from "./FilterActions";

interface ReservationFiltersProps {
  header: string;
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

const ReservationFilters: React.FC<ReservationFiltersProps> = ({
  header,
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
    <div className="border-[2px] border-muted mb-8 rounded-lg p-5 shadow-sm bg-background">
      <h2 className="text-xl font-bold mb-3">{header}</h2>
      
      <DateTypeSelector
        dateType={dateType}
        onDateTypeChange={onDateTypeChange}
      />

      <DateRangeInputs
        dataInicio={dataInicio}
        setDataInicio={setDataInicio}
        dataFim={dataFim}
        setDataFim={setDataFim}
      />
      
      <FilterActions
        onBuscar={onBuscar}
        loading={loading}
        dataInicio={dataInicio}
        dataFim={dataFim}
        handleDownloadRequestLog={handleDownloadRequestLog}
        lastRequestLog={lastRequestLog}
      />
    </div>
  );
};

export default ReservationFilters;
