
import React from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface VehicleSearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const VehicleSearchBar = ({ searchTerm, onSearchChange }: VehicleSearchBarProps) => {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
      <Input
        placeholder="Buscar por nome, VIN ou código interno..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="pl-10"
      />
    </div>
  );
};

export default VehicleSearchBar;
