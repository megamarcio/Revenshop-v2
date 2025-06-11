
import { VehicleFormData } from '@/components/Vehicles/types/vehicleFormTypes';

export const mapFormToDbData = (formData: VehicleFormData & { id?: string }) => {
  const dbData: any = {
    name: formData.name,
    vin: formData.vin,
    year: parseInt(formData.year),
    model: formData.model,
    miles: parseInt(formData.miles),
    internal_code: formData.internalCode,
    color: formData.color,
    title_type_id: formData.titleTypeId || null,
    title_location_id: formData.titleLocationId || null,
    title_location_custom: formData.titleLocationCustom || null,
    purchase_price: parseFloat(formData.purchasePrice),
    sale_price: parseFloat(formData.salePrice),
    min_negotiable: formData.minNegotiable ? parseFloat(formData.minNegotiable) : null,
    carfax_price: formData.carfaxPrice ? parseFloat(formData.carfaxPrice) : null,
    mmr_value: formData.mmrValue ? parseFloat(formData.mmrValue) : null,
    description: formData.description || null,
    category: formData.category,
    
    // Campos de financiamento
    financing_bank: formData.financingBank || null,
    financing_type: formData.financingType || null,
    original_financed_name: formData.originalFinancedName || null,
    purchase_date: formData.purchaseDate || null,
    due_date: formData.dueDate || null,
    installment_value: formData.installmentValue ? parseFloat(formData.installmentValue) : null,
    down_payment: formData.downPayment ? parseFloat(formData.downPayment) : null,
    financed_amount: formData.financedAmount ? parseFloat(formData.financedAmount) : null,
    total_installments: formData.totalInstallments ? parseInt(formData.totalInstallments) : null,
    paid_installments: formData.paidInstallments ? parseInt(formData.paidInstallments) : null,
    remaining_installments: formData.remainingInstallments ? parseInt(formData.remainingInstallments) : null,
    total_to_pay: formData.totalToPay ? parseFloat(formData.totalToPay) : null,
    payoff_value: formData.payoffValue ? parseFloat(formData.payoffValue) : null,
    payoff_date: formData.payoffDate || null,
    interest_rate: formData.interestRate ? parseFloat(formData.interestRate) : null,
    custom_financing_bank: formData.customFinancingBank || null,
  };

  // Incluir ID se estiver editando
  if (formData.id) {
    dbData.id = formData.id;
  }

  return dbData;
};
