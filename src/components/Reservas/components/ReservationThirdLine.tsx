
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ReservationDetails } from '@/hooks/useReservationById';
import ReservationActionButtons from './ReservationActionButtons';

interface ReservationThirdLineProps {
  data: ReservationDetails;
  temperature?: string;
  notes?: string;
  onUpdateField: (id: string, field: 'temperature' | 'notes', value: string) => void;
  reservationId: string;
}

const ReservationThirdLine = ({ data, temperature, notes, onUpdateField, reservationId }: ReservationThirdLineProps) => {
  return (
    <div className="flex items-center gap-2">
      <Select 
        value={temperature || ''} 
        onValueChange={(value) => onUpdateField(reservationId, 'temperature', value)}
      >
        <SelectTrigger className="w-24 h-7 text-xs">
          <SelectValue placeholder="Temp" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="sol">☀️ Sol</SelectItem>
          <SelectItem value="quente">🔥 Quente</SelectItem>
          <SelectItem value="morno">🌡️ Morno</SelectItem>
          <SelectItem value="frio">❄️ Frio</SelectItem>
          <SelectItem value="congelado">🧊 Congelado</SelectItem>
        </SelectContent>
      </Select>
      
      <Textarea
        placeholder="Observações..."
        value={notes || ''}
        onChange={(e) => onUpdateField(reservationId, 'notes', e.target.value)}
        className="flex-1 h-7 min-h-7 max-h-7 text-xs resize-none"
      />
      
      <ReservationActionButtons data={data} />
    </div>
  );
};

export default ReservationThirdLine;
