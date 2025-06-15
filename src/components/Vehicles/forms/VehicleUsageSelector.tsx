
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface VehicleUsageSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const VehicleUsageSelector = ({ value, onChange }: VehicleUsageSelectorProps) => {
  return (
    <div>
      <Label htmlFor="vehicleUsage">Uso do Veículo</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="Selecione o uso do veículo" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="personal">Pessoal</SelectItem>
          <SelectItem value="rental">Aluguel</SelectItem>
          <SelectItem value="sale">Venda</SelectItem>
          <SelectItem value="consigned">Consignado</SelectItem>
          <SelectItem value="sale-rental">Venda/Aluguel</SelectItem>
          <SelectItem value="maintenance">Manutenção</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default VehicleUsageSelector;
