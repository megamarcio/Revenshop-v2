
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, Calendar, CalendarDays } from "lucide-react";

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
      
      {/* Novo filtro de tipo de data */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Filtrar por:</label>
        <Select value={dateType} onValueChange={onDateTypeChange}>
          <SelectTrigger className="w-[200px]">
            {dateType === "pick_up_date" ? (
              <Calendar className="h-4 w-4 mr-2" />
            ) : (
              <CalendarDays className="h-4 w-4 mr-2" />
            )}
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pick_up_date">Data de Check-in</SelectItem>
            <SelectItem value="return_date">Data de Return</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div>
          <label htmlFor="dataInicio" className="block text-sm font-medium mb-1">
            Data Inicial
          </label>
          <Input 
            type="date" 
            id="dataInicio" 
            value={dataInicio} 
            onChange={e => setDataInicio(e.target.value)} 
            className="w-[210px]" 
            required 
          />
        </div>
        <div>
          <label htmlFor="dataFim" className="block text-sm font-medium mb-1">
            Data Final
          </label>
          <Input 
            type="date" 
            id="dataFim" 
            value={dataFim} 
            onChange={e => setDataFim(e.target.value)} 
            className="w-[210px]" 
            required 
          />
        </div>
        <div className="flex flex-row items-end gap-2 mt-7">
          <Button 
            className="h-10 px-8" 
            onClick={onBuscar} 
            disabled={loading || !dataInicio || !dataFim}
          >
            {loading ? "Buscando..." : "Buscar"}
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            className="h-10 w-10" 
            onClick={handleDownloadRequestLog} 
            disabled={!lastRequestLog} 
            title="Baixar log da última requisição" 
            aria-label="Baixar log da última requisição" 
            tabIndex={0}
          >
            <Download className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReservationFilters;
