
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
  // Extract customer name from the label (first part before " - ")
  const customerNameParts = reservation.customer.label.split(' - ')[0] || reservation.customer.label;
  
  // Try to extract vehicle class and other info from customer label
  const labelParts = reservation.customer.label.split(' - ');
  let vehicleClass = '';
  let hasCarSeat = false;
  let hasStroller = false;
  let signStatus = '';
  let reservationStatus = 'Confirmed'; // Default status
  
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
      // Extract status based on sign information
      if (lowerPart.includes('sign não')) {
        reservationStatus = 'Pending';
      } else if (lowerPart.includes('sign') && !lowerPart.includes('não')) {
        reservationStatus = 'Confirmed';
      }
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
        status: reservationStatus, // Use extracted status
        outstanding_balance: '0', // Default balance
        signed_at: signStatus.includes('não') ? null : new Date().toISOString(),
      },
      customer: {
        first_name: customerNameParts,
        last_name: '',
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
