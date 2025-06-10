
import { VehicleFormData } from '../types/vehicleFormTypes';

export const getTitleInfo = (vehicle: any): string => {
  console.log('VehicleForm - getTitleInfo called with:', vehicle);
  
  // First try to use the titleInfo field directly (from mapDbDataToAppData)
  if (vehicle?.titleInfo) {
    console.log('VehicleForm - using titleInfo directly:', vehicle.titleInfo);
    return vehicle.titleInfo;
  }
  
  // Fallback: build from separate fields if titleInfo is not available
  const parts = [];
  
  if (vehicle?.title_type) {
    parts.push(vehicle.title_type);
  }
  
  if (vehicle?.title_status) {
    parts.push(vehicle.title_status);
  }
  
  const result = parts.join('-');
  console.log('VehicleForm - built titleInfo from parts:', result, 'from fields:', {
    title_type: vehicle?.title_type,
    title_status: vehicle?.title_status
  });
  
  return result;
};

export const formatCurrency = (value: string): string => {
  const num = parseFloat(value);
  if (isNaN(num)) return '$0.00';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(num);
};

export const generateDescription = (formData: VehicleFormData): string => {
  const year = formData.year;
  const name = formData.name;
  const color = formData.color;
  const price = formatCurrency(formData.salePrice);
  const vin = formData.vin;
  const miles = formData.miles; // CORRECTED: Use miles instead of plate
  
  // Format title information
  let titleInfo = 'Clean Title';
  if (formData.titleInfo) {
    const parts = formData.titleInfo.split('-');
    if (parts.length >= 2) {
      const titleType = parts[0] === 'clean-title' ? 'Clean Title' : 'Rebuilt';
      const status = parts.slice(1).join('-');
      const statusFormatted = status === 'em-maos' ? 'In Hands' : 
                             status === 'em-transito' ? 'In Transit' : status;
      titleInfo = `${titleType} - ${statusFormatted}`;
    }
  }
  
  return `🚗 ${year} ${name} – ${titleInfo} 🚗

📍 Located in Orlando, FL
💰 Price: ${price}

✅ Only ${miles} miles
✅ Clean Title – No Accidents
✅ Non-smoker
✅ Runs and drives like new!
✅ Up to 35 MPG – Super Fuel Efficient

🛠️ Recent Maintenance Done:
• Fresh oil change
• Good tires
• Brake pads replaced
• Cold A/C just serviced

🧰 Features:
• Backup Camera
• Bluetooth & USB
• Touchscreen Display
• Sport Mode
• Alloy Wheels
• Cruise Control
• Keyless Entry

📋 VIN ${vin}
💼 Financing available
🧽 Clean inside & out – Ready to go!
💵 You're Welcome

⚠️ Serious buyers only. Test drives by appointment.
📲 Send a message now.`;
};

export const validateForm = (formData: VehicleFormData): Record<string, string> => {
  const newErrors: Record<string, string> = {};

  // Basic required validations
  if (!formData.name.trim()) newErrors.name = 'Nome é obrigatório';
  if (!formData.vin.trim()) newErrors.vin = 'VIN é obrigatório';
  if (!formData.year.trim()) newErrors.year = 'Ano é obrigatório';
  if (!formData.model.trim()) newErrors.model = 'Modelo é obrigatório';
  if (!formData.miles.trim()) newErrors.miles = 'Milhas são obrigatórias'; // CORRECTED: Use miles instead of plate
  if (!formData.internalCode.trim()) newErrors.internalCode = 'Código interno é obrigatório';
  if (!formData.color.trim()) newErrors.color = 'Cor é obrigatória';
  if (!formData.purchasePrice.trim()) newErrors.purchasePrice = 'Valor de compra é obrigatório';
  if (!formData.salePrice.trim()) newErrors.salePrice = 'Valor de venda é obrigatório';

  // Consignment validation
  if (formData.category === 'consigned' && !formData.consignmentStore?.trim()) {
    newErrors.consignmentStore = 'Nome da loja é obrigatório para veículos consignados';
  }

  // Miles validation - CORRECTED: Use miles instead of plate
  const miles = parseInt(formData.miles);
  if (isNaN(miles) || miles < 0 || miles > 500000) {
    newErrors.miles = 'Milhas devem estar entre 0 e 500,000';
  }

  // CA Note validation
  const caNote = parseInt(formData.caNote);
  if (isNaN(caNote) || caNote < 0 || caNote > 50 || caNote % 5 !== 0) {
    newErrors.caNote = 'Nota CA deve ser múltiplo de 5 entre 0 e 50';
  }

  return newErrors;
};

export const calculateProfitMargin = (purchasePrice: string, salePrice: string): string => {
  const purchase = parseFloat(purchasePrice);
  const sale = parseFloat(salePrice);
  if (purchase > 0 && sale > 0) {
    return (sale / purchase).toFixed(2);
  }
  return '0.00';
};
