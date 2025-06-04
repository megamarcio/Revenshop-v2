
import React from 'react';
import { UseFormRegister, UseFormSetValue } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AuctionValuesFormProps {
  register: UseFormRegister<any>;
  setValue: UseFormSetValue<any>;
  defaultValues?: any;
}

const AuctionValuesForm = ({ register, setValue, defaultValues }: AuctionValuesFormProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <Label htmlFor="carfax_value">Valor Carfax</Label>
        <Input
          id="carfax_value"
          type="number"
          step="0.01"
          {...register('carfax_value')}
          placeholder="25000.00"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="carfax_link">Link Carfax</Label>
        <Input
          id="carfax_link"
          {...register('carfax_link')}
          placeholder="https://..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="mmr_value">Valor MMR</Label>
        <Input
          id="mmr_value"
          type="number"
          step="0.01"
          {...register('mmr_value')}
          placeholder="22000.00"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="estimated_repair_value">Valor Estimado Reparo</Label>
        <Input
          id="estimated_repair_value"
          type="number"
          step="0.01"
          {...register('estimated_repair_value')}
          placeholder="3000.00"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="bid_value">Valor do Lance</Label>
        <Input
          id="bid_value"
          type="number"
          step="0.01"
          {...register('bid_value')}
          placeholder="20000.00"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="max_payment_value">Valor Máximo a Pagar</Label>
        <Input
          id="max_payment_value"
          type="number"
          step="0.01"
          {...register('max_payment_value')}
          placeholder="23000.00"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="estimated_auction_fees">Taxas Estimadas do Leilão</Label>
        <Input
          id="estimated_auction_fees"
          type="number"
          step="0.01"
          {...register('estimated_auction_fees')}
          placeholder="1500.00"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="estimated_freight_fee">Taxa Estimada de Frete</Label>
        <Input
          id="estimated_freight_fee"
          type="number"
          step="0.01"
          {...register('estimated_freight_fee')}
          placeholder="800.00"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="bid_accepted">Lance Aceito?</Label>
        <Select onValueChange={(value) => setValue('bid_accepted', value)} defaultValue={defaultValues?.bid_accepted ? 'true' : 'false'}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="false">Não</SelectItem>
            <SelectItem value="true">Sim</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default AuctionValuesForm;
