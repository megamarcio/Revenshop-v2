import { Reservation } from "../types/reservationTypes";
import { formatToFloridaDateTime } from "./dateFormatter";

export const generateLogisticsPDF = (
  pickupReservations: Reservation[], 
  returnReservations: Reservation[]
) => {
  const currentDate = new Date().toLocaleDateString('pt-BR');
  
  const generateTableRows = (reservations: Reservation[]) => {
    return reservations.map(reservation => `
      <tr>
        <td style="border: 1px solid #ddd; padding: 6px; font-size: 10px;">${reservation.id || 'N/A'}</td>
        <td style="border: 1px solid #ddd; padding: 6px; font-size: 10px;">${reservation.customer?.label || 'N/A'}</td>
        <td style="border: 1px solid #ddd; padding: 6px; font-size: 10px;">${reservation.customer?.phone_number || 'N/A'}</td>
        <td style="border: 1px solid #ddd; padding: 6px; font-size: 10px;">${formatToFloridaDateTime(reservation.pick_up_date)}</td>
        <td style="border: 1px solid #ddd; padding: 6px; font-size: 10px;">${formatToFloridaDateTime(reservation.return_date)}</td>
        <td style="border: 1px solid #ddd; padding: 6px; font-size: 10px;">${reservation.vehicle_name || 'N/A'}</td>
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
          margin: 20px;
          color: #333;
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
          border-bottom: 2px solid #4CAF50;
          padding-bottom: 20px;
        }
        .header h1 {
          color: #4CAF50;
          margin-bottom: 5px;
        }
        .section {
          margin-bottom: 40px;
        }
        .section h2 {
          background-color: #f5f5f5;
          padding: 10px;
          border-left: 4px solid #4CAF50;
          margin-bottom: 15px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
        }
        th {
          background-color: #4CAF50;
          color: white;
          padding: 8px;
          text-align: left;
          font-size: 11px;
        }
        .summary {
          background-color: #f9f9f9;
          padding: 15px;
          border-radius: 5px;
          margin-bottom: 20px;
        }
        .summary-item {
          display: inline-block;
          margin-right: 30px;
          font-weight: bold;
        }
        @media print {
          body { margin: 10px; }
          .section { page-break-inside: avoid; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Relatório de Logística</h1>
        <p>Gerado em: ${currentDate}</p>
      </div>

      <div class="summary">
        <div class="summary-item">Total Pickup: ${pickupReservations.length}</div>
        <div class="summary-item">Total Return: ${returnReservations.length}</div>
        <div class="summary-item">Total Geral: ${pickupReservations.length + returnReservations.length}</div>
      </div>

      <div class="section">
        <h2>📅 Consulta por Pickup Date (${pickupReservations.length} reservas)</h2>
        ${pickupReservations.length > 0 ? `
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Cliente</th>
                <th>Telefone</th>
                <th>Data Pickup</th>
                <th>Data Retorno</th>
                <th>Veículo</th>
              </tr>
            </thead>
            <tbody>
              ${generateTableRows(pickupReservations)}
            </tbody>
          </table>
        ` : '<p style="color: #666; font-style: italic;">Nenhuma reserva encontrada para pickup.</p>'}
      </div>

      <div class="section">
        <h2>🔄 Consulta por Return Date (${returnReservations.length} reservas)</h2>
        ${returnReservations.length > 0 ? `
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Cliente</th>
                <th>Telefone</th>
                <th>Data Pickup</th>
                <th>Data Retorno</th>
                <th>Veículo</th>
              </tr>
            </thead>
            <tbody>
              ${generateTableRows(returnReservations)}
            </tbody>
          </table>
        ` : '<p style="color: #666; font-style: italic;">Nenhuma reserva encontrada para retorno.</p>'}
      </div>

      <div style="margin-top: 40px; text-align: center; color: #666; font-size: 12px;">
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
