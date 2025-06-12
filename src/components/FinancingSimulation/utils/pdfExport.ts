
import { FinancingData, CalculationResults } from '../types';
import { getVehicleMainPhoto } from './vehiclePhotoService';
import { PDF_STYLES } from './pdfStyles';
import {
  generateHeaderSection,
  generateCustomerSection,
  generateVehicleSection,
  generateFinancingSection,
  generateDetailsSection,
  generateObservationsSection
} from './pdfTemplates';

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
          <style>${PDF_STYLES}</style>
        </head>
        <body>
          ${generateHeaderSection()}

          <div class="two-column">
            <div>
              ${generateCustomerSection(financingData.customer)}
              ${generateVehicleSection(financingData.vehicle, vehicleImageUrl)}
            </div>

            <div>
              ${generateFinancingSection(financingData, results)}
            </div>
          </div>

          ${generateDetailsSection(financingData, results)}
          ${generateObservationsSection(financingData.otherFeesDescription)}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  }
};
