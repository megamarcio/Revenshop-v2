
import { FinancingData, CalculationResults } from '../types';

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(value);
};

export const exportToPDF = (financingData: FinancingData, results: CalculationResults) => {
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(`
      <html>
        <head>
          <title>Simulação de Financiamento - RevenShop</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
              font-family: 'Segoe UI', 'Arial', sans-serif; 
              margin: 30px; 
              color: #1a1a1a;
              line-height: 1.5;
              background: #ffffff;
            }
            .header { 
              display: flex;
              align-items: center;
              justify-content: space-between;
              border-bottom: 2px solid #e5e7eb;
              padding-bottom: 25px;
              margin-bottom: 40px;
            }
            .logo-section {
              display: flex;
              align-items: center;
              gap: 20px;
            }
            .logo {
              width: 70px;
              height: 70px;
              background: linear-gradient(135deg, #3b82f6, #1d4ed8);
              border-radius: 12px;
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-weight: bold;
              font-size: 24px;
              box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
            }
            .company-info h1 {
              color: #1f2937;
              font-size: 32px;
              font-weight: 700;
              margin-bottom: 5px;
            }
            .company-info p {
              color: #6b7280;
              font-size: 16px;
              font-weight: 500;
            }
            .document-info {
              text-align: right;
              color: #6b7280;
            }
            .document-info h2 {
              color: #1f2937;
              margin-bottom: 8px;
              font-size: 20px;
            }
            .document-info p {
              font-size: 14px;
              margin-bottom: 2px;
            }

            .highlight-section {
              background: linear-gradient(135deg, #f0f9ff, #e0f2fe);
              border: 2px solid #0ea5e9;
              border-radius: 16px;
              padding: 30px;
              margin: 30px 0;
              text-align: center;
            }
            .highlight-section h3 {
              color: #0369a1;
              font-size: 24px;
              margin-bottom: 25px;
              font-weight: 600;
            }
            .payment-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 25px;
              max-width: 600px;
              margin: 0 auto;
            }
            .payment-item {
              background: white;
              padding: 20px;
              border-radius: 12px;
              border: 1px solid #cbd5e1;
              box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
            }
            .payment-label {
              color: #64748b;
              font-size: 14px;
              font-weight: 500;
              margin-bottom: 8px;
            }
            .payment-value {
              color: #0f172a;
              font-size: 28px;
              font-weight: 700;
            }

            .section { 
              margin: 35px 0;
              background: #fafafa;
              padding: 25px;
              border-radius: 12px;
              border-left: 4px solid #3b82f6;
            }
            .section h3 {
              color: #1f2937;
              margin-bottom: 20px;
              font-size: 20px;
              font-weight: 600;
              border-bottom: 1px solid #e5e7eb;
              padding-bottom: 10px;
            }
            .info-grid { 
              display: grid; 
              grid-template-columns: 1fr 1fr; 
              gap: 18px; 
            }
            .info-item {
              background: white;
              padding: 15px;
              border-radius: 8px;
              border: 1px solid #e5e7eb;
            }
            .label { 
              font-weight: 600; 
              color: #374151;
              display: block;
              margin-bottom: 6px;
              font-size: 14px;
            }
            .value {
              color: #1f2937;
              font-size: 16px;
              font-weight: 500;
            }

            .vehicle-section {
              margin: 35px 0;
              text-align: center;
            }
            .vehicle-image {
              max-width: 400px;
              max-height: 250px;
              border-radius: 12px;
              box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
              margin: 20px auto;
              display: block;
            }
            .no-image {
              width: 400px;
              height: 200px;
              background: #f1f5f9;
              border: 2px dashed #cbd5e1;
              border-radius: 12px;
              display: flex;
              align-items: center;
              justify-content: center;
              margin: 20px auto;
              color: #64748b;
              font-style: italic;
            }

            .breakdown-table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 15px;
            }
            .breakdown-table tr {
              border-bottom: 1px solid #e5e7eb;
            }
            .breakdown-table td {
              padding: 12px 0;
              font-size: 14px;
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

          ${financingData.customer ? `
            <div class="section">
              <h3>Informações do Cliente</h3>
              <div class="info-grid">
                <div class="info-item">
                  <span class="label">Nome:</span>
                  <span class="value">${financingData.customer.name}</span>
                </div>
                <div class="info-item">
                  <span class="label">Telefone:</span>
                  <span class="value">${financingData.customer.phone}</span>
                </div>
                ${financingData.customer.email ? `
                  <div class="info-item">
                    <span class="label">Email:</span>
                    <span class="value">${financingData.customer.email}</span>
                  </div>
                ` : ''}
              </div>
            </div>
          ` : ''}

          ${financingData.vehicle ? `
            <div class="section">
              <h3>Informações do Veículo</h3>
              <div class="info-grid">
                <div class="info-item">
                  <span class="label">Veículo:</span>
                  <span class="value">${financingData.vehicle.name} ${financingData.vehicle.year}</span>
                </div>
                <div class="info-item">
                  <span class="label">Cor:</span>
                  <span class="value">${financingData.vehicle.color}</span>
                </div>
                <div class="info-item">
                  <span class="label">VIN:</span>
                  <span class="value">${financingData.vehicle.vin}</span>
                </div>
                <div class="info-item">
                  <span class="label">Preço de Venda:</span>
                  <span class="value">${formatCurrency(financingData.vehicle.sale_price)}</span>
                </div>
              </div>
            </div>
          ` : ''}

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

          ${financingData.vehicle ? `
            <div class="vehicle-section">
              <h3>Veículo</h3>
              ${financingData.vehicle.image_url ? `
                <img src="${financingData.vehicle.image_url}" alt="${financingData.vehicle.name} ${financingData.vehicle.year}" class="vehicle-image" />
              ` : `
                <div class="no-image">
                  Imagem do veículo não disponível
                </div>
              `}
            </div>
          ` : ''}

          ${financingData.otherFeesDescription ? `
            <div class="section">
              <h3>Observações</h3>
              <p style="color: #4b5563; line-height: 1.6;">${financingData.otherFeesDescription}</p>
            </div>
          ` : ''}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  }
};
