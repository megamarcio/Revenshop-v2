import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface TollRecord {
  id: string;
  vehicle_id?: string;
  vehicle_plate?: string;
  toll_tag?: string;
  toll_location?: string;
  toll_amount: number;
  toll_date: string;
  transaction_id?: string;
  operator_name?: string;
  lane_number?: string;
  vehicle_class?: string;
  payment_method?: string;
  is_reconciled: boolean;
  reconciled_at?: string;
  reconciled_by?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  vehicle?: {
    name: string;
    plate: string;
    internal_code: string;
  };
}

export interface VehicleTollTag {
  id: string;
  vehicle_id: string;
  tag_number: string;
  tag_type?: string;
  is_active: boolean;
  start_date?: string;
  end_date?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  vehicle?: {
    name: string;
    plate: string;
    internal_code: string;
  };
}

export interface TollImport {
  id: string;
  filename: string;
  total_records: number;
  processed_records: number;
  failed_records: number;
  import_status: 'pending' | 'processing' | 'completed' | 'failed';
  error_log?: string;
  imported_by?: string;
  created_at: string;
  updated_at: string;
}

export interface TollFilters {
  vehicle_id?: string;
  vehicle_plate?: string;
  toll_tag?: string;
  start_date?: string;
  end_date?: string;
  is_reconciled?: boolean;
}

export interface CSVTollRecord {
  vehicle_plate?: string;
  toll_tag?: string;
  toll_location?: string;
  toll_amount: number;
  toll_date: string;
  transaction_id?: string;
  operator_name?: string;
  lane_number?: string;
  vehicle_class?: string;
  payment_method?: string;
}

