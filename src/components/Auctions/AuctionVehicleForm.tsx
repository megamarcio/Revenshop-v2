
import React from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface AuctionVehicleFormProps {
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
  watch?: any;
}

const AuctionVehicleForm = ({ register, errors, watch }: AuctionVehicleFormProps) => {
  const vinNumber = watch ? watch('vin_number') : '';

  const handleCarfaxClick = () => {
    if (vinNumber) {
      window.open(`https://www.carfaxonline.com/vhr/${vinNumber}`, '_blank');
    }
  };

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

      <div className="space-y-2">
        <Label htmlFor="vin_number">VIN Number</Label>
        <div className="flex gap-2">
          <Input
            id="vin_number"
            {...register('vin_number')}
            placeholder="Ex: 1HGBH41JXMN109186"
            className="flex-1"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleCarfaxClick}
            disabled={!vinNumber}
            className="px-3"
            title="Ver Carfax"
          >
            C
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AuctionVehicleForm;
