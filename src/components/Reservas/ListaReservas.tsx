import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, FileText } from 'lucide-react';
import { useReservationsList } from '@/hooks/useReservationsList';
import { useReservationDateSearch } from '@/hooks/useReservationDateSearch';
import CompactReservationItem from './CompactReservationItem';
import ReservationDateFilters from './components/ReservationDateFilters';
import DateSearchResults from './components/DateSearchResults';
import { generateReservationsListPDF } from './utils/pdfGenerator';
const ListaReservas = () => {
  const [reservationId, setReservationId] = useState('');
  const {
    reservations,
    addReservation,
    removeReservation,
    clearAll,
    updateReservationField
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
  return <div className="container mx-auto p-6">
      {/* Filtro de Datas */}
      <ReservationDateFilters onSearch={handleDateSearch} onClear={clearResults} loading={searchLoading} hasResults={hasSearchResults} />

      {/* Resultados da Busca por Data */}
      <DateSearchResults results={searchResults} onAddToList={handleAddFromSearch} />

      {/* Lista Manual de Reservas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between font-medium text-xl">
            Lista de Reservas Manual
            <div className="flex gap-2">
              {validReservationsCount > 0 && <Button variant="outline" size="sm" onClick={handleGeneratePDF} className="text-blue-600 hover:text-blue-700">
                  <FileText className="h-4 w-4 mr-2" />
                  Gerar PDF
                </Button>}
              {reservations.length > 0 && <Button variant="outline" size="sm" onClick={clearAll} className="text-red-600 hover:text-red-700">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Limpar Tudo
                </Button>}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-6">
            <Input type="text" placeholder="Digite o ID da reserva..." value={reservationId} onChange={e => setReservationId(e.target.value)} onKeyPress={handleKeyPress} className="flex-1" />
            <Button onClick={handleAddReservation} disabled={!reservationId.trim()}>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar
            </Button>
          </div>

          {reservations.length === 0 ? <div className="text-center py-8 text-muted-foreground">
              Nenhuma reserva adicionada ainda.
            </div> : <div className="space-y-3">
              {reservations.map(reservation => <CompactReservationItem key={reservation.id} reservation={reservation} onRemove={removeReservation} onUpdateField={updateReservationField} />)}
            </div>}
        </CardContent>
      </Card>
    </div>;
};
export default ListaReservas;