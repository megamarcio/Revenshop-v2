
import { MaintenanceRecord } from '../types/maintenance';
import { formatCurrency, formatDate, getMaintenanceTypeLabel } from '../components/Maintenance/utils/maintenanceFormatters';

interface PrintData {
  maintenances: MaintenanceRecord[];
  filter: string;
  totalCount: number;
  totalValue: number;
  date: string;
}

export const useMaintenancePrint = () => {
  const generatePrintHTML = (data: PrintData): string => {
    const { maintenances, filter, totalCount, totalValue, date } = data;

    const tableRows = maintenances.map(maintenance => `
      <tr>
        <td>${maintenance.vehicle_internal_code}</td>
        <td>${maintenance.vehicle_name}</td>
        <td>${getMaintenanceTypeLabel(maintenance.maintenance_type)}</td>
        <td>${maintenance.is_urgent ? 'URGENTE' : 'Normal'}</td>
        <td>${formatCurrency(maintenance.total_amount)}</td>
        <td>${formatDate(maintenance.detection_date)}</td>
        <td>${maintenance.promised_date ? formatDate(maintenance.promised_date) : 'N/A'}</td>
        <td>${maintenance.mechanic_name}</td>
      </tr>
    `).join('');

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Relatório de Manutenções</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              margin: 20px; 
              font-size: 12px;
              color: #000;
            }
            .header { 
              text-align: center; 
              margin-bottom: 30px; 
              border-bottom: 2px solid #000;
              padding-bottom: 10px;
            }
            .header h1 { 
              margin: 0; 
              font-size: 20px; 
            }
            .info { 
              margin: 10px 0; 
              display: flex; 
              justify-content: space-between;
            }
            table { 
              width: 100%; 
              border-collapse: collapse; 
              margin-top: 20px;
            }
            th, td { 
              border: 1px solid #000; 
              padding: 6px; 
              text-align: left;
              font-size: 10px;
            }
            th { 
              background-color: #f0f0f0; 
              font-weight: bold;
            }
            .summary {
              margin-top: 20px;
              text-align: right;
              font-weight: bold;
            }
            @media print {
              body { margin: 0; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>RELATÓRIO DE MANUTENÇÕES</h1>
            <div class="info">
              <span>Data: ${date}</span>
              <span>Filtro: ${filter}</span>
            </div>
            <div class="info">
              <span>Total de manutenções: ${totalCount}</span>
              <span>Valor total: ${formatCurrency(totalValue)}</span>
            </div>
          </div>
          
          <table>
            <thead>
              <tr>
                <th>Código</th>
                <th>Veículo</th>
                <th>Tipo</th>
                <th>Urgência</th>
                <th>Valor</th>
                <th>Data Criação</th>
                <th>Data Promessa</th>
                <th>Mecânico</th>
              </tr>
            </thead>
            <tbody>
              ${tableRows}
            </tbody>
          </table>
          
          <div class="summary">
            <p>Relatório gerado em: ${new Date().toLocaleString('pt-BR')}</p>
          </div>
        </body>
      </html>
    `;
  };

  const printReport = (data: PrintData) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Erro ao abrir janela de impressão. Verifique se o bloqueador de pop-ups está desabilitado.');
      return;
    }

    const htmlContent = generatePrintHTML(data);
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    // Aguarda o carregamento antes de imprimir
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };

  const downloadPDF = async (data: PrintData) => {
    const htmlContent = generatePrintHTML(data);
    
    // Cria um elemento temporário para gerar o PDF
    const element = document.createElement('div');
    element.innerHTML = htmlContent;
    element.style.position = 'absolute';
    element.style.left = '-9999px';
    document.body.appendChild(element);

    try {
      // Usa a funcionalidade nativa do navegador para salvar como PDF
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(htmlContent);
        printWindow.document.close();
        setTimeout(() => {
          printWindow.print();
        }, 500);
      }
    } finally {
      document.body.removeChild(element);
    }
  };

  return {
    printReport,
    downloadPDF,
    generatePrintHTML
  };
};
