
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { ReservationDetails } from './useReservationById';

export interface DateSearchReservation {
  id: string;
  data: ReservationDetails;
  created_at?: string;
  updated_at?: string;
}

export const useReservationDateSearch = () => {
  const [searchResults, setSearchResults] = useState<DateSearchReservation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const searchReservations = async (
    startDate: string, 
    endDate: string, 
    dateField: 'created_at' | 'updated_at'
  ) => {
    setLoading(true);
    setError(null);

    try {
      // Simular busca na API - aqui você integraria com a API real
      // Por enquanto, vamos usar um mock baseado na estrutura existente
      const mockResults: DateSearchReservation[] = [
        {
          id: `mock-${Date.now()}`,
          data: {
            customer: {
              first_name: 'João',
              last_name: 'Silva',
              f855: '12345',
              phone_number: '+5511999999999'
            },
            reservation: {
              id: `mock-${Date.now()}`,
              pick_up_date: '2024-06-20',
              pick_up_location_label: 'Aeroporto Internacional de São Paulo',
              return_date: '2024-06-25',
              return_location_label: 'Aeroporto Internacional de São Paulo',
              status: 'confirmed',
              outstanding_balance: 'R$ 1.250,00'
            }
          },
          created_at: startDate,
          updated_at: endDate
        }
      ];

      setSearchResults(mockResults);
      
      toast({
        title: "Busca realizada",
        description: `Encontradas ${mockResults.length} reservas no período de ${new Date(startDate).toLocaleDateString('pt-BR')} a ${new Date(endDate).toLocaleDateString('pt-BR')}.`,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
      
      toast({
        title: "Erro na busca",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const clearResults = () => {
    setSearchResults([]);
    setError(null);
  };

  return {
    searchResults,
    loading,
    error,
    searchReservations,
    clearResults
  };
};
