
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Search, X } from 'lucide-react';

interface ReservationDateFiltersProps {
  onSearch: (startDate: string, endDate: string, dateField: 'created_at' | 'updated_at') => void;
  onClear: () => void;
  loading: boolean;
  hasResults: boolean;
}

const ReservationDateFilters = ({ onSearch, onClear, loading, hasResults }: ReservationDateFiltersProps) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [dateField, setDateField] = useState<'created_at' | 'updated_at'>('created_at');

  const handleSearch = () => {
    if (startDate && endDate) {
      onSearch(startDate, endDate, dateField);
    }
  };

  const handleClear = () => {
    setStartDate('');
    setEndDate('');
    setDateField('created_at');
    onClear();
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Buscar Reservas por Período
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Data Inicial</label>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Data Final</label>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Campo de Data</label>
            <Select value={dateField} onValueChange={(value: 'created_at' | 'updated_at') => setDateField(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="created_at">Data de Criação</SelectItem>
                <SelectItem value="updated_at">Última Atualização</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-end gap-2">
            <Button 
              onClick={handleSearch} 
              disabled={!startDate || !endDate || loading}
              className="flex-1"
            >
              <Search className="h-4 w-4 mr-2" />
              Buscar
            </Button>
            {hasResults && (
              <Button 
                onClick={handleClear} 
                variant="outline"
                className="flex-1"
              >
                <X className="h-4 w-4 mr-2" />
                Limpar
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReservationDateFilters;
