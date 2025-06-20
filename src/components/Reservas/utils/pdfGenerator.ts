import { ReservationListItem } from '@/hooks/useReservationsList';
import { formatToFloridaDateTime } from '@/components/Logistica/utils/dateFormatter';

const getTemperatureColor = (temperature: string) => {
  switch (temperature.toLowerCase()) {
    case 'sol':
      return '#FFD700'; // Dourado
    case 'quente':
      return '#FF6B35'; // Laranja
    case 'morno':
      return '#FFA500'; // Laranja médio
    case 'frio':
      return '#4A90E2'; // Azul
    case 'congelado':
      return '#1E3A8A'; // Azul escuro
    default:
      return '#6B7280'; // Cinza
  }
};

const getTemperatureEmoji = (temperature: string) => {
  switch (temperature.toLowerCase()) {
    case 'sol':
      return '☀️';
    case 'quente':
      return '🔥';
    case 'morno':
      return '🌡️';
    case 'frio':
      return '❄️';
    case 'congelado':
      return '🧊';
    default:
      return '⚪';
  }
};

const extractFirstLocationName = (locationLabel: string): string => {
  if (!locationLabel) return '';
  return locationLabel.split(' ')[0];
};

export const generateReservationsListPDF = (reservations: ReservationListItem[]) => {
  const validReservations = reservations.filter(r => r.data && !r.loading && !r.error);
  
  if (validReservations.length === 0) {
    alert('Nenhuma reserva válida encontrada para gerar o PDF.');
    return;
  }

  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Não foi possível abrir a janela para impressão. Verifique se o bloqueador de pop-ups está desabilitado.');
    return;
  }

  const currentDate = new Date().toLocaleDateString('pt-BR');
  const currentTime = new Date().toLocaleTimeString('pt-BR');

  let tableRows = '';
  validReservations.forEach((reservation) => {
    const data = reservation.data!;
    const tempColor = getTemperatureColor(reservation.temperature || '');
    const tempEmoji = getTemperatureEmoji(reservation.temperature || '');
    
    // Extrair primeiro nome das localidades
    const pickupLocationShort = extractFirstLocationName(data.reservation.pick_up_location_label);
    const returnLocationShort = extractFirstLocationName(data.reservation.return_location_label || data.reservation.pick_up_location_label);
    
    tableRows += `
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">#${data.reservation.id}</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${data.customer.first_name}</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${data.customer.phone_number || 'N/A'}</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${formatToFloridaDateTime(data.reservation.pick_up_date)}</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${formatToFloridaDateTime(data.reservation.return_date)}</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${pickupLocationShort}</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${returnLocationShort}</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${data.selected_vehicle_class?.vehicle_class?.label || 'N/A'}</td>
        <td style="padding: 8px; border: 1px solid #ddd; text-align: center; font-weight: bold;">${data.reservation.outstanding_balance}</td>
        <td style="padding: 8px; border: 1px solid #ddd; text-align: center; background-color: ${tempColor}20; color: ${tempColor};">
          ${tempEmoji} ${reservation.temperature || 'N/A'}
        </td>
        <td style="padding: 8px; border: 1px solid #ddd; max-width: 150px; word-wrap: break-word;">${reservation.notes || '-'}</td>
      </tr>
    `;
  });

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Lista de Reservas - ${currentDate}</title>
        <meta charset="utf-8">
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 20px;
            color: #333;
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 2px solid #333;
          }
          .header h1 {
            margin: 0;
            color: #2563eb;
          }
          .header p {
            margin: 5px 0;
            color: #666;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
            font-size: 12px;
          }
          th {
            background-color: #2563eb;
            color: white;
            padding: 10px 6px;
            text-align: left;
            border: 1px solid #ddd;
          }
          tr:nth-child(even) {
            background-color: #f9f9f9;
          }
          .summary {
            margin-top: 30px;
            padding: 15px;
            background-color: #f3f4f6;
            border-radius: 5px;
          }
          @media print {
            body { margin: 0; }
            .header { page-break-after: avoid; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Lista de Reservas</h1>
          <p>Gerado em: ${currentDate} às ${currentTime}</p>
          <p>Total de reservas: ${validReservations.length}</p>
        </div>

        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Cliente</th>
              <th>Telefone</th>
              <th>Check-in</th>
              <th>Return</th>
              <th>Local Check-in</th>
              <th>Local Return</th>
              <th>Categoria</th>
              <th>Valor</th>
              <th>Temperatura</th>
              <th>Observações</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows}
          </tbody>
        </table>

        <div class="summary">
          <h3>Resumo por Temperatura:</h3>
          ${generateTemperatureSummary(validReservations)}
        </div>
      </body>
    </html>
  `;

  printWindow.document.write(htmlContent);
  printWindow.document.close();
  printWindow.print();
};

const generateTemperatureSummary = (reservations: ReservationListItem[]) => {
  const tempCounts: { [key: string]: number } = {};
  
  reservations.forEach(r => {
    const temp = r.temperature || 'Não definido';
    tempCounts[temp] = (tempCounts[temp] || 0) + 1;
  });

  return Object.entries(tempCounts)
    .map(([temp, count]) => {
      const emoji = getTemperatureEmoji(temp);
      return `<p>${emoji} ${temp}: ${count} reserva(s)</p>`;
    })
    .join('');
};
