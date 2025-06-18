
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Search, X, AlertCircle } from 'lucide-react';

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
  const [validationError, setValidationError] = useState('');

  const validateDates = () => {
    if (!startDate || !endDate) {
      setValidationError('Por favor, selecione ambas as datas');
      return false;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (start > end) {
      setValidationError('A data inicial deve ser anterior à data final');
      return false;
    }

    // Verificar se o período não é muito grande (máximo 1 ano)
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays > 365) {
      setValidationError('Período máximo permitido: 1 ano');
      return false;
    }

    setValidationError('');
    return true;
  };

  const handleSearch = () => {
    if (validateDates()) {
      onSearch(startDate, endDate, dateField);
    }
  };

  const handleClear = () => {
    setStartDate('');
    setEndDate('');
    setDateField('created_at');
    setValidationError('');
    onClear();
  };

  const isSearchDisabled = !startDate || !endDate || loading || !!validationError;

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
              onChange={(e) => {
                setStartDate(e.target.value);
                setValidationError('');
              }}
              className="w-full"
              max={endDate || undefined}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Data Final</label>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                setValidationError('');
              }}
              className="w-full"
              min={startDate || undefined}
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
              disabled={isSearchDisabled}
              className="flex-1"
            >
              <Search className="h-4 w-4 mr-2" />
              {loading ? 'Buscando...' : 'Buscar'}
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
        
        {validationError && (
          <div className="mt-3 flex items-center gap-2 text-red-600 text-sm">
            <AlertCircle className="h-4 w-4" />
            {validationError}
          </div>
        )}
        
        {(startDate && endDate && !validationError) && (
          <div className="mt-3 text-sm text-muted-foreground">
            Período selecionado: {new Date(startDate).toLocaleDateString('pt-BR')} - {new Date(endDate).toLocaleDateString('pt-BR')}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ReservationDateFilters;
