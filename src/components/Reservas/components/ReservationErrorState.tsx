
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

interface ReservationErrorStateProps {
  reservationId: string;
  error: string;
  onRemove: (id: string) => void;
}

const ReservationErrorState = ({ reservationId, error, onRemove }: ReservationErrorStateProps) => {
  return (
    <Card className="border-red-200">
      <CardContent className="p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="text-red-500">⚠️</div>
            <div>
              <div className="text-sm font-medium text-red-700">
                Erro ao carregar #{reservationId}
              </div>
              <div className="text-xs text-red-600">{error}</div>
            </div>
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

export default ReservationErrorState;
