import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, FileText, Grid, List } from 'lucide-react';
import { useReservationsList } from '@/hooks/useReservationsList';
import { useReservationDateSearch } from '@/hooks/useReservationDateSearch';
import { useViewMode } from '@/hooks/useViewMode';
import CompactReservationItem from './CompactReservationItem';
import ReservationDateFilters from './components/ReservationDateFilters';
import DateSearchResults from './components/DateSearchResults';
import ViewModeIndicator from './components/ViewModeIndicator';
import { generateReservationsListPDF } from './utils/pdfGenerator';

const ListaReservas = () => {
  const [reservationId, setReservationId] = useState('');
  const { viewMode, isCompactMode, toggleViewMode } = useViewMode({ 
    key: 'reservationsViewMode',
    defaultValue: 'normal'
  });
  
  const {
    reservations,
    addReservation,
    removeReservation,
    clearAll,
    updateReservationField,
    profiles,
    profilesLoading,
    profilesError
  } = useReservationsList();
  const {
    searchResults,
    loading: searchLoading,
    searchReservations,
    clearResults
  } = useReservationDateSearch();

  const handleAddReservation = async () => {
    if (reservationId.trim()) {
      await addReservation(reservationId.trim());
      setReservationId('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddReservation();
    }
  };

  const handleGeneratePDF = () => {
    generateReservationsListPDF(reservations);
  };

  const handleDateSearch = (startDate: string, endDate: string, dateField: 'created_at' | 'updated_at') => {
    searchReservations(startDate, endDate, dateField);
  };

  const handleAddFromSearch = async (reservationId: string) => {
    await addReservation(reservationId);
  };

  const validReservationsCount = reservations.filter(r => r.data && !r.loading && !r.error).length;
  const hasSearchResults = searchResults.length > 0;

  return (
    <div className="container mx-auto p-6">
      {/* Filtro de Datas */}
      <ReservationDateFilters onSearch={handleDateSearch} onClear={clearResults} loading={searchLoading} hasResults={hasSearchResults} />

      {/* Resultados da Busca por Data */}
      <DateSearchResults results={searchResults} onAddToList={handleAddFromSearch} />

      {/* Lista Manual de Reservas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between font-medium text-xl">
            <div className="flex items-center gap-4">
              <span>Lista de Reservas Manual</span>
              {/* Indicador de Modo de Visualização */}
              <ViewModeIndicator 
                viewMode={viewMode}
                onToggle={toggleViewMode}
              />
            </div>
            <div className="flex gap-2">
              {validReservationsCount > 0 && (
                <Button variant="outline" size="sm" onClick={handleGeneratePDF} className="text-blue-600 hover:text-blue-700">
                  <FileText className="h-4 w-4 mr-2" />
                  Gerar PDF
                </Button>
              )}
              {reservations.length > 0 && (
                <Button variant="outline" size="sm" onClick={clearAll} className="text-red-600 hover:text-red-700">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Limpar Tudo
                </Button>
              )}
            </div>
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <div className="flex gap-2 mb-6">
            <Input 
              type="text" 
              placeholder="Digite o ID da reserva..." 
              value={reservationId} 
              onChange={e => setReservationId(e.target.value)} 
              onKeyPress={handleKeyPress} 
              className="flex-1" 
            />
            <Button onClick={handleAddReservation} disabled={!reservationId.trim()}>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar
            </Button>
          </div>

          {reservations.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Nenhuma reserva adicionada ainda.
            </div>
          ) : (
            <div className={`space-y-3 transition-all duration-300 ease-in-out ${isCompactMode ? 'space-y-2' : 'space-y-3'}`}>
              {reservations.map(reservation => (
                <div 
                  key={reservation.id}
                  className={`transition-all duration-300 ease-in-out transform ${
                    isCompactMode 
                      ? 'hover:scale-[1.02] hover:shadow-md' 
                      : 'hover:shadow-lg'
                  }`}
                >
                  <CompactReservationItem 
                    reservation={reservation} 
                    onRemove={removeReservation} 
                    onUpdateField={updateReservationField}
                    isCompact={isCompactMode}
                  />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ListaReservas;