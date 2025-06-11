
import { Vehicle } from '../../hooks/useVehicles/types';

// Função para converter dados do banco para o formato do formulário
export const convertVehicleForCard = (vehicle: Vehicle) => ({
  id: vehicle.id,
  name: vehicle.name,
  vin: vehicle.vin,
  year: vehicle.year,
  model: vehicle.model,
  plate: vehicle.miles?.toString() || '',
  internalCode: vehicle.internal_code,
  color: vehicle.color,
  purchasePrice: vehicle.purchase_price,
  salePrice: vehicle.sale_price,
  profitMargin: vehicle.profit_margin || 0,
  minNegotiable: vehicle.min_negotiable || 0,
  carfaxPrice: vehicle.carfax_price || 0,
  mmrValue: vehicle.mmr_value || 0,
  description: vehicle.description || '',
  category: vehicle.category,
  photos: vehicle.photos,
  video: vehicle.video
});

export const handleExport = (vehicles: Vehicle[], format: 'csv' | 'xls') => {
  const headers = ['Nome', 'Ano', 'Cor', 'Código Interno', 'VIN', 'Preço de Compra', 'Preço de Venda', 'Status'];
  const data = vehicles.map(vehicle => [
    vehicle.name,
    vehicle.year,
    vehicle.color,
    vehicle.internal_code,
    vehicle.vin,
    vehicle.purchase_price,
    vehicle.sale_price,
    vehicle.category === 'forSale' ? 'À Venda' : 'Vendido'
  ]);

  if (format === 'csv') {
    const csvContent = [headers, ...data].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'veiculos.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  } else {
    const csvContent = [headers, ...data].map(row => row.join('\t')).join('\n');
    const blob = new Blob([csvContent], { type: 'application/vnd.ms-excel' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'veiculos.xls';
    a.click();
    window.URL.revokeObjectURL(url);
  }
};
