
import { FinancingData, CalculationResults } from '../types';
import { formatCurrency } from './formatters';

export const generateHeaderSection = () => `
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
`;

export const generateCustomerSection = (customer: any) => {
  if (!customer) return '';
  
  return `
    <div class="compact-section">
      <h3>Informações do Cliente</h3>
      <div style="font-size: 10px; line-height: 1.4;">
        <p><strong>Nome:</strong> ${customer.name}</p>
        <p><strong>Telefone:</strong> ${customer.phone}</p>
        ${customer.email ? `<p><strong>Email:</strong> ${customer.email}</p>` : ''}
      </div>
    </div>
  `;
};

export const generateVehicleSection = (vehicle: any, vehicleImageUrl: string | null) => {
  if (!vehicle) return '';
  
  return `
    <div class="compact-section">
      <h3>Informações do Veículo</h3>
      <div style="font-size: 10px; line-height: 1.4;">
        <p><strong>Veículo:</strong> ${vehicle.name} ${vehicle.year}</p>
        <p><strong>Cor:</strong> ${vehicle.color}</p>
        <p><strong>VIN:</strong> ${vehicle.vin}</p>
        <p><strong>Preço:</strong> ${formatCurrency(vehicle.sale_price)}</p>
      </div>
      ${vehicleImageUrl ? `
        <img src="${vehicleImageUrl}" alt="${vehicle.name} ${vehicle.year}" class="vehicle-image" />
      ` : `
        <div class="no-image">Imagem não disponível</div>
      `}
    </div>
  `;
};

export const generateFinancingSection = (financingData: FinancingData, results: CalculationResults) => `
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
`;

export const generateDetailsSection = (financingData: FinancingData, results: CalculationResults) => `
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
`;

export const generateObservationsSection = (otherFeesDescription: string) => {
  if (!otherFeesDescription) return '';
  
  return `
    <div class="compact-section">
      <h3>Observações</h3>
      <p style="color: #4b5563; line-height: 1.4; font-size: 10px;">${otherFeesDescription}</p>
    </div>
  `;
};
