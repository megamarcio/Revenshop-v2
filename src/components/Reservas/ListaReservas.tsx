
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { List, Plus, Trash2, Search } from 'lucide-react';
import { useReservationsList } from '@/hooks/useReservationsList';
import CompactReservationItem from './CompactReservationItem';

const ListaReservas = () => {
  const [inputId, setInputId] = useState('');
  const { reservations, addReservation, removeReservation, clearAll } = useReservationsList();

  const handleAddReservation = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputId.trim()) {
      addReservation(inputId.trim());
      setInputId('');
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <List className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Lista de Reservas</h1>
      </div>

      {/* Formulário para adicionar reservas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Adicionar Reserva</span>
            {reservations.length > 0 && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={clearAll}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Limpar Todas
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddReservation} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reservationId">ID da Reserva</Label>
              <div className="flex gap-2">
                <Input
                  id="reservationId"
                  type="text"
                  placeholder="Digite o ID da reserva..."
                  value={inputId}
                  onChange={(e) => setInputId(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit" disabled={!inputId.trim()}>
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Lista de Reservas */}
      {reservations.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Reservas ({reservations.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {reservations.map((reservation) => (
              <CompactReservationItem
                key={reservation.id}
                reservation={reservation}
                onRemove={removeReservation}
              />
            ))}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <List className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Nenhuma reserva adicionada</h3>
            <p className="text-muted-foreground text-center">
              Digite um ID de reserva no campo acima e clique em "Adicionar" para começar.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ListaReservas;
