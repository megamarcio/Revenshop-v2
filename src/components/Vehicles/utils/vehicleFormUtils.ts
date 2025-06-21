import { VehicleFormData } from '../types/vehicleFormTypes';

export const validateRequiredFields = (formData: VehicleFormData): { [key: string]: string } => {
  const errors: { [key: string]: string } = {};

  console.log('validateRequiredFields - validating formData:', formData);

  // Helper function to check if a field is empty or invalid
  const isEmpty = (value: string | undefined | null): boolean => {
    if (value === null || value === undefined) return true;
    const trimmedValue = String(value).trim();
    return trimmedValue === '' || trimmedValue === '0';
  };

  if (isEmpty(formData.name)) {
    errors.name = 'Nome do veículo é obrigatório';
    console.log('validateRequiredFields - name is empty:', formData.name);
  }

  if (isEmpty(formData.vin)) {
    errors.vin = 'VIN é obrigatório';
    console.log('validateRequiredFields - vin is empty:', formData.vin);
  }

  if (isEmpty(formData.year)) {
    errors.year = 'Ano é obrigatório';
    console.log('validateRequiredFields - year is empty:', formData.year);
  }

  if (isEmpty(formData.model)) {
    errors.model = 'Modelo é obrigatório';
    console.log('validateRequiredFields - model is empty:', formData.model);
  }

  if (isEmpty(formData.miles)) {
    errors.miles = 'Milhagem é obrigatória';
    console.log('validateRequiredFields - miles is empty:', formData.miles);
  }

  if (isEmpty(formData.internalCode)) {
    errors.internalCode = 'Código interno é obrigatório';
    console.log('validateRequiredFields - internalCode is empty:', formData.internalCode);
  }

  if (isEmpty(formData.color)) {
    errors.color = 'Cor é obrigatória';
    console.log('validateRequiredFields - color is empty:', formData.color);
  }

  if (isEmpty(formData.purchasePrice)) {
    errors.purchasePrice = 'Preço de compra é obrigatório';
    console.log('validateRequiredFields - purchasePrice is empty:', formData.purchasePrice);
  }

  if (isEmpty(formData.salePrice)) {
    errors.salePrice = 'Preço de venda é obrigatório';
    console.log('validateRequiredFields - salePrice is empty:', formData.salePrice);
  }

  console.log('validateRequiredFields - validation errors found:', errors);
  console.log('validateRequiredFields - total errors count:', Object.keys(errors).length);

  return errors;
};

// Função para validar o formulário completo
export const validateForm = (formData: VehicleFormData): { [key: string]: string } => {
  console.log('validateForm - starting validation for formData:', formData);
  const errors = validateRequiredFields(formData);
  console.log('validateForm - final validation result:', errors);
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
  
  const margin = (sale / purchase - 1) * 100;
  return margin.toFixed(2);
};
