
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Calendar, User, MapPin } from 'lucide-react';
import { DateSearchReservation } from '@/hooks/useReservationDateSearch';

interface DateSearchResultsProps {
  results: DateSearchReservation[];
  onAddToList: (reservationId: string) => void;
}

const DateSearchResults = ({ results, onAddToList }: DateSearchResultsProps) => {
  if (results.length === 0) {
    return null;
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Resultados da Busca ({results.length} reserva{results.length !== 1 ? 's' : ''})
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {results.map((result) => {
            // Verificações de segurança para evitar erros de undefined
            const reservation = result.data?.reservation;
            const customer = result.data?.customer;
            
            if (!reservation || !customer) {
              console.warn('Dados de reserva incompletos:', result);
              return null;
            }

            return (
              <div key={result.id} className="border rounded-lg p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Badge variant="outline">
                        {reservation.status || 'N/A'}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        #{reservation.id || 'N/A'}
                      </span>
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        <span className="text-sm font-medium">
                          {customer.first_name || 'N/A'} {customer.last_name || ''}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>
                          {reservation.pick_up_date ? 
                            new Date(reservation.pick_up_date).toLocaleDateString('pt-BR') : 'N/A'
                          } - {reservation.return_date ? 
                            new Date(reservation.return_date).toLocaleDateString('pt-BR') : 'N/A'
                          }
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        <span className="truncate max-w-[200px]">
                          {reservation.pick_up_location_label || 'N/A'}
                        </span>
                      </div>
                      {result.created_at && (
                        <span>
                          Criado em: {new Date(result.created_at).toLocaleDateString('pt-BR')}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onAddToList(reservation.id?.toString() || result.id)}
                    className="ml-4"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar à Lista
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default DateSearchResults;
