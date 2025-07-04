import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
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
        car_year: data.car_year ? parseInt(data.car_year) : null,
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
        auction_date: data.auction_date || null,
        purchase_date: data.purchase_date || null,
      };

      console.log('Saving auction data:', formData);

      if (auction) {
        const { data: result, error } = await supabase
          .from('auctions')
          .update(formData)
          .eq('id', auction.id)
          .select()
          .single();
        if (error) {
          console.error('Error updating auction:', error);
          throw error;
        }
        return result;
      } else {
        const { data: user } = await supabase.auth.getUser();
        const { data: result, error } = await supabase
          .from('auctions')
          .insert([{ ...formData, created_by: user.user?.id }])
          .select()
          .single();
        if (error) {
          console.error('Error creating auction:', error);
          throw error;
        }
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
      console.error('Error saving auction:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao salvar leilão. Verifique os dados e tente novamente.',
        variant: 'destructive',
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('auctions')
        .delete()
        .eq('id', auction.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auctions'] });
      toast({
        title: 'Sucesso',
        description: 'Leilão excluído com sucesso!',
      });
      onSave();
    },
    onError: (error) => {
      console.error('Error deleting auction:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao excluir leilão.',
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (data: any) => {
    console.log('Form submitted with data:', data);
    saveMutation.mutate(data);
  };

  const handleDelete = () => {
    deleteMutation.mutate();
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
                    carfaxValue={parseFloat(watchCarfaxValue)}
                    mmrValue={parseFloat(watchMmrValue)}
                  />
                </div>
              )}
            </div>
            {auction && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                    <AlertDialogDescription>
                      Tem certeza de que deseja excluir este leilão? Esta ação não pode ser desfeita.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} disabled={deleteMutation.isPending}>
                      {deleteMutation.isPending ? 'Excluindo...' : 'Excluir'}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
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
              watch={watch}
            />

            <AuctionValuesForm
              register={register}
              setValue={setValue}
              defaultValues={auction}
            />

            {showBidAcceptedFields && (
              <AuctionPurchaseForm 
                register={register} 
                watch={watch}
              />
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
