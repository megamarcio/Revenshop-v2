
import React from 'react';
import { UseFormRegister, UseFormSetValue, FieldErrors } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AuctionBasicInfoFormProps {
  register: UseFormRegister<any>;
  setValue: UseFormSetValue<any>;
  errors: FieldErrors<any>;
  watchAuctionHouse: string;
  showManheimCity: boolean;
  showOtherAuction: boolean;
  defaultValues?: any;
}

const AuctionBasicInfoForm = ({ 
  register, 
  setValue, 
  errors, 
  watchAuctionHouse, 
  showManheimCity, 
  showOtherAuction,
  defaultValues
}: AuctionBasicInfoFormProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <Label htmlFor="auction_house">Leilão *</Label>
        <Select onValueChange={(value) => setValue('auction_house', value)} defaultValue={defaultValues?.auction_house || 'Manheim'}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione o leilão" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Iaai">Iaai</SelectItem>
            <SelectItem value="Copart">Copart</SelectItem>
            <SelectItem value="Manheim">Manheim</SelectItem>
            <SelectItem value="OLLA">OLLA</SelectItem>
            <SelectItem value="Dax">Dax</SelectItem>
            <SelectItem value="ACV">ACV</SelectItem>
            <SelectItem value="Outro">Outro</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {showManheimCity && (
        <div className="space-y-2">
          <Label htmlFor="auction_city">Cidade do Manheim</Label>
          <Input
            id="auction_city"
            {...register('auction_city')}
            placeholder="Digite a cidade"
          />
        </div>
      )}

      {showOtherAuction && (
        <div className="space-y-2">
          <Label htmlFor="auction_city">Nome do Leilão</Label>
          <Input
            id="auction_city"
            {...register('auction_city')}
            placeholder="Digite o nome do leilão"
          />
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="car_link">Link do Carro *</Label>
        <Input
          id="car_link"
          {...register('car_link', { required: 'Link do carro é obrigatório' })}
          placeholder="https://..."
        />
        {errors.car_link && (
          <p className="text-red-500 text-sm">{String(errors.car_link.message)}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="auction_date">Data do Leilão</Label>
        <Input
          id="auction_date"
          type="date"
          {...register('auction_date')}
        />
      </div>
    </div>
  );
};

export default AuctionBasicInfoForm;
