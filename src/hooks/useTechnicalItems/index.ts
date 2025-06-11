
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  fetchTechnicalItems, 
  createDefaultTechnicalItems, 
  updateTechnicalItem,
  createTechnicalItem,
  deleteTechnicalItem
} from './operations';
import { TechnicalItem } from './types';
import { toast } from '@/hooks/use-toast';

export const useTechnicalItems = (vehicleId?: string) => {
  const queryClient = useQueryClient();

  const {
    data: items = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['technical-items', vehicleId],
    queryFn: () => fetchTechnicalItems(vehicleId!),
    enabled: !!vehicleId,
  });

  const createDefaultItemsMutation = useMutation({
    mutationFn: createDefaultTechnicalItems,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['technical-items', vehicleId] });
      toast({
        title: 'Sucesso',
        description: 'Itens técnicos padrão criados com sucesso',
      });
    },
    onError: (error) => {
      console.error('Error creating default items:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao criar itens técnicos padrão',
        variant: 'destructive',
      });
    },
  });

  const updateItemMutation = useMutation({
    mutationFn: ({ itemId, updates }: { itemId: string; updates: Partial<TechnicalItem> }) =>
      updateTechnicalItem(itemId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['technical-items', vehicleId] });
    },
    onError: (error) => {
      console.error('Error updating item:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao atualizar item técnico',
        variant: 'destructive',
      });
    },
  });

  const createItemMutation = useMutation({
    mutationFn: ({ vehicleId, name, type }: { vehicleId: string; name: string; type: string }) =>
      createTechnicalItem(vehicleId, name, type),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['technical-items', vehicleId] });
      toast({
        title: 'Sucesso',
        description: 'Item técnico criado com sucesso',
      });
    },
    onError: (error) => {
      console.error('Error creating item:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao criar item técnico',
        variant: 'destructive',
      });
    },
  });

  const deleteItemMutation = useMutation({
    mutationFn: deleteTechnicalItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['technical-items', vehicleId] });
      toast({
        title: 'Sucesso',
        description: 'Item técnico excluído com sucesso',
      });
    },
    onError: (error) => {
      console.error('Error deleting item:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao excluir item técnico',
        variant: 'destructive',
      });
    },
  });

  return {
    items,
    isLoading,
    error,
    refetch,
    createDefaultItems: createDefaultItemsMutation.mutate,
    updateItem: updateItemMutation.mutate,
    createItem: createItemMutation.mutate,
    deleteItem: deleteItemMutation.mutate,
    isCreatingDefaultItems: createDefaultItemsMutation.isPending,
    isUpdatingItem: updateItemMutation.isPending,
    isCreatingItem: createItemMutation.isPending,
    isDeletingItem: deleteItemMutation.isPending,
  };
};

export * from './types';