export const useTollManagement = () => {
  const queryClient = useQueryClient();

  // Buscar registros de pedágio com filtros
  const useTollRecords = (filters: TollFilters = {}) => {
    return useQuery({
      queryKey: ['toll-records', filters],
      queryFn: async (): Promise<TollRecord[]> => {
        let query = supabase
          .from('toll_records')
          .select(`
            *,
            vehicle:vehicles(name, plate, internal_code)
          `)
          .order('toll_date', { ascending: false });

        if (filters.vehicle_id) {
          query = query.eq('vehicle_id', filters.vehicle_id);
        }
        if (filters.vehicle_plate) {
          query = query.ilike('vehicle_plate', `%${filters.vehicle_plate}%`);
        }
        if (filters.toll_tag) {
          query = query.ilike('toll_tag', `%${filters.toll_tag}%`);
        }
        if (filters.start_date) {
          query = query.gte('toll_date', filters.start_date);
        }
        if (filters.end_date) {
          query = query.lte('toll_date', filters.end_date);
        }
        if (filters.is_reconciled !== undefined) {
          query = query.eq('is_reconciled', filters.is_reconciled);
        }

        const { data, error } = await query;

        if (error) {
          console.error('Erro ao buscar pedágios:', error);
          throw error;
        }

        return data || [];
      },
      staleTime: 30000, // 30 segundos
    });
  };

  // Buscar tags de pedágio por veículo
  const useVehicleTollTags = (vehicleId?: string) => {
    return useQuery({
      queryKey: ['vehicle-toll-tags', vehicleId],
      queryFn: async (): Promise<VehicleTollTag[]> => {
        let query = supabase
          .from('vehicle_toll_tags')
          .select(`
            *,
            vehicle:vehicles(name, plate, internal_code)
          `)
          .eq('is_active', true)
          .order('created_at', { ascending: false });

        if (vehicleId) {
          query = query.eq('vehicle_id', vehicleId);
        }

        const { data, error } = await query;

        if (error) {
          console.error('Erro ao buscar tags:', error);
          throw error;
        }

        return data || [];
      },
      enabled: !!vehicleId,
      staleTime: 5 * 60 * 1000, // 5 minutos
    });
  };

  // Buscar histórico de importações
  const useTollImports = () => {
    return useQuery({
      queryKey: ['toll-imports'],
      queryFn: async (): Promise<TollImport[]> => {
        const { data, error } = await supabase
          .from('toll_imports')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Erro ao buscar importações:', error);
          throw error;
        }

        return data || [];
      },
      staleTime: 60000, // 1 minuto
    });
  };

  // Conciliar pedágio
  const reconcileTollRecord = useMutation({
    mutationFn: async (id: string): Promise<TollRecord> => {
      const { data: user } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('toll_records')
        .update({
          is_reconciled: true,
          reconciled_at: new Date().toISOString(),
          reconciled_by: user.user?.id,
        })
        .eq('id', id)
        .select(`
          *,
          vehicle:vehicles(name, plate, internal_code)
        `)
        .single();

      if (error) {
        console.error('Erro ao conciliar pedágio:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['toll-records'] });
      toast({
        title: 'Sucesso!',
        description: 'Pedágio conciliado com sucesso.',
      });
    },
    onError: (error) => {
      console.error('Erro ao conciliar pedágio:', error);
      toast({
        title: 'Erro!',
        description: 'Não foi possível conciliar o pedágio.',
        variant: 'destructive',
      });
    },
  });

  // Importar dados de CSV
  const importTollRecords = useMutation({
    mutationFn: async ({ filename, records }: { filename: string; records: CSVTollRecord[] }): Promise<TollImport> => {
      const { data: user } = await supabase.auth.getUser();

      // Criar registro de importação
      const { data: importRecord, error: importError } = await supabase
        .from('toll_imports')
        .insert([{
          filename,
          total_records: records.length,
          imported_by: user.user?.id,
          import_status: 'processing' as const,
        }])
        .select()
        .single();

      if (importError) {
        console.error('Erro ao criar importação:', importError);
        throw importError;
      }

      let processedRecords = 0;
      let failedRecords = 0;
      const errors: string[] = [];

      // Processar registros em lotes
      for (const record of records) {
        try {
          // Tentar encontrar veículo pela placa ou tag
          let vehicleId: string | null = null;
          
          if (record.vehicle_plate) {
            const { data: vehicleByPlate } = await supabase
              .from('vehicles')
              .select('id')
              .ilike('plate', record.vehicle_plate)
              .single();
            
            if (vehicleByPlate) {
              vehicleId = vehicleByPlate.id;
            }
          }

          if (!vehicleId && record.toll_tag) {
            const { data: vehicleByTag } = await supabase
              .from('vehicle_toll_tags')
              .select('vehicle_id')
              .eq('tag_number', record.toll_tag)
              .eq('is_active', true)
              .single();
            
            if (vehicleByTag) {
              vehicleId = vehicleByTag.vehicle_id;
            }
          }

          const { error } = await supabase
            .from('toll_records')
            .insert([{
              vehicle_id: vehicleId,
              vehicle_plate: record.vehicle_plate,
              toll_tag: record.toll_tag,
              toll_location: record.toll_location,
              toll_amount: record.toll_amount,
              toll_date: record.toll_date,
              transaction_id: record.transaction_id,
              operator_name: record.operator_name,
              lane_number: record.lane_number,
              vehicle_class: record.vehicle_class,
              payment_method: record.payment_method,
            }]);

          if (error) {
            failedRecords++;
            errors.push(`Linha ${processedRecords + failedRecords + 1}: ${error.message}`);
          } else {
            processedRecords++;
          }
        } catch (error) {
          failedRecords++;
          errors.push(`Linha ${processedRecords + failedRecords + 1}: ${error}`);
        }
      }

      // Atualizar registro de importação
      const { data: updatedImport, error: updateError } = await supabase
        .from('toll_imports')
        .update({
          processed_records: processedRecords,
          failed_records: failedRecords,
          import_status: failedRecords > 0 ? 'completed' : 'completed',
          error_log: errors.length > 0 ? errors.join('\n') : null,
        })
        .eq('id', importRecord.id)
        .select()
        .single();

      if (updateError) {
        console.error('Erro ao atualizar importação:', updateError);
        throw updateError;
      }

      return updatedImport;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['toll-records'] });
      queryClient.invalidateQueries({ queryKey: ['toll-imports'] });
      
      const { processed_records, failed_records } = data;
      toast({
        title: 'Importação concluída!',
        description: `${processed_records} registros importados com sucesso. ${failed_records} falharam.`,
      });
    },
    onError: (error) => {
      console.error('Erro na importação:', error);
      toast({
        title: 'Erro na importação!',
        description: 'Não foi possível importar os dados.',
        variant: 'destructive',
      });
    },
  });

  return {
    // Queries
    useTollRecords,
    useVehicleTollTags,
    useTollImports,
    
    // Mutations
    reconcileTollRecord,
    importTollRecords,
  };
}; 