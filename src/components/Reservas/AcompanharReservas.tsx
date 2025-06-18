
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Clock } from 'lucide-react';
import { useReservationById } from '@/hooks/useReservationById';
import ReservationDetailsCard from './ReservationDetailsCard';

const AcompanharReservas = () => {
  const [reservationId, setReservationId] = useState('');
  const { loading, error, data, fetchReservation, clearError, getHistory } = useReservationById();
  const history = getHistory();

  const handleSearch = () => {
    clearError();
    fetchReservation(reservationId);
  };

  const handleHistoryClick = (id: string) => {
    setReservationId(id);
    clearError();
    fetchReservation(id);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Acompanhar Reservas</h1>
        <p className="text-muted-foreground">Digite o ID da reserva para buscar os detalhes</p>
      </div>

      {/* Formulário de busca */}
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Buscar Reserva
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Ex: 7641"
              value={reservationId}
              onChange={(e) => setReservationId(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={loading}
            />
            <Button 
              onClick={handleSearch} 
              disabled={loading || !reservationId.trim()}
            >
              {loading ? 'Buscando...' : 'Buscar'}
            </Button>
          </div>

          {/* Histórico de consultas */}
          {history.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                Últimas consultas:
              </div>
              <div className="flex flex-wrap gap-2">
                {history.map((id, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="cursor-pointer hover:bg-accent"
                    onClick={() => handleHistoryClick(id)}
                  >
                    #{id}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {error && (
            <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">
              {error}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Resultados */}
      {data && <ReservationDetailsCard reservation={data} />}
    </div>
  );
};

export default AcompanharReservas;
