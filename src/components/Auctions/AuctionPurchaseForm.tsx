
import React from 'react';
import { UseFormRegister, UseFormWatch } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { DollarSign, Percent } from 'lucide-react';

interface AuctionPurchaseFormProps {
  register: UseFormRegister<any>;
  watch: UseFormWatch<any>;
}

const AuctionPurchaseForm = ({ register, watch }: AuctionPurchaseFormProps) => {
  const purchaseValue = parseFloat(watch('purchase_value')) || 0;
  const actualAuctionFees = parseFloat(watch('actual_auction_fees')) || 0;
  const actualFreightFee = parseFloat(watch('actual_freight_fee')) || 0;
  const carfaxValue = parseFloat(watch('carfax_value')) || 0;

  const totalCosts = purchaseValue + actualAuctionFees + actualFreightFee;
  const profitMarginValue = carfaxValue - totalCosts;
  const profitMarginPercentage = totalCosts > 0 ? (profitMarginValue / totalCosts) * 100 : 0;

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

        <div className="space-y-2">
          <Card className="p-4 bg-gray-50">
            <h4 className="font-semibold text-sm mb-3">Resumo dos Custos</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Valor Comprado:</span>
                <span>R$ {purchaseValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between">
                <span>Taxas do Leilão:</span>
                <span>R$ {actualAuctionFees.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between">
                <span>Frete:</span>
                <span>R$ {actualFreightFee.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="border-t pt-2 font-semibold flex justify-between">
                <span>Total dos Custos:</span>
                <span>R$ {totalCosts.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
            
            {carfaxValue > 0 && totalCosts > 0 && (
              <div className="mt-4 pt-3 border-t">
                <h5 className="font-semibold text-sm mb-2">Margem de Lucro</h5>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Percent className="h-4 w-4" />
                      <span className="text-sm">Percentual:</span>
                    </div>
                    <span className={`font-semibold ${profitMarginPercentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {profitMarginPercentage >= 0 ? '+' : ''}{profitMarginPercentage.toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4" />
                      <span className="text-sm">Valor:</span>
                    </div>
                    <span className={`font-semibold ${profitMarginValue >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {profitMarginValue >= 0 ? '+' : ''}R$ {profitMarginValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AuctionPurchaseForm;
