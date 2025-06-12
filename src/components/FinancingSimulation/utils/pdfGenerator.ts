
import { FinancingData, CalculationResults } from '../types';
import { getVehicleMainPhoto } from './vehiclePhotoService';
import { formatCurrency } from './formatters';

export const generatePDFContent = async (
  financingData: FinancingData, 
  results: CalculationResults
): Promise<string> => {
  let vehicleImageUrl = null;
  
  // Buscar a foto do veículo se disponível
  if (financingData.vehicle?.id) {
    vehicleImageUrl = await getVehicleMainPhoto(financingData.vehicle.id);
  }

  return `
    <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px; border-bottom: 1px solid #ddd; padding-bottom: 20px;">
        <h1 style="color: #1f2937; margin-bottom: 10px;">RevenShop</h1>
        <h2 style="color: #6b7280; font-size: 18px;">Simulação de Financiamento Automotivo</h2>
        <p style="color: #6b7280;">Data: ${new Date().toLocaleDateString('pt-BR')}</p>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px;">
        <div style="background: #f9fafb; padding: 15px; border-radius: 8px;">
          <h3 style="color: #1f2937; margin-bottom: 10px;">Informações do Cliente</h3>
          <p><strong>Nome:</strong> ${financingData.customer?.name}</p>
          <p><strong>Telefone:</strong> ${financingData.customer?.phone}</p>
          ${financingData.customer?.email ? `<p><strong>Email:</strong> ${financingData.customer.email}</p>` : ''}
        </div>

        <div style="background: #f9fafb; padding: 15px; border-radius: 8px;">
          <h3 style="color: #1f2937; margin-bottom: 10px;">Informações do Veículo</h3>
          <p><strong>Veículo:</strong> ${financingData.vehicle?.name} ${financingData.vehicle?.year}</p>
          <p><strong>Cor:</strong> ${financingData.vehicle?.color}</p>
          <p><strong>VIN:</strong> ${financingData.vehicle?.vin}</p>
          <p><strong>Preço:</strong> ${formatCurrency(financingData.vehicle?.sale_price || 0)}</p>
          ${vehicleImageUrl ? `
            <img src="${vehicleImageUrl}" alt="${financingData.vehicle?.name} ${financingData.vehicle?.year}" 
                 style="max-width: 200px; max-height: 120px; border-radius: 6px; margin-top: 10px;" />
          ` : ''}
        </div>
      </div>

      <div style="background: linear-gradient(135deg, #f0f9ff, #e0f2fe); padding: 20px; margin: 20px 0; text-align: center; border-radius: 8px;">
        <h3 style="color: #0369a1; margin-bottom: 15px;">Proposta de Financiamento</h3>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; max-width: 500px; margin: 0 auto;">
          <div style="background: white; padding: 15px; border-radius: 6px;">
            <div style="color: #64748b; font-size: 12px; margin-bottom: 5px;">Down Payment</div>
            <div style="color: #0f172a; font-size: 20px; font-weight: bold;">${formatCurrency(results.downPaymentAmount)}</div>
          </div>
          <div style="background: white; padding: 15px; border-radius: 6px;">
            <div style="color: #64748b; font-size: 12px; margin-bottom: 5px;">Financiamento</div>
            <div style="color: #0f172a; font-size: 20px; font-weight: bold;">${financingData.installments}x de ${formatCurrency(results.monthlyPayment)}</div>
          </div>
        </div>
      </div>

      <div style="background: #f9fafb; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
        <h3 style="color: #1f2937; margin-bottom: 10px;">Detalhes do Financiamento</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr style="border-bottom: 1px solid #e5e7eb;">
            <td style="padding: 6px 0; color: #6b7280;">Valor do Veículo:</td>
            <td style="text-align: right; color: #1f2937; font-weight: 600;">${formatCurrency(financingData.vehiclePrice)}</td>
          </tr>
          <tr style="border-bottom: 1px solid #e5e7eb;">
            <td style="padding: 6px 0; color: #6b7280;">Down Payment:</td>
            <td style="text-align: right; color: #1f2937; font-weight: 600;">${formatCurrency(results.downPaymentAmount)}</td>
          </tr>
          <tr style="border-bottom: 1px solid #e5e7eb;">
            <td style="padding: 6px 0; color: #6b7280;">Valor Financiado:</td>
            <td style="text-align: right; color: #1f2937; font-weight: 600;">${formatCurrency(results.financedAmount)}</td>
          </tr>
          <tr style="border-bottom: 1px solid #e5e7eb;">
            <td style="padding: 6px 0; color: #6b7280;">Taxa de Juros:</td>
            <td style="text-align: right; color: #1f2937; font-weight: 600;">${financingData.interestRate}% ao ano</td>
          </tr>
          <tr style="border-bottom: 1px solid #e5e7eb;">
            <td style="padding: 6px 0; color: #6b7280;">Dealer Fee:</td>
            <td style="text-align: right; color: #1f2937; font-weight: 600;">${formatCurrency(financingData.dealerFee)}</td>
          </tr>
          <tr style="border-bottom: 1px solid #e5e7eb;">
            <td style="padding: 6px 0; color: #6b7280;">Sales Tax (${financingData.taxRate}%):</td>
            <td style="text-align: right; color: #1f2937; font-weight: 600;">${formatCurrency(results.totalTaxes)}</td>
          </tr>
          <tr style="border-bottom: 1px solid #e5e7eb;">
            <td style="padding: 6px 0; color: #6b7280;">Emplacamento:</td>
            <td style="text-align: right; color: #1f2937; font-weight: 600;">${formatCurrency(financingData.registrationFee)}</td>
          </tr>
          ${financingData.otherFees > 0 ? `
            <tr style="border-bottom: 1px solid #e5e7eb;">
              <td style="padding: 6px 0; color: #6b7280;">Outros Custos:</td>
              <td style="text-align: right; color: #1f2937; font-weight: 600;">${formatCurrency(financingData.otherFees)}</td>
            </tr>
          ` : ''}
        </table>
      </div>

      ${financingData.otherFeesDescription ? `
        <div style="background: #f9fafb; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
          <h3 style="color: #1f2937; margin-bottom: 10px;">Observações</h3>
          <p style="color: #4b5563; line-height: 1.4;">${financingData.otherFeesDescription}</p>
        </div>
      ` : ''}

      <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #6b7280; font-size: 12px;">
        <p><strong>RevenShop</strong></p>
        <p>Simulação de Financiamento Automotivo</p>
        <p>Email: vendas@revenshop.com | Telefone: (555) 123-4567</p>
      </div>
    </div>
  `;
};
