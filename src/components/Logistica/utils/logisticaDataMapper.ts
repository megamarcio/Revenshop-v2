
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
  return {
    id: reservation.id,
    loading: false,
    error: null,
    data: {
      reservation: {
        id: reservation.id,
        pick_up_date: reservation.pickupDate,
        return_date: reservation.returnDate,
        pick_up_location_label: reservation.pickupLocation,
        return_location_label: reservation.returnLocation,
        status: reservation.status,
        outstanding_balance: reservation.outstandingBalance || '0',
        signed_at: reservation.signedAt,
      },
      customer: {
        first_name: reservation.customerName,
        last_name: reservation.customerLastName || '',
        phone_number: reservation.customerPhone || '',
        f855: kommoLeadId || '',
      },
      selected_vehicle_class: reservation.vehicleClass ? {
        vehicle_class: {
          label: reservation.vehicleClass
        }
      } : undefined,
      vehicles: reservation.vehicle ? [{
        vehicle: {
          label: reservation.vehicle
        }
      }] : undefined,
    }
  };
};
