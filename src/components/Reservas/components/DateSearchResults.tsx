
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
          {results.map((result) => (
            <div key={result.id} className="border rounded-lg p-4 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Badge variant="outline">
                      {result.data.reservation.status}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      #{result.data.reservation.id}
                    </span>
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      <span className="text-sm font-medium">
                        {result.data.customer.first_name} {result.data.customer.last_name}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>
                        {new Date(result.data.reservation.pick_up_date).toLocaleDateString('pt-BR')} - {new Date(result.data.reservation.return_date).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      <span className="truncate max-w-[200px]">
                        {result.data.reservation.pick_up_location_label}
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
                  onClick={() => onAddToList(result.data.reservation.id?.toString() || result.id)}
                  className="ml-4"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar à Lista
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default DateSearchResults;
