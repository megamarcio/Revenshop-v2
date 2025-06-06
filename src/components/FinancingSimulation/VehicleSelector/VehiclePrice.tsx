
import React from 'react';
import { DollarSign } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface VehiclePriceProps {
  vehiclePrice: number;
  onVehiclePriceChange: (price: number) => void;
}

const VehiclePrice = ({ vehiclePrice, onVehiclePriceChange }: VehiclePriceProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  return (
    <div className="space-y-2">
      <Label className="flex items-center space-x-2 text-sm">
        <DollarSign className="h-3 w-3 sm:h-4 sm:w-4" />
        <span>Valor do Veículo</span>
      </Label>
      <Input
        type="number"
        value={vehiclePrice}
        onChange={(e) => onVehiclePriceChange(parseFloat(e.target.value) || 0)}
        placeholder="Informe o valor"
        min="0"
        step="100"
        className="text-sm h-9 sm:h-10"
      />
      {vehiclePrice > 0 && (
        <p className="text-xs sm:text-sm text-gray-500">
          Valor: {formatCurrency(vehiclePrice)}
        </p>
      )}
    </div>
  );
};

export default VehiclePrice;
