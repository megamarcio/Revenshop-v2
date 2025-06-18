
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Trash2 } from 'lucide-react';

interface ReservationLoadingStateProps {
  reservationId: string;
  onRemove: (id: string) => void;
}

const ReservationLoadingState = ({ reservationId, onRemove }: ReservationLoadingStateProps) => {
  return (
    <Card>
      <CardContent className="p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm">Carregando reserva #{reservationId}...</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onRemove(reservationId)}
            className="text-red-600 hover:text-red-700 h-6 px-2"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReservationLoadingState;
