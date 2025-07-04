import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export interface ReservationDetails {
  customer: {
    first_name: string;
    last_name: string;
    f855: string; // Kommo Lead ID
    phone_number?: string;
    label?: string; // Customer label for logistica badges
  };
  reservation: {
    id?: string | number;
    pick_up_date: string;
    pick_up_location_label: string;
    return_date: string;
    return_location_label: string;
    status: string;
    outstanding_balance: string;
    signed_at?: string | null;
    total_price?: {
      amount_for_display: string;
    };
  };
  selected_vehicle_class?: {
    vehicle_class?: {
      label?: string;
    };
  };
  vehicles?: Array<{
    vehicle?: {
      label?: string;
      plate?: string;
    };
  }>;
  created_at?: string;
  updated_at?: string;
  temperature?: string;
  notes?: string;
  assigned_to?: string;
  delegated_to_user_id?: string;
  contact_stage?: string;
}

// Histórico de consultas
const MAX_HISTORY = 10;
let queryHistory: string[] = JSON.parse(localStorage.getItem('reservationQueryHistory') || '[]');

export const useReservationById = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ReservationDetails | null>(null);
  const { toast } = useToast();

  // Função para adicionar ao histórico
  const addToHistory = (reservationId: string) => {
    if (!queryHistory.includes(reservationId)) {
      queryHistory.unshift(reservationId);
      queryHistory = queryHistory.slice(0, MAX_HISTORY);
      localStorage.setItem('reservationQueryHistory', JSON.stringify(queryHistory));
    }
  };

  // Função para obter o histórico
  const getHistory = () => {
    return queryHistory;
  };

  const fetchReservation = async (reservationId: string) => {
    if (!reservationId.trim()) {
      setError('ID da reserva é obrigatório');
      return;
    }

    setLoading(true);
    setError(null);
    setData(null);

    try {
      // Busca na API externa
      const response = await fetch(
        `https://api-america-3.us5.hqrentals.app/api-america-3/car-rental/reservations/${reservationId}`,
        {
          method: 'GET',
          headers: {
            'generated_token': 'tenant_token:rafaelvpm',
            'Authorization': 'Basic TURqVUUzSDc4UE82RTkxZTlsZFdHUkdRVnBDMmFGUWo0UzRPUVJyblJ5SXRvelhoQks6Um1NZm1iVER0TUptb1FpQUVRcUVZSEJsOEpXM3N2bUFMTTl5ZWZ1bUxYdjhvWnV6aVU=',
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Reserva não encontrada');
        }
        throw new Error(`Erro na API: ${response.status}`);
      }

      const result = await response.json();
      console.log('API Response:', result);

      // Busca campos customizados no Supabase
      const { data: customFields, error: supabaseError } = await supabase
        .from('reservations')
        .select('temperature, notes, assigned_to, delegated_to_user_id, contact_stage')
        .eq('id', reservationId)
        .single();

      if (supabaseError) {
        console.warn('Erro ao buscar campos customizados no Supabase:', supabaseError);
      }

      // Merge: se existir no Supabase, prevalece sobre o da API
      const mergedData: ReservationDetails = {
        ...result.data,
        ...(customFields && typeof customFields === 'object' ? Object.fromEntries(
          Object.entries(customFields).filter(([key, value]) => value !== undefined && value !== null && value !== '')
        ) : {})
      };

      setData(mergedData);
      addToHistory(reservationId);
      toast({
        title: 'Sucesso',
        description: 'Reserva encontrada com sucesso!',
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
      toast({
        title: 'Erro',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    data,
    fetchReservation,
    clearData: () => setData(null),
    clearError: () => setError(null),
    getHistory
  };
};
