import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ReservationDetails } from '@/hooks/useReservationById';
import ReservationActionButtons from './ReservationActionButtons';
import { Car, Thermometer, Phone, User } from 'lucide-react';

interface ReservationThirdLineProps {
  data: ReservationDetails;
  temperature?: string;
  onUpdateField: (id: string, field: 'temperature', value: string) => void;
  reservationId: string;
}

const ReservationThirdLine = ({ data, temperature, onUpdateField, reservationId }: ReservationThirdLineProps) => {
  const categoria = data.selected_vehicle_class?.vehicle_class?.label || '';
  const categoryLabel = categoria.length > 0 ? categoria : '-';

  const onTemperatureChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onUpdateField(reservationId, 'temperature', event.target.value);
  };

  const onContactClick = () => {
    // Implement the logic to handle contact click
  };

  const onResponsibleClick = () => {
    // Implement the logic to handle responsible click
  };

  return (
    <div className="flex items-center gap-2 py-1 px-2 text-xs sm:text-sm w-full">
      <div className="flex items-center gap-1 flex-shrink-0">
        <Car className="h-3 w-3 text-blue-600" />
        <span className="text-[11px] text-blue-700 font-medium whitespace-nowrap">Categoria:</span>
        <span className="text-[12px] font-semibold text-blue-900 whitespace-nowrap">{categoryLabel}</span>
      </div>
      {data.vehicles?.[0]?.vehicle?.label && (
        <div className="flex items-center gap-1 ml-2">
          <span className="text-[11px] text-gray-600 font-medium">Veículo:</span>
          <span className="text-[12px] font-semibold text-gray-900 truncate max-w-[120px]">{data.vehicles[0].vehicle.label}</span>
        </div>
      )}
      <div className="flex items-center gap-1 ml-2">
        <Thermometer className="h-3 w-3 text-orange-500" />
        <select
          className="border border-gray-300 rounded px-2 py-1 text-[11px] w-[80px] h-[24px] focus:outline-none"
          value={temperature}
          onChange={onTemperatureChange}
        >
          <option value="">Temp</option>
          <option value="quente">🔥 Quente</option>
          <option value="frio">❄️ Frio</option>
          <option value="morno">🌡️ Morno</option>
        </select>
      </div>
    </div>
  );
};

export default ReservationThirdLine;
