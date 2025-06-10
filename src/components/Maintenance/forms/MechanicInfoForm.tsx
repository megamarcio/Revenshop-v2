
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface MechanicInfoFormProps {
  mechanicName: string;
  mechanicPhone: string;
  details: string;
  onMechanicNameChange: (value: string) => void;
  onMechanicPhoneChange: (value: string) => void;
  onDetailsChange: (value: string) => void;
}

const MechanicInfoForm = ({
  mechanicName,
  mechanicPhone,
  details,
  onMechanicNameChange,
  onMechanicPhoneChange,
  onDetailsChange
}: MechanicInfoFormProps) => {
  return (
    <>
      {/* Detalhes da Manutenção */}
      <div className="space-y-2">
        <Label>Detalhes da Manutenção</Label>
        <Textarea
          value={details}
          onChange={(e) => onDetailsChange(e.target.value)}
          placeholder="Descreva os detalhes da manutenção realizada..."
          rows={3}
        />
      </div>

      {/* Informações do Mecânico */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Nome do Mecânico</Label>
          <Input
            value={mechanicName}
            onChange={(e) => onMechanicNameChange(e.target.value)}
            placeholder="Nome completo do mecânico"
          />
        </div>
        <div className="space-y-2">
          <Label>Telefone do Mecânico</Label>
          <Input
            value={mechanicPhone}
            onChange={(e) => onMechanicPhoneChange(e.target.value)}
            placeholder="(11) 99999-9999"
          />
        </div>
      </div>
    </>
  );
};

export default MechanicInfoForm;
