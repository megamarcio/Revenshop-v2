
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ClientPhoneInputProps {
  phoneNumber: string;
  onPhoneNumberChange: (value: string) => void;
}

const ClientPhoneInput = ({ phoneNumber, onPhoneNumberChange }: ClientPhoneInputProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="phone">Número do Telefone</Label>
      <Input
        id="phone"
        value={phoneNumber}
        onChange={(e) => onPhoneNumberChange(e.target.value)}
        placeholder="Ex: +55 11 99999-9999"
      />
    </div>
  );
};

export default ClientPhoneInput;
