
import React from 'react';
import { Button } from '@/components/ui/button';
import { Printer, FileText } from 'lucide-react';
import { FinancingData, CalculationResults } from './types';
import { exportToPDF } from './utils/pdfExport';

interface FinancingActionsProps {
  financingData: FinancingData;
  results: CalculationResults;
}

const FinancingActions = ({ financingData, results }: FinancingActionsProps) => {
  const handlePrint = () => {
    window.print();
  };

  const handleExportPDF = () => {
    exportToPDF(financingData, results);
  };

  return (
    <div className="flex space-x-2">
      <Button onClick={handlePrint} variant="outline">
        <Printer className="h-4 w-4 mr-2" />
        Imprimir
      </Button>
      <Button onClick={handleExportPDF} variant="outline">
        <FileText className="h-4 w-4 mr-2" />
        Exportar PDF
      </Button>
    </div>
  );
};

export default FinancingActions;
