
import React from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { User, Info } from 'lucide-react';

interface CustomerInfoSectionProps {
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  kommoLink: string;
  hqRentalLink: string;
  hasSignature: boolean;
  status: string;
}

const CustomerInfoSection = ({ 
  firstName, 
  lastName, 
  phoneNumber,
  kommoLink,
  hqRentalLink,
  hasSignature,
  status
}: CustomerInfoSectionProps) => {
  return (
    <div className="space-y-3">
      {/* Customer name on full line */}
      <div className="flex items-center gap-2">
        <User className="h-4 w-4 text-muted-foreground" />
        <span className="font-medium">Cliente:</span>
        <span className="whitespace-nowrap overflow-hidden text-ellipsis flex-1">{firstName}</span>
        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" className="h-5 w-5 p-0">
                <Info className="h-3 w-3" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Nome completo: {firstName} {lastName}</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex justify-end gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          asChild
          className="h-8 px-3"
        >
          <a href={hqRentalLink} target="_blank" rel="noopener noreferrer">
            <img 
              src="/lovable-uploads/e3703660-4058-4893-918f-dbc178a72a69.png" 
              alt="HQ Rental" 
              className="h-4 w-4"
            />
          </a>
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          asChild
          className="h-8 px-3"
        >
          <a href={kommoLink} target="_blank" rel="noopener noreferrer">
            <img 
              src="/lovable-uploads/de9684e1-1c0d-4484-9ed9-a0252882c9e4.png" 
              alt="Kommo" 
              className="h-4 w-4"
            />
          </a>
        </Button>
        {phoneNumber && (
          <Button 
            variant="outline" 
            size="sm" 
            asChild
            className="h-8 px-3 bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
          >
            <a 
              href={`http://wa.me/${phoneNumber}`} 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <img 
                src="/lovable-uploads/e69b8938-5a38-4b74-b5c3-342f53c90e3c.png" 
                alt="WhatsApp" 
                className="h-4 w-4"
              />
            </a>
          </Button>
        )}
      </div>
    </div>
  );
};

export default CustomerInfoSection;
