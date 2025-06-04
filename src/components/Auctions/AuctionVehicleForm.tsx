
import React from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface AuctionVehicleFormProps {
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
}

const AuctionVehicleForm = ({ register, errors }: AuctionVehicleFormProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <Label htmlFor="car_name">Nome do Carro *</Label>
        <Input
          id="car_name"
          {...register('car_name', { required: 'Nome do carro é obrigatório' })}
          placeholder="Ex: Honda Civic EX"
        />
        {errors.car_name && (
          <p className="text-red-500 text-sm">{String(errors.car_name.message)}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="car_year">Ano *</Label>
        <Input
          id="car_year"
          type="number"
          {...register('car_year', { required: 'Ano é obrigatório' })}
          placeholder="2020"
        />
        {errors.car_year && (
          <p className="text-red-500 text-sm">{String(errors.car_year.message)}</p>
        )}
      </div>
    </div>
  );
};

export default AuctionVehicleForm;
