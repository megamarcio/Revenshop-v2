
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface ReservationDetails {
  customer: {
    first_name: string;
    f855: string; // Kommo Lead ID
  };
  reservation: {
    pick_up_date: string;
    pick_up_location_label: string;
    return_date: string;
    return_location_label: string;
    status: string;
    outstanding_balance: string;
  };
}

export const useReservationById = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ReservationDetails | null>(null);
  const { toast } = useToast();

  const fetchReservation = async (reservationId: string) => {
    if (!reservationId.trim()) {
      setError('ID da reserva é obrigatório');
      return;
    }

    setLoading(true);
    setError(null);
    setData(null);

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
        if (response.status === 404) {
          throw new Error('Reserva não encontrada');
        }
        throw new Error(`Erro na API: ${response.status}`);
      }

      const result = await response.json();
      console.log('API Response:', result);
      
      setData(result.data);
      toast({
        title: "Sucesso",
        description: "Reserva encontrada com sucesso!",
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
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
    clearError: () => setError(null)
  };
};
