
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, X } from 'lucide-react';
import { DateSearchReservation } from '@/hooks/useReservationDateSearch';
import { ReservationListItem } from '@/hooks/useReservationsList';
import CompactReservationItem from '../CompactReservationItem';

interface DateSearchResultsProps {
  results: DateSearchReservation[];
  onAddToList: (reservationId: string) => void;
}

// Adaptador para converter DateSearchReservation para ReservationListItem
const convertToReservationListItem = (searchResult: DateSearchReservation): ReservationListItem => {
  return {
    id: searchResult.id,
    data: {
      reservation: searchResult.data.reservation,
      customer: searchResult.data.customer,
      selected_vehicle_class: searchResult.data.selected_vehicle_class,
      vehicles: searchResult.data.vehicles
    },
    loading: false,
    error: null,
    temperature: '',
    notes: ''
  };
};

const DateSearchResults = ({ results, onAddToList }: DateSearchResultsProps) => {
  const [removedResults, setRemovedResults] = useState<Set<string>>(new Set());
  const [searchResultsWithTemp, setSearchResultsWithTemp] = useState<Map<string, { temperature: string; notes: string }>>(new Map());

  if (results.length === 0) {
    return null;
  }

  // Filtrar resultados removidos
  const visibleResults = results.filter(result => !removedResults.has(result.id));

  const handleRemoveFromSearch = (reservationId: string) => {
    setRemovedResults(prev => new Set([...prev, reservationId]));
  };

  const handleUpdateField = (reservationId: string, field: 'temperature' | 'notes', value: string) => {
    setSearchResultsWithTemp(prev => {
      const current = prev.get(reservationId) || { temperature: '', notes: '' };
      const updated = { ...current, [field]: value };
      const newMap = new Map(prev);
      newMap.set(reservationId, updated);
      return newMap;
    });
  };

  const handleAddToManualList = (reservationId: string) => {
    onAddToList(reservationId);
    // Opcional: remover da lista de busca após adicionar
    handleRemoveFromSearch(reservationId);
  };

  const clearAllSearchResults = () => {
    setRemovedResults(new Set());
    setSearchResultsWithTemp(new Map());
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Resultados da Busca ({visibleResults.length} reserva{visibleResults.length !== 1 ? 's' : ''})
          </span>
          {visibleResults.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearAllSearchResults}
              className="text-gray-600 hover:text-gray-700"
            >
              <X className="h-4 w-4 mr-2" />
              Limpar Resultados
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {visibleResults.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground">
            Todos os resultados foram removidos.
          </div>
        ) : (
          <div className="space-y-3">
            {visibleResults.map((result) => {
              if (!result.data?.reservation || !result.data?.customer) {
                return null;
              }

              // Converter para o formato esperado pelo CompactReservationItem
              const listItem = convertToReservationListItem(result);
              
              // Aplicar temperatura e notas temporárias
              const tempData = searchResultsWithTemp.get(result.id);
              if (tempData) {
                listItem.temperature = tempData.temperature;
                listItem.notes = tempData.notes;
              }

              return (
                <div key={result.id} className="relative">
                  <CompactReservationItem
                    reservation={listItem}
                    onRemove={handleRemoveFromSearch}
                    onUpdateField={handleUpdateField}
                  />
                  {/* Botão adicional para adicionar à lista manual */}
                  <div className="absolute top-2 right-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAddToManualList(result.id)}
                      className="bg-white/90 hover:bg-white text-xs"
                    >
                      + Lista Manual
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DateSearchResults;
