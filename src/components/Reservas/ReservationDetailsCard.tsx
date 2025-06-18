
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
  console.log('Complete reservation data:', reservation);

  const shouldShowVehicleInfo = () => {
    const status = reservation.reservation.status.toLowerCase();
    return status === 'open' || status === 'rental' || status === 'completed';
  };

  const getVehicleLabel = () => {
    const vehicleData = reservation.vehicles?.[0]?.vehicle?.label;
    console.log('Vehicle label from vehicles array:', vehicleData);
    return vehicleData || 'N/A';
  };

  const getVehicleClassLabel = () => {
    const classData = reservation.selected_vehicle_class?.vehicle_class?.label;
    console.log('Vehicle class from selected_vehicle_class:', classData);
    return classData || 'N/A';
  };

  const hasSignature = () => {
    return reservation.reservation.signed_at !== null && reservation.reservation.signed_at !== '';
  };

  const getTotalPrice = () => {
    return reservation.reservation.total_price?.amount_for_display || 'N/A';
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
            totalPrice={getTotalPrice()}
            phoneNumber={reservation.customer.phone_number}
            hasSignature={hasSignature()}
          />

          <CustomerInfoSection
            firstName={reservation.customer.first_name}
            lastName={reservation.customer.last_name}
            phoneNumber={reservation.customer.phone_number}
            kommoLink={kommoLink}
            hqRentalLink={hqRentalLink}
            hasSignature={hasSignature()}
            status={reservation.reservation.status}
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
            shouldShowVehicleInfo={shouldShowVehicleInfo()}
          />
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};

export default ReservationDetailsCard;
