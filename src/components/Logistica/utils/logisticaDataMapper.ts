import { Reservation } from '../types/reservationTypes';
import { ReservationDetails } from '@/hooks/useReservationById';

export const mapLogisticaToReservationFormat = (reservation: Reservation, kommoLeadId?: string): {
  id: string;
  data: ReservationDetails;
  loading: boolean;
  error: null;
  temperature?: string;
  notes?: string;
  cleanLabel?: string;
} => {
  // Extract customer name from the label (first part before " - ")
  const customerFullName = reservation.customer.label.split(' - ')[0] || reservation.customer.label;
  
  // Split the full name into first and last name
  const nameParts = customerFullName.trim().split(' ');
  const firstName = nameParts[0] || '';
  const lastNameFromLabel = nameParts.slice(1).join(' ') || '';
  // Preferir o last_name do JSON, se existir
  const lastName = reservation.customer.last_name || lastNameFromLabel;
  
  // Create clean label without the customer name
  const labelParts = reservation.customer.label.split(' - ');
  const cleanLabel = labelParts.slice(1).join(' - ') || ''; // Remove first part (name)
  
  // Try to extract vehicle class and other info from customer label
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

  // Check if dates contain time information
  const pickUpDateTime = reservation.pick_up_date || '';
  const returnDateTime = reservation.return_date || '';

  return {
    id: reservation.id.toString(),
    loading: false,
    error: null,
    cleanLabel,
    data: {
      reservation: {
        id: reservation.id.toString(),
        pick_up_date: pickUpDateTime,
        return_date: returnDateTime,
        pick_up_location_label: 'MCO', // Default from typical pattern
        return_location_label: 'MCO', // Default from typical pattern  
        status: reservation.status || 'Open', // Use the actual status from JSON
        outstanding_balance: '0', // Default balance
        signed_at: signStatus.includes('não') ? null : new Date().toISOString(),
      },
      customer: {
        first_name: firstName,
        last_name: lastName,
        phone_number: reservation.customer.phone_number || '',
        f855: kommoLeadId || '',
        label: reservation.customer.label || '',
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
