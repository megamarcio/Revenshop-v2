import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AuctionFormProps {
  auction?: any;
  onSave: () => void;
  onCancel: () => void;
}

const AuctionForm = ({ auction, onSave, onCancel }: AuctionFormProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showManheimCity, setShowManheimCity] = useState(false);
  const [showOtherAuction, setShowOtherAuction] = useState(false);
  const [showBidAcceptedFields, setShowBidAcceptedFields] = useState(false);

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    defaultValues: auction || {}
  });

  const watchAuctionHouse = watch('auction_house');
  const watchBidAccepted = watch('bid_accepted');
  const watchCarfaxValue = watch('carfax_value');
  const watchMmrValue = watch('mmr_value');

  useEffect(() => {
    setShowManheimCity(watchAuctionHouse === 'Manheim');
    setShowOtherAuction(watchAuctionHouse === 'Outro');
    setShowBidAcceptedFields(watchBidAccepted === 'true' || watchBidAccepted === true);
  }, [watchAuctionHouse, watchBidAccepted]);

  const calculateProfitMargin = () => {
    if (!watchCarfaxValue || !watchMmrValue || watchMmrValue === 0) return null;
    return ((watchCarfaxValue - watchMmrValue) / watchMmrValue * 100).toFixed(1);
  };

  const saveMutation = useMutation({
    mutationFn: async (data: any) => {
      const formData = {
        ...data,
        bid_accepted: data.bid_accepted === 'true' || data.bid_accepted === true,
        car_year: parseInt(data.car_year),
        carfax_value: data.carfax_value ? parseFloat(data.carfax_value) : null,
        mmr_value: data.mmr_value ? parseFloat(data.mmr_value) : null,
        estimated_repair_value: data.estimated_repair_value ? parseFloat(data.estimated_repair_value) : null,
        bid_value: data.bid_value ? parseFloat(data.bid_value) : null,
        max_payment_value: data.max_payment_value ? parseFloat(data.max_payment_value) : null,
        estimated_auction_fees: data.estimated_auction_fees ? parseFloat(data.estimated_auction_fees) : null,
        estimated_freight_fee: data.estimated_freight_fee ? parseFloat(data.estimated_freight_fee) : null,
        purchase_value: data.purchase_value ? parseFloat(data.purchase_value) : null,
        actual_auction_fees: data.actual_auction_fees ? parseFloat(data.actual_auction_fees) : null,
        actual_freight_fee: data.actual_freight_fee ? parseFloat(data.actual_freight_fee) : null,
      };

      if (auction) {
        const { data: result, error } = await supabase
          .from('auctions')
          .update(formData)
          .eq('id', auction.id)
          .select()
          .single();
        if (error) throw error;
        return result;
      } else {
        const { data: result, error } = await supabase
          .from('auctions')
          .insert([{ ...formData, created_by: (await supabase.auth.getUser()).data.user?.id }])
          .select()
          .single();
        if (error) throw error;
        return result;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auctions'] });
      toast({
        title: auction ? 'Leilão atualizado' : 'Leilão criado',
        description: auction ? 'Leilão atualizado com sucesso!' : 'Novo leilão criado com sucesso!',
      });
      onSave();
    },
    onError: (error) => {
      toast({
        title: 'Erro',
        description: 'Erro ao salvar leilão. Tente novamente.',
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (data: any) => {
    saveMutation.mutate(data);
  };

  const profitMargin = calculateProfitMargin();

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={onCancel}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex-1">
              <CardTitle className="text-2xl font-bold">
                {auction ? 'Editar Leilão' : 'Novo Leilão'}
              </CardTitle>
              {profitMargin !== null && (
                <div className="mt-2">
                  <Badge 
                    variant={parseFloat(profitMargin) > 0 ? "default" : "destructive"}
                    className={`text-lg px-3 py-1 ${parseFloat(profitMargin) > 0 ? "bg-green-500" : ""}`}
                  >
                    Margem de Lucro: {profitMargin}%
                  </Badge>
                </div>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="auction_house">Leilão *</Label>
                <Select onValueChange={(value) => setValue('auction_house', value)} defaultValue={auction?.auction_house || 'Manheim'}>
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
                <Select onValueChange={(value) => setValue('bid_accepted', value)} defaultValue={auction?.bid_accepted ? 'true' : 'false'}>
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

            {showBidAcceptedFields && (
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
            )}

            <div className="space-y-2">
              <Label htmlFor="observations">Observações</Label>
              <Textarea
                id="observations"
                {...register('observations')}
                placeholder="Observações adicionais..."
                rows={3}
              />
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={saveMutation.isPending}>
                {saveMutation.isPending ? 'Salvando...' : (auction ? 'Atualizar' : 'Criar')}
              </Button>
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuctionForm;
