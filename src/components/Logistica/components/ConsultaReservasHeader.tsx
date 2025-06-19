
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, Calendar, Download } from 'lucide-react';

interface ConsultaReservasHeaderProps {
  reservationsCount: number;
  loading: boolean;
  onSearch: () => void;
  onExportPDF: () => void;
}

const ConsultaReservasHeader: React.FC<ConsultaReservasHeaderProps> = ({
  reservationsCount,
  loading,
  onSearch,
  onExportPDF,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">Logística - Consulta de Reservas</h1>
        <p className="text-xs sm:text-sm text-muted-foreground">Consulte e gerencie as reservas de veículos</p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-2">
        <Button
          onClick={onExportPDF}
          variant="outline"
          size="sm"
          disabled={reservationsCount === 0}
          className="w-full sm:w-auto text-xs"
        >
          <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
          <span className="hidden sm:inline">Exportar PDF</span>
          <span className="sm:hidden">PDF</span>
        </Button>
        
        <Button
          onClick={onSearch}
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
  );
};

export default ConsultaReservasHeader;
