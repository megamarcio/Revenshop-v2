
import { VehicleFormData } from '../types/vehicleFormTypes';

export const validateRequiredFields = (formData: VehicleFormData): { [key: string]: string } => {
  const errors: { [key: string]: string } = {};

  if (!formData.name) {
    errors.name = 'Nome do veículo é obrigatório';
  }

  if (!formData.vin) {
    errors.vin = 'VIN é obrigatório';
  }

  if (!formData.year) {
    errors.year = 'Ano é obrigatório';
  }

  if (!formData.model) {
    errors.model = 'Modelo é obrigatório';
  }

  if (!formData.miles) {
    errors.miles = 'Milhas é obrigatório';
  }

  if (!formData.internalCode) {
    errors.internalCode = 'Código interno é obrigatório';
  }

  if (!formData.color) {
    errors.color = 'Cor é obrigatória';
  }

  if (!formData.purchasePrice) {
    errors.purchasePrice = 'Preço de compra é obrigatório';
  }

  if (!formData.salePrice) {
    errors.salePrice = 'Preço de venda é obrigatório';
  }

  return errors;
};

export const formatCurrency = (value: string): string => {
  // Remove all non-numeric characters except decimal point
  const numericValue = value.replace(/[^\d.]/g, '');
  
  // Parse as float and format as currency
  const parsed = parseFloat(numericValue);
  if (isNaN(parsed)) return '';
  
  return parsed.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

export const parseCurrency = (value: string): number => {
  const numericValue = value.replace(/[^\d.]/g, '');
  return parseFloat(numericValue) || 0;
};

export const calculateProfitMargin = (purchasePrice: string, salePrice: string): string => {
  const purchase = parseCurrency(purchasePrice);
  const sale = parseCurrency(salePrice);
  
  if (purchase === 0 || sale === 0) return '0.00';
  
  const margin = ((sale - purchase) / purchase) * 100;
  return margin.toFixed(2);
};
