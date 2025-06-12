
import { FinancingData, CalculationResults } from '../types';
import { supabase } from '@/integrations/supabase/client';

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(value);
};

const getVehicleMainPhoto = async (vehicleId: string): Promise<string | null> => {
  try {
    // Primeiro tenta buscar nas novas fotos
    const { data: newPhotos } = await supabase
      .from('vehicle_photos')
      .select('url, is_main')
      .eq('vehicle_id', vehicleId)
      .order('position', { ascending: true });

    if (newPhotos && newPhotos.length > 0) {
      // Busca a foto principal ou a primeira
      const mainPhoto = newPhotos.find(p => p.is_main) || newPhotos[0];
      return mainPhoto.url;
    }

    // Fallback para as fotos antigas do array
    const { data: vehicle } = await supabase
      .from('vehicles')
      .select('photos')
      .eq('id', vehicleId)
      .single();

    if (vehicle?.photos && vehicle.photos.length > 0) {
      return vehicle.photos[0];
    }

    return null;
  } catch (error) {
    console.error('Error fetching vehicle photo:', error);
    return null;
  }
};

export const exportToPDF = async (financingData: FinancingData, results: CalculationResults) => {
  let vehicleImageUrl = null;
  
  // Buscar a foto do veículo se disponível
  if (financingData.vehicle?.id) {
    vehicleImageUrl = await getVehicleMainPhoto(financingData.vehicle.id);
  }

  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(`
      <html>
        <head>
          <title>Simulação de Financiamento - RevenShop</title>
          <style>
            @page {
              size: A4;
              margin: 15mm;
            }
            * { 
              margin: 0; 
              padding: 0; 
              box-sizing: border-box; 
            }
            body { 
              font-family: 'Segoe UI', 'Arial', sans-serif; 
              color: #1a1a1a;
              line-height: 1.3;
              background: #ffffff;
              font-size: 12px;
            }
            .header { 
              display: flex;
              align-items: center;
              justify-content: space-between;
              padding-bottom: 15px;
              margin-bottom: 20px;
              border-bottom: 1px solid #e5e7eb;
            }
            .logo-section {
              display: flex;
              align-items: center;
              gap: 15px;
            }
            .logo {
              width: 50px;
              height: 50px;
              background: linear-gradient(135deg, #3b82f6, #1d4ed8);
              border-radius: 8px;
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-weight: bold;
              font-size: 20px;
            }
            .company-info h1 {
              color: #1f2937;
              font-size: 24px;
              font-weight: 700;
              margin-bottom: 3px;
            }
            .company-info p {
              color: #6b7280;
              font-size: 14px;
            }
            .document-info {
              text-align: right;
              color: #6b7280;
              font-size: 11px;
            }
            .document-info h2 {
              color: #1f2937;
              margin-bottom: 5px;
              font-size: 16px;
            }

            .highlight-section {
              background: linear-gradient(135deg, #f0f9ff, #e0f2fe);
              padding: 20px;
              margin: 15px 0;
              text-align: center;
              border-radius: 8px;
            }
            .highlight-section h3 {
              color: #0369a1;
              font-size: 18px;
              margin-bottom: 15px;
              font-weight: 600;
            }
            .payment-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 15px;
              max-width: 500px;
              margin: 0 auto;
            }
            .payment-item {
              background: white;
              padding: 15px;
              border-radius: 6px;
            }
            .payment-label {
              color: #64748b;
              font-size: 12px;
              font-weight: 500;
              margin-bottom: 5px;
            }
            .payment-value {
              color: #0f172a;
              font-size: 20px;
              font-weight: 700;
            }

            .section { 
              margin: 15px 0;
              background: #fafafa;
              padding: 15px;
              border-radius: 6px;
            }
            .section h3 {
              color: #1f2937;
              margin-bottom: 10px;
              font-size: 14px;
              font-weight: 600;
            }
            .info-grid { 
              display: grid; 
              grid-template-columns: 1fr 1fr; 
              gap: 10px; 
            }
            .info-item {
              background: white;
              padding: 8px;
              border-radius: 4px;
              font-size: 11px;
            }
            .label { 
              font-weight: 600; 
              color: #374151;
              display: block;
              margin-bottom: 3px;
            }
            .value {
              color: #1f2937;
              font-size: 12px;
            }

            .vehicle-section {
              margin: 15px 0;
              text-align: center;
            }
            .vehicle-image {
              max-width: 200px;
              max-height: 120px;
              border-radius: 6px;
              margin: 10px auto;
              display: block;
            }
            .no-image {
              width: 200px;
              height: 100px;
              background: #f1f5f9;
              border-radius: 6px;
              display: flex;
              align-items: center;
              justify-content: center;
              margin: 10px auto;
              color: #64748b;
              font-style: italic;
              font-size: 11px;
            }

            .breakdown-table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 8px;
            }
            .breakdown-table tr {
              border-bottom: 1px solid #e5e7eb;
            }
            .breakdown-table td {
              padding: 6px 0;
              font-size: 11px;
            }
            .breakdown-table td:first-child {
              color: #6b7280;
              font-weight: 500;
            }
            .breakdown-table td:last-child {
              text-align: right;
              color: #1f2937;
              font-weight: 600;
            }

            .two-column {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 15px;
            }

            .compact-section {
              margin: 10px 0;
              background: #fafafa;
              padding: 10px;
              border-radius: 4px;
            }
            .compact-section h3 {
              font-size: 12px;
              margin-bottom: 8px;
              color: #1f2937;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo-section">
              <div class="logo">RS</div>
              <div class="company-info">
                <h1>RevenShop</h1>
                <p>Simulação de Financiamento Automotivo</p>
              </div>
            </div>
            <div class="document-info">
              <h2>Proposta de Financiamento</h2>
              <p>Data: ${new Date().toLocaleDateString('pt-BR')}</p>
              <p>Hora: ${new Date().toLocaleTimeString('pt-BR')}</p>
            </div>
          </div>

          <div class="two-column">
            <div>
              ${financingData.customer ? `
                <div class="compact-section">
                  <h3>Informações do Cliente</h3>
                  <div style="font-size: 10px; line-height: 1.4;">
                    <p><strong>Nome:</strong> ${financingData.customer.name}</p>
                    <p><strong>Telefone:</strong> ${financingData.customer.phone}</p>
                    ${financingData.customer.email ? `<p><strong>Email:</strong> ${financingData.customer.email}</p>` : ''}
                  </div>
                </div>
              ` : ''}

              ${financingData.vehicle ? `
                <div class="compact-section">
                  <h3>Informações do Veículo</h3>
                  <div style="font-size: 10px; line-height: 1.4;">
                    <p><strong>Veículo:</strong> ${financingData.vehicle.name} ${financingData.vehicle.year}</p>
                    <p><strong>Cor:</strong> ${financingData.vehicle.color}</p>
                    <p><strong>VIN:</strong> ${financingData.vehicle.vin}</p>
                    <p><strong>Preço:</strong> ${formatCurrency(financingData.vehicle.sale_price)}</p>
                  </div>
                  ${vehicleImageUrl ? `
                    <img src="${vehicleImageUrl}" alt="${financingData.vehicle.name} ${financingData.vehicle.year}" class="vehicle-image" />
                  ` : `
                    <div class="no-image">Imagem não disponível</div>
                  `}
                </div>
              ` : ''}
            </div>

            <div>
              <div class="highlight-section">
                <h3>Proposta de Financiamento</h3>
                <div class="payment-grid">
                  <div class="payment-item">
                    <div class="payment-label">Down Payment</div>
                    <div class="payment-value">${formatCurrency(results.downPaymentAmount)}</div>
                  </div>
                  <div class="payment-item">
                    <div class="payment-label">Financiamento</div>
                    <div class="payment-value">${financingData.installments}x de ${formatCurrency(results.monthlyPayment)}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="section">
            <h3>Detalhes do Financiamento</h3>
            <table class="breakdown-table">
              <tr>
                <td>Valor do Veículo:</td>
                <td>${formatCurrency(financingData.vehiclePrice)}</td>
              </tr>
              <tr>
                <td>Down Payment:</td>
                <td>${formatCurrency(results.downPaymentAmount)}</td>
              </tr>
              <tr>
                <td>Valor Financiado:</td>
                <td>${formatCurrency(results.financedAmount)}</td>
              </tr>
              <tr>
                <td>Taxa de Juros:</td>
                <td>${financingData.interestRate}% ao ano</td>
              </tr>
              <tr>
                <td>Dealer Fee:</td>
                <td>${formatCurrency(financingData.dealerFee)}</td>
              </tr>
              <tr>
                <td>Sales Tax (${financingData.taxRate}%):</td>
                <td>${formatCurrency(results.totalTaxes)}</td>
              </tr>
              <tr>
                <td>Emplacamento:</td>
                <td>${formatCurrency(financingData.registrationFee)}</td>
              </tr>
              ${financingData.otherFees > 0 ? `
                <tr>
                  <td>Outros Custos:</td>
                  <td>${formatCurrency(financingData.otherFees)}</td>
                </tr>
              ` : ''}
            </table>
          </div>

          ${financingData.otherFeesDescription ? `
            <div class="compact-section">
              <h3>Observações</h3>
              <p style="color: #4b5563; line-height: 1.4; font-size: 10px;">${financingData.otherFeesDescription}</p>
            </div>
          ` : ''}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  }
};
