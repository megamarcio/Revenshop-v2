
import React from 'react';
import { UseFormRegister } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface AuctionPurchaseFormProps {
  register: UseFormRegister<any>;
}

const AuctionPurchaseForm = ({ register }: AuctionPurchaseFormProps) => {
  return (
    <div className="border-t pt-6">
      <h3 className="text-lg font-semibold mb-4">Informações da Compra</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="buyer_name">Nome do Comprador</Label>
          <Input
            id="buyer_name"
            {...register('buyer_name')}
            placeholder="Nome completo"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="purchase_value">Valor Comprado</Label>
          <Input
            id="purchase_value"
            type="number"
            step="0.01"
            {...register('purchase_value')}
            placeholder="21000.00"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="purchase_date">Data da Compra</Label>
          <Input
            id="purchase_date"
            type="date"
            {...register('purchase_date')}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="actual_auction_fees">Taxas do Leilão</Label>
          <Input
            id="actual_auction_fees"
            type="number"
            step="0.01"
            {...register('actual_auction_fees')}
            placeholder="1450.00"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="actual_freight_fee">Frete</Label>
          <Input
            id="actual_freight_fee"
            type="number"
            step="0.01"
            {...register('actual_freight_fee')}
            placeholder="750.00"
          />
        </div>
      </div>
    </div>
  );
};

export default AuctionPurchaseForm;
