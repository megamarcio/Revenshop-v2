
import React from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { User, Users } from 'lucide-react';

interface SendTypeSelectorProps {
  sendType: 'client' | 'group';
  onSendTypeChange: (value: 'client' | 'group') => void;
}

const SendTypeSelector = ({ sendType, onSendTypeChange }: SendTypeSelectorProps) => {
  return (
    <div>
      <Label>Tipo de Envio</Label>
      <RadioGroup
        value={sendType}
        onValueChange={(value) => onSendTypeChange(value as 'client' | 'group')}
        className="mt-2"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="client" id="client" />
          <Label htmlFor="client" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Cliente Individual
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="group" id="group" />
          <Label htmlFor="group" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Grupo
          </Label>
        </div>
      </RadioGroup>
    </div>
  );
};

export default SendTypeSelector;
