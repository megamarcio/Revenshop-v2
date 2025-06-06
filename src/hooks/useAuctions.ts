
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useAuctions = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: auctions, isLoading } = useQuery({
    queryKey: ['auctions'],
    queryFn: async () => {
      // Selecionando apenas os campos necessários em vez de todos (*)
      const { data, error } = await supabase
        .from('auctions')
        .select(`
          id, auction_date, car_year, car_name, auction_house, 
          auction_city, car_link, bid_value, bid_accepted, 
          carfax_value, mmr_value, purchase_value, 
          total_vehicle_cost, vin_number, created_at, created_by
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const createAuction = useMutation({
    mutationFn: async (auctionData: any) => {
      const { data: user } = await supabase.auth.getUser();
      const { data, error } = await supabase
        .from('auctions')
        .insert([{ ...auctionData, created_by: user.user?.id }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auctions'] });
      toast({
        title: 'Sucesso',
        description: 'Leilão criado com sucesso!',
      });
    },
    onError: () => {
      toast({
        title: 'Erro',
        description: 'Erro ao criar leilão.',
        variant: 'destructive',
      });
    },
  });

  const updateAuction = useMutation({
    mutationFn: async ({ id, ...auctionData }: any) => {
      const { data, error } = await supabase
        .from('auctions')
        .update(auctionData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auctions'] });
      toast({
        title: 'Sucesso',
        description: 'Leilão atualizado com sucesso!',
      });
    },
    onError: () => {
      toast({
        title: 'Erro',
        description: 'Erro ao atualizar leilão.',
        variant: 'destructive',
      });
    },
  });

  const deleteAuction = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('auctions')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auctions'] });
      toast({
        title: 'Sucesso',
        description: 'Leilão excluído com sucesso!',
      });
    },
    onError: () => {
      toast({
        title: 'Erro',
        description: 'Erro ao excluir leilão.',
        variant: 'destructive',
      });
    },
  });

  return {
    auctions,
    isLoading,
    createAuction,
    updateAuction,
    deleteAuction,
  };
};
