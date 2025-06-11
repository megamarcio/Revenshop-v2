
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useTitleLocations } from '@/hooks/useTitleLocations';

interface TitleLocationSelectorProps {
  value: string;
  customValue: string;
  onChange: (value: string) => void;
  onCustomChange: (value: string) => void;
  error?: string;
}

const TitleLocationSelector = ({ 
  value, 
  customValue, 
  onChange, 
  onCustomChange, 
  error 
}: TitleLocationSelectorProps) => {
  const { titleLocations, loading } = useTitleLocations();

  if (loading) {
    return (
      <div className="space-y-2">
        <label className="text-sm font-medium">Local Título</label>
        <div className="h-10 bg-gray-100 animate-pulse rounded-md" />
      </div>
    );
  }

  const selectedLocation = titleLocations.find(location => location.id === value);
  const showCustomInput = selectedLocation?.allows_custom;

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Local Título</label>
      
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className={error ? "border-red-500" : ""}>
          <SelectValue placeholder="Selecione o local do título" />
        </SelectTrigger>
        <SelectContent>
          {titleLocations.map((location) => (
            <SelectItem key={location.id} value={location.id}>
              {location.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {showCustomInput && (
        <Input
          type="text"
          value={customValue}
          onChange={(e) => onCustomChange(e.target.value)}
          placeholder="Especifique o outro local"
          className="mt-2"
        />
      )}
      
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};

export default TitleLocationSelector;
