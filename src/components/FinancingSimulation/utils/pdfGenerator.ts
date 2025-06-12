
import { FinancingData, CalculationResults } from '../types';
import { generatePDFContent } from './pdfExport';

export const generatePDF = async (
  financingData: FinancingData, 
  customerData: any, 
  vehicleData: any, 
  returnBlob: boolean = false
): Promise<Blob | void> => {
  try {
    const htmlContent = await generatePDFContent(financingData, {
      downPaymentAmount: financingData.downPayment,
      financedAmount: financingData.vehiclePrice - financingData.downPayment,
      monthlyPayment: ((financingData.vehiclePrice - financingData.downPayment) * (1 + financingData.interestRate / 100)) / financingData.installments,
      totalTaxes: financingData.vehiclePrice * (financingData.taxRate / 100),
    } as CalculationResults);

    if (returnBlob) {
      // Create a simple blob with the HTML content for email attachment
      const blob = new Blob([htmlContent], { type: 'text/html' });
      return blob;
    } else {
      // Open print dialog for PDF generation
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(htmlContent);
        printWindow.document.close();
        printWindow.print();
      }
    }
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};
