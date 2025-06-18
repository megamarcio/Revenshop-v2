
import React from 'react';
import { Button } from '@/components/ui/button';
import { ReservationDetails } from '@/hooks/useReservationById';

interface ReservationActionButtonsProps {
  data: ReservationDetails;
}

const ReservationActionButtons = ({ data }: ReservationActionButtonsProps) => {
  const hasPhoneNumber = data.customer.phone_number && data.customer.phone_number.trim() !== '';
  const hasKommoNumber = data.customer.f855 && data.customer.f855.trim() !== '';
  
  const kommoLink = `https://r3rentalcar.kommo.com/leads/detail/${data.customer.f855}`;
  const hqRentalLink = `https://r3-rental.us5.hqrentals.app/car-rental/reservations/step7?id=${data.reservation.id}`;

  return (
    <div className="flex gap-1">
      <Button 
        variant="outline" 
        size="sm" 
        asChild={!!data.reservation.id}
        disabled={!data.reservation.id}
        className={`h-7 w-7 p-0 ${!data.reservation.id ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {data.reservation.id ? (
          <a href={hqRentalLink} target="_blank" rel="noopener noreferrer">
            <img 
              src="/lovable-uploads/e3703660-4058-4893-918f-dbc178a72a69.png" 
              alt="HQ Rental" 
              className="h-3 w-3"
            />
          </a>
        ) : (
          <div>
            <img 
              src="/lovable-uploads/e3703660-4058-4893-918f-dbc178a72a69.png" 
              alt="HQ Rental" 
              className="h-3 w-3 opacity-50"
            />
          </div>
        )}
      </Button>
      <Button 
        variant="outline" 
        size="sm" 
        asChild={hasKommoNumber}
        disabled={!hasKommoNumber}
        className={`h-7 w-7 p-0 ${!hasKommoNumber ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {hasKommoNumber ? (
          <a href={kommoLink} target="_blank" rel="noopener noreferrer">
            <img 
              src="/lovable-uploads/de9684e1-1c0d-4484-9ed9-a0252882c9e4.png" 
              alt="Kommo" 
              className="h-3 w-3"
            />
          </a>
        ) : (
          <div>
            <img 
              src="/lovable-uploads/de9684e1-1c0d-4484-9ed9-a0252882c9e4.png" 
              alt="Kommo" 
              className="h-3 w-3 opacity-50"
            />
          </div>
        )}
      </Button>
      <Button 
        variant="outline" 
        size="sm" 
        asChild={hasPhoneNumber}
        disabled={!hasPhoneNumber}
        className={`h-7 w-7 p-0 ${hasPhoneNumber ? 'bg-green-50 hover:bg-green-100 text-green-700 border-green-200' : 'opacity-50 cursor-not-allowed'}`}
      >
        {hasPhoneNumber ? (
          <a 
            href={`http://wa.me/${data.customer.phone_number}`} 
            target="_blank" 
            rel="noopener noreferrer"
          >
            <img 
              src="/lovable-uploads/e69b8938-5a38-4b74-b5c3-342f53c90e3c.png" 
              alt="WhatsApp" 
              className="h-3 w-3"
            />
          </a>
        ) : (
          <div>
            <img 
              src="/lovable-uploads/e69b8938-5a38-4b74-b5c3-342f53c90e3c.png" 
              alt="WhatsApp" 
              className="h-3 w-3 opacity-50"
            />
          </div>
        )}
      </Button>
    </div>
  );
};

export default ReservationActionButtons;
