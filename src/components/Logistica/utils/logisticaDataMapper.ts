
import { Reservation } from '../types/reservationTypes';
import { ReservationDetails } from '@/hooks/useReservationById';

export const mapLogisticaToReservationFormat = (reservation: Reservation, kommoLeadId?: string): {
  id: string;
  data: ReservationDetails;
  loading: boolean;
  error: null;
  temperature?: string;
  notes?: string;
} => {
  // Try to extract vehicle class and other info from customer label
  const labelParts = reservation.customer.label.split(' - ');
  let vehicleClass = '';
  let hasCarSeat = false;
  let hasStroller = false;
  let signStatus = '';
  
  labelParts.forEach(part => {
    const lowerPart = part.toLowerCase();
    if (lowerPart.includes('suv') || lowerPart.includes('sedan') || lowerPart.includes('minivan') || lowerPart.includes('7_passenger')) {
      vehicleClass = part;
    }
    if (lowerPart.includes('car seat')) {
      hasCarSeat = true;
    }
    if (lowerPart.includes('carrinho')) {
      hasStroller = true;
    }
    if (lowerPart.includes('sign')) {
      signStatus = part;
    }
  });

  return {
    id: reservation.id.toString(),
    loading: false,
    error: null,
    data: {
      reservation: {
        id: reservation.id.toString(),
        pick_up_date: reservation.pick_up_date,
        return_date: reservation.return_date,
        pick_up_location_label: 'MCO', // Default from typical pattern
        return_location_label: 'MCO', // Default from typical pattern  
        status: reservation.status || 'Open', // Use the actual status from JSON
        outstanding_balance: '0', // Default balance
        signed_at: signStatus.includes('não') ? null : new Date().toISOString(),
      },
      customer: {
        first_name: reservation.customer.first_name || '',
        last_name: reservation.customer.last_name || '',
        phone_number: reservation.customer.phone_number || '',
        f855: kommoLeadId || '',
      },
      selected_vehicle_class: vehicleClass ? {
        vehicle_class: {
          label: vehicleClass
        }
      } : undefined,
      vehicles: reservation.vehicle_name ? [{
        vehicle: {
          label: reservation.vehicle_name
        }
      }] : undefined,
    }
  };
};
