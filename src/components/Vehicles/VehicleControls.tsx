
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Filter } from 'lucide-react';

interface VehicleControlsProps {
  onCategoryChange: (category: string) => void;
  categoryFilter?: string;
}

const VehicleControls = ({ onCategoryChange, categoryFilter = 'all' }: VehicleControlsProps) => {
  return (
    <div className="flex items-center space-x-2">
      <Filter className="h-4 w-4 text-gray-400" />
      <Select value={categoryFilter} onValueChange={onCategoryChange}>
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Filtrar por categoria" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos</SelectItem>
          <SelectItem value="forSale">À Venda</SelectItem>
          <SelectItem value="sold">Vendidos</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default VehicleControls;
