
import { useState } from 'react';
import { ReservationDetails } from './useReservationById';
import { useToast } from '@/hooks/use-toast';

export interface ReservationListItem {
  id: string;
  data: ReservationDetails | null;
  loading: boolean;
  error: string | null;
}

export const useReservationsList = () => {
  const [reservations, setReservations] = useState<ReservationListItem[]>([]);
  const { toast } = useToast();

  const addReservation = async (reservationId: string) => {
    if (!reservationId.trim()) return;
    
    // Verificar se já existe
    if (reservations.find(r => r.id === reservationId)) {
      toast({
        title: "Reserva já adicionada",
        description: `A reserva ${reservationId} já está na lista.`,
        variant: "destructive",
      });
      return;
    }

    // Adicionar à lista com estado de loading
    const newReservation: ReservationListItem = {
      id: reservationId,
      data: null,
      loading: true,
      error: null
    };

    setReservations(prev => [...prev, newReservation]);

    // Buscar dados da API
    try {
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
        throw new Error(response.status === 404 ? 'Reserva não encontrada' : `Erro na API: ${response.status}`);
      }

      const result = await response.json();
      
      setReservations(prev => 
        prev.map(r => 
          r.id === reservationId 
            ? { ...r, data: result.data, loading: false, error: null }
            : r
        )
      );

      toast({
        title: "Reserva adicionada",
        description: `Reserva ${reservationId} carregada com sucesso!`,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      
      setReservations(prev => 
        prev.map(r => 
          r.id === reservationId 
            ? { ...r, loading: false, error: errorMessage }
            : r
        )
      );

      toast({
        title: "Erro ao carregar reserva",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const removeReservation = (reservationId: string) => {
    setReservations(prev => prev.filter(r => r.id !== reservationId));
  };

  const clearAll = () => {
    setReservations([]);
  };

  return {
    reservations,
    addReservation,
    removeReservation,
    clearAll
  };
};
