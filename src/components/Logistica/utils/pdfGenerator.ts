import { Reservation } from "../types/reservationTypes";
import { formatToAmericanDateTime } from "./dateFormatter";

export const generateLogisticsPDF = (
  pickupReservations: Reservation[], 
  returnReservations: Reservation[]
) => {
  const currentDate = new Date().toLocaleDateString('pt-BR');
  
  const generateTableRows = (reservations: Reservation[]) => {
    return reservations.map(reservation => `
      <tr>
        <td style="border: 1px solid #ddd; padding: 8px; font-size: 11px; text-align: center;">${reservation.id || 'N/A'}</td>
        <td style="border: 1px solid #ddd; padding: 8px; font-size: 11px;">${reservation.customer?.label || 'N/A'}</td>
        <td style="border: 1px solid #ddd; padding: 8px; font-size: 11px;">${reservation.customer?.phone_number || 'N/A'}</td>
        <td style="border: 1px solid #ddd; padding: 8px; font-size: 11px;">${formatToAmericanDateTime(reservation.pick_up_date)}</td>
        <td style="border: 1px solid #ddd; padding: 8px; font-size: 11px;">${formatToAmericanDateTime(reservation.return_date)}</td>
      </tr>
    `).join('');
  };

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Relatório Logística - ${currentDate}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 15px;
          color: #333;
          line-height: 1.4;
        }
        .header {
          text-align: center;
          margin-bottom: 25px;
          border-bottom: 2px solid #4CAF50;
          padding-bottom: 15px;
        }
        .header h1 {
          color: #4CAF50;
          margin-bottom: 5px;
          font-size: 24px;
        }
        .section {
          margin-bottom: 30px;
          page-break-inside: avoid;
        }
        .section h2 {
          background-color: #f5f5f5;
          padding: 12px;
          border-left: 4px solid #4CAF50;
          margin-bottom: 15px;
          font-size: 16px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
          page-break-inside: avoid;
        }
        th {
          background-color: #4CAF50;
          color: white;
          padding: 10px 8px;
          text-align: left;
          font-size: 12px;
          font-weight: bold;
        }
        td {
          vertical-align: top;
        }
        .summary {
          background-color: #f9f9f9;
          padding: 15px;
          border-radius: 5px;
          margin-bottom: 20px;
          border: 1px solid #ddd;
        }
        .summary-item {
          display: inline-block;
          margin-right: 30px;
          font-weight: bold;
          color: #4CAF50;
        }
        .no-data {
          color: #666;
          font-style: italic;
          text-align: center;
          padding: 20px;
          background-color: #f9f9f9;
          border-radius: 5px;
        }
        @media print {
          body { 
            margin: 10px; 
            font-size: 10px;
          }
          .section { 
            page-break-inside: avoid; 
            margin-bottom: 20px;
          }
          table { 
            page-break-inside: avoid; 
            font-size: 9px;
          }
          th, td {
            padding: 6px 4px;
          }
          .header h1 {
            font-size: 20px;
          }
          .section h2 {
            font-size: 14px;
            padding: 8px;
          }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Relatório de Logística</h1>
        <p>Gerado em: ${currentDate}</p>
      </div>

      <div class="summary">
        <div class="summary-item">📅 Total Pickup: ${pickupReservations.length}</div>
        <div class="summary-item">🔄 Total Return: ${returnReservations.length}</div>
        <div class="summary-item">📊 Total Geral: ${pickupReservations.length + returnReservations.length}</div>
      </div>

      <div class="section">
        <h2>📅 Consulta por Pickup Date (${pickupReservations.length} reservas)</h2>
        ${pickupReservations.length > 0 ? `
          <table>
            <thead>
              <tr>
                <th style="width: 10%;">ID</th>
                <th style="width: 35%;">Cliente</th>
                <th style="width: 15%;">Telefone</th>
                <th style="width: 20%;">Data Pickup</th>
                <th style="width: 20%;">Data Retorno</th>
              </tr>
            </thead>
            <tbody>
              ${generateTableRows(pickupReservations)}
            </tbody>
          </table>
        ` : '<div class="no-data">Nenhuma reserva encontrada para pickup.</div>'}
      </div>

      <div class="section">
        <h2>🔄 Consulta por Return Date (${returnReservations.length} reservas)</h2>
        ${returnReservations.length > 0 ? `
          <table>
            <thead>
              <tr>
                <th style="width: 10%;">ID</th>
                <th style="width: 35%;">Cliente</th>
                <th style="width: 15%;">Telefone</th>
                <th style="width: 20%;">Data Pickup</th>
                <th style="width: 20%;">Data Retorno</th>
              </tr>
            </thead>
            <tbody>
              ${generateTableRows(returnReservations)}
            </tbody>
          </table>
        ` : '<div class="no-data">Nenhuma reserva encontrada para retorno.</div>'}
      </div>

      <div style="margin-top: 30px; text-align: center; color: #666; font-size: 11px; border-top: 1px solid #ddd; padding-top: 15px;">
        <p>Relatório gerado automaticamente pelo sistema de logística</p>
      </div>
    </body>
    </html>
  `;

  // Create and open print window
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    // Wait for content to load then print
    printWindow.onload = () => {
      printWindow.print();
    };
  }
};
