
import { FinancingData, CalculationResults } from '../types';
import { exportToPDF } from './pdfExport';

export const generatePDFContent = async (
  financingData: FinancingData, 
  results: CalculationResults
): Promise<string> => {
  // This function generates HTML content for PDF
  // For now, we'll use a simple HTML template
  return `
    <html>
      <head>
        <title>Simulação de Financiamento</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          .section { margin-bottom: 20px; }
          .label { font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Simulação de Financiamento</h1>
        </div>
        <div class="section">
          <div class="label">Cliente:</div>
          <div>${financingData.customer?.name || 'N/A'}</div>
        </div>
        <div class="section">
          <div class="label">Veículo:</div>
          <div>${financingData.vehicle?.name || 'N/A'}</div>
        </div>
        <div class="section">
          <div class="label">Valor do Veículo:</div>
          <div>R$ ${financingData.vehiclePrice.toFixed(2)}</div>
        </div>
        <div class="section">
          <div class="label">Entrada:</div>
          <div>R$ ${results.downPaymentAmount.toFixed(2)}</div>
        </div>
        <div class="section">
          <div class="label">Valor Financiado:</div>
          <div>R$ ${results.financedAmount.toFixed(2)}</div>
        </div>
        <div class="section">
          <div class="label">Parcela Mensal:</div>
          <div>R$ ${results.monthlyPayment.toFixed(2)}</div>
        </div>
        <div class="section">
          <div class="label">Total de Impostos:</div>
          <div>R$ ${results.totalTaxes.toFixed(2)}</div>
        </div>
      </body>
    </html>
  `;
};

export const generatePDF = async (
  financingData: FinancingData, 
  customerData: any, 
  vehicleData: any, 
  returnBlob: boolean = false
): Promise<Blob | void> => {
  try {
    const results: CalculationResults = {
      downPaymentAmount: financingData.downPayment,
      financedAmount: financingData.vehiclePrice - financingData.downPayment,
      monthlyPayment: ((financingData.vehiclePrice - financingData.downPayment) * (1 + financingData.interestRate / 100)) / financingData.installments,
      totalTaxes: financingData.vehiclePrice * (financingData.taxRate / 100),
      totalFees: 0,
      totalLoanAmount: financingData.vehiclePrice - financingData.downPayment,
      totalAmount: financingData.vehiclePrice
    };

    if (returnBlob) {
      // Create a simple blob with the HTML content for email attachment
      const htmlContent = await generatePDFContent(financingData, results);
      const blob = new Blob([htmlContent], { type: 'text/html' });
      return blob;
    } else {
      // Use the existing exportToPDF function for printing
      await exportToPDF(financingData, results);
    }
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};
