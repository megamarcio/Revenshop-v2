
import React from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface FilterActionsProps {
  onBuscar: () => void;
  loading: boolean;
  dataInicio: string;
  dataFim: string;
  handleDownloadRequestLog: () => void;
  lastRequestLog: any;
}

const FilterActions: React.FC<FilterActionsProps> = ({
  onBuscar,
  loading,
  dataInicio,
  dataFim,
  handleDownloadRequestLog,
  lastRequestLog,
}) => {
  return (
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
  );
};

export default FilterActions;
