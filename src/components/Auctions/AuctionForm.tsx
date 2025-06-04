
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import AuctionBasicInfoForm from './AuctionBasicInfoForm';
import AuctionVehicleForm from './AuctionVehicleForm';
import AuctionValuesForm from './AuctionValuesForm';
import AuctionPurchaseForm from './AuctionPurchaseForm';
import ProfitMarginBadge from './ProfitMarginBadge';

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
              {watchCarfaxValue && watchMmrValue && (
                <div className="mt-2">
                  <ProfitMarginBadge 
                    carfaxValue={watchCarfaxValue}
                    mmrValue={watchMmrValue}
                  />
                </div>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <AuctionBasicInfoForm
              register={register}
              setValue={setValue}
              errors={errors}
              watchAuctionHouse={watchAuctionHouse}
              showManheimCity={showManheimCity}
              showOtherAuction={showOtherAuction}
              defaultValues={auction}
            />

            <AuctionVehicleForm
              register={register}
              errors={errors}
            />

            <AuctionValuesForm
              register={register}
              setValue={setValue}
              defaultValues={auction}
            />

            {showBidAcceptedFields && (
              <AuctionPurchaseForm register={register} />
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
