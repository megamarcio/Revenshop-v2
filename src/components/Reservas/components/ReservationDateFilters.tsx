
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

  const formatDateForDisplay = (dateString: string) => {
    // Usar apenas a data local sem conversão de timezone para evitar o problema do dia anterior
    const [year, month, day] = dateString.split('-');
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day)).toLocaleDateString('pt-BR');
  };

  const isSearchDisabled = !startDate || !endDate || loading || !!validationError;

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Calendar className="h-5 w-5" />
          Buscar Reservas por Período
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div>
            <label className="block text-sm font-medium mb-1">Data Inicial</label>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                setValidationError('');
              }}
              className="w-full text-sm"
              max={endDate || undefined}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Data Final</label>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                setValidationError('');
              }}
              className="w-full text-sm"
              min={startDate || undefined}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Campo de Data</label>
            <Select value={dateField} onValueChange={(value: 'created_at' | 'updated_at') => setDateField(value)}>
              <SelectTrigger className="text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="created_at">Data de Criação</SelectItem>
                <SelectItem value="updated_at">Última Atualização</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-end gap-1">
            <Button 
              onClick={handleSearch} 
              disabled={isSearchDisabled}
              className="flex-1 h-9 text-xs"
              size="sm"
            >
              <Search className="h-3 w-3 mr-1" />
              {loading ? 'Buscando...' : 'Buscar'}
            </Button>
            {hasResults && (
              <Button 
                onClick={handleClear} 
                variant="outline"
                className="flex-1 h-9 text-xs"
                size="sm"
              >
                <X className="h-3 w-3 mr-1" />
                Limpar
              </Button>
            )}
          </div>
        </div>
        
        {validationError && (
          <div className="mt-2 flex items-center gap-2 text-red-600 text-xs">
            <AlertCircle className="h-3 w-3" />
            {validationError}
          </div>
        )}
        
        {(startDate && endDate && !validationError) && (
          <div className="mt-2 text-xs text-muted-foreground">
            Período selecionado: {formatDateForDisplay(startDate)} - {formatDateForDisplay(endDate)}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ReservationDateFilters;
