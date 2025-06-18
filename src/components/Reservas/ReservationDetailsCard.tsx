
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ReservationDetails } from '@/hooks/useReservationById';
import ReservationHeader from './components/ReservationHeader';
import ReservationStatusSection from './components/ReservationStatusSection';
import CustomerInfoSection from './components/CustomerInfoSection';
import DateLocationSection from './components/DateLocationSection';
import VehicleInfoSection from './components/VehicleInfoSection';

interface ReservationDetailsCardProps {
  reservation: ReservationDetails;
}

const ReservationDetailsCard = ({ reservation }: ReservationDetailsCardProps) => {
  console.log('Reservation data:', reservation); // Debug log

  const shouldShowPlate = () => {
    const status = reservation.reservation.status.toLowerCase();
    return status === 'open' || status === 'rental' || status === 'completed';
  };

  const getVehicleLabel = () => {
    console.log('Vehicle data:', reservation.reservation.vehicles); // Debug log
    return reservation.reservation.vehicles?.vehicle?.label || 'N/A';
  };

  const getVehicleClassLabel = () => {
    console.log('Vehicle class data:', reservation.reservation.vehicle); // Debug log
    return reservation.reservation.vehicle?.vehicle_class?.label || 'N/A';
  };

  const getVehiclePlate = () => {
    return reservation.reservation.vehicles?.vehicle?.plate || 'N/A';
  };

  const kommoLink = `https://r3rentalcar.kommo.com/leads/detail/${reservation.customer.f855}`;
  const hqRentalLink = `https://r3-rental.us5.hqrentals.app/car-rental/reservations/step7?id=${reservation.reservation.id}`;

  return (
    <TooltipProvider>
      <Card className="w-full max-w-2xl mx-auto">
        <ReservationHeader customerName={reservation.customer.first_name} />
        
        <CardContent className="space-y-4">
          <ReservationStatusSection
            status={reservation.reservation.status}
            reservationId={reservation.reservation.id}
            outstandingBalance={reservation.reservation.outstanding_balance}
          />

          <CustomerInfoSection
            firstName={reservation.customer.first_name}
            lastName={reservation.customer.last_name}
            phoneNumber={reservation.customer.phone_number}
            kommoLink={kommoLink}
            hqRentalLink={hqRentalLink}
          />

          <DateLocationSection
            pickUpDate={reservation.reservation.pick_up_date}
            pickUpLocation={reservation.reservation.pick_up_location_label}
            returnDate={reservation.reservation.return_date}
            returnLocation={reservation.reservation.return_location_label}
          />

          <VehicleInfoSection
            vehicleClass={getVehicleClassLabel()}
            vehicleLabel={getVehicleLabel()}
            vehiclePlate={getVehiclePlate()}
            shouldShowPlate={shouldShowPlate()}
          />
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};

export default ReservationDetailsCard;
