
import React from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface VehicleSearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const VehicleSearchBar = ({ searchTerm, onSearchChange }: VehicleSearchBarProps) => {
  const { t } = useLanguage();

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
      <Input
        placeholder={`${t('search')} por nome, VIN ou placa...`}
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="pl-10"
      />
    </div>
  );
};

export default VehicleSearchBar;
