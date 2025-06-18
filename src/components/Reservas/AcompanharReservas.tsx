
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Search, Loader2, AlertCircle } from 'lucide-react';
import { useReservationById } from '@/hooks/useReservationById';
import ReservationDetailsCard from './ReservationDetailsCard';
import { Alert, AlertDescription } from '@/components/ui/alert';

const AcompanharReservas = () => {
  const [reservationId, setReservationId] = useState('');
  const { loading, error, data, fetchReservation, clearError } = useReservationById();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (reservationId.trim()) {
      clearError();
      fetchReservation(reservationId.trim());
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setReservationId(e.target.value);
    if (error) {
      clearError();
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Search className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Acompanhar Reservas</h1>
      </div>

      {/* Formulário de Busca */}
      <Card>
        <CardHeader>
          <CardTitle>Buscar Reserva</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reservationId">ID da Reserva</Label>
              <div className="flex gap-2">
                <Input
                  id="reservationId"
                  type="text"
                  placeholder="Digite o ID da reserva..."
                  value={reservationId}
                  onChange={handleInputChange}
                  disabled={loading}
                  className="flex-1"
                />
                <Button 
                  type="submit" 
                  disabled={loading || !reservationId.trim()}
                  className="min-w-[100px]"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Buscando...
                    </>
                  ) : (
                    <>
                      <Search className="h-4 w-4 mr-2" />
                      Buscar
                    </>
                  )}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Exibição de Erro */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Exibição dos Dados */}
      {data && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Resultado da Busca</h2>
          <ReservationDetailsCard reservation={data} />
        </div>
      )}

      {/* Estado vazio */}
      {!data && !error && !loading && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Search className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Nenhuma reserva pesquisada</h3>
            <p className="text-muted-foreground text-center">
              Digite o ID de uma reserva no campo acima e clique em "Buscar" para visualizar os detalhes.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AcompanharReservas;
