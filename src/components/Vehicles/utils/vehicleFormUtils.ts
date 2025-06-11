
import { VehicleFormData } from '../types/vehicleFormTypes';

export const getTitleInfo = (vehicle?: any): string => {
  if (!vehicle) return '';
  
  console.log('getTitleInfo - vehicle received:', vehicle);
  console.log('getTitleInfo - title_type:', vehicle.title_type, 'title_status:', vehicle.title_status);
  
  // Se já existe titleInfo, usar ela
  if (vehicle.titleInfo) {
    console.log('getTitleInfo - using existing titleInfo:', vehicle.titleInfo);
    return vehicle.titleInfo;
  }
  
  // Reconstruct from separate fields
  let titleInfo = '';
  if (vehicle.title_type) {
    titleInfo = vehicle.title_type;
    if (vehicle.title_status) {
      titleInfo += `-${vehicle.title_status}`;
    }
  }
  
  console.log('getTitleInfo - reconstructed titleInfo:', titleInfo);
  return titleInfo;
};

export const validateForm = (formData: VehicleFormData): Partial<VehicleFormData> => {
  const errors: Partial<VehicleFormData> = {};

  if (!formData.name.trim()) {
    errors.name = 'Nome é obrigatório';
  }

  if (!formData.vin.trim()) {
    errors.vin = 'VIN é obrigatório';
  }

  if (!formData.year || parseInt(formData.year) < 1900 || parseInt(formData.year) > new Date().getFullYear() + 1) {
    errors.year = 'Ano inválido';
  }

  if (!formData.model.trim()) {
    errors.model = 'Modelo é obrigatório';
  }

  // ADICIONADO: validação para miles
  if (!formData.miles || parseInt(formData.miles) < 0) {
    errors.miles = 'Quilometragem é obrigatória e deve ser um número positivo';
  }

  if (!formData.internalCode.trim()) {
    errors.internalCode = 'Código interno é obrigatório';
  }

  if (!formData.color.trim()) {
    errors.color = 'Cor é obrigatória';
  }

  if (!formData.caNote || parseInt(formData.caNote) < 1 || parseInt(formData.caNote) > 10) {
    errors.caNote = 'CA Note deve ser entre 1 e 10';
  }

  if (!formData.purchasePrice || parseFloat(formData.purchasePrice) <= 0) {
    errors.purchasePrice = 'Preço de compra é obrigatório';
  }

  if (!formData.salePrice || parseFloat(formData.salePrice) <= 0) {
    errors.salePrice = 'Preço de venda é obrigatório';
  }

  return errors;
};

export const generateDescription = (formData: VehicleFormData): string => {
  const { name, year, model, color, miles } = formData;
  
  let description = `${year} ${name} ${model}`;
  
  if (color) {
    description += ` - Cor: ${color}`;
  }
  
  if (miles && parseInt(miles) > 0) {
    description += ` - ${parseInt(miles).toLocaleString()} miles`;
  }
  
  description += '\n\nVeículo em excelente estado de conservação.';
  
  return description;
};

export const calculateProfitMargin = (purchasePrice: string, salePrice: string): string => {
  const purchase = parseFloat(purchasePrice);
  const sale = parseFloat(salePrice);
  
  if (purchase > 0 && sale > 0) {
    const margin = sale / purchase;
    return `${margin.toFixed(2)}x`;
  }
  
  return '0x';
};
