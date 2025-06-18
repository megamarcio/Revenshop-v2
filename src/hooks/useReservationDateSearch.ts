
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface DateSearchReservation {
  id: string;
  data: {
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
    customer: {
      first_name: string;
      last_name: string;
      f855: string;
      phone_number?: string;
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
  };
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
    // Validar datas
    if (!startDate || !endDate) {
      toast({
        title: "Erro de validação",
        description: "Por favor, selecione as datas inicial e final.",
        variant: "destructive",
      });
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (start > end) {
      toast({
        title: "Erro de validação",
        description: "A data inicial deve ser anterior à data final.",
        variant: "destructive",
      });
      return;
    }

    // Verificar se o período não é muito grande (máximo 1 ano)
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays > 365) {
      toast({
        title: "Período muito extenso",
        description: "Por favor, selecione um período de até 1 ano.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log(`Buscando reservas de ${startDate} até ${endDate} por ${dateField}`);
      
      // Usar filtros simples com start_date e end_date, como na logística
      const baseUrl = 'https://api-america-3.us5.hqrentals.app/api-america-3/car-rental/reservations';
      const queryParams = new URLSearchParams({
        start_date: startDate,
        end_date: endDate,
        sort_by: dateField,
        order: 'desc'
      });
      
      const url = `${baseUrl}?${queryParams.toString()}`;
      console.log('URL da busca:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'generated_token': 'tenant_token:rafaelvpm',
          'Authorization': 'Basic TURqVUUzSDc4UE82RTkxZTlsZFdHUkdRVnBDMmFGUWo0UzRPUVJyblJ5SXRvelhoQks6Um1NZm1iVER0TUptb1FpQUVRcUVZSEJsOEpXM3N2bUFMTTl5ZWZ1bUxYdjhvWnV6aVU=',
          'Content-Type': 'application/json',
        },
      });

      console.log('Status da resposta:', response.status);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Nenhuma reserva encontrada no período especificado');
        } else if (response.status === 400) {
          throw new Error('Parâmetros de busca inválidos');
        }
        throw new Error(`Erro na API: ${response.status}`);
      }

      const result = await response.json();
      console.log('Resposta da API:', result);

      // Processar resposta da API - mapear para o formato esperado pelo componente
      let reservations: DateSearchReservation[] = [];
      
      if (result.data && Array.isArray(result.data)) {
        // Se a API retorna uma lista de reservas
        reservations = result.data.map((apiReservation: any, index: number) => ({
          id: apiReservation.id || `search-${Date.now()}-${index}`,
          data: {
            reservation: {
              id: apiReservation.id,
              pick_up_date: apiReservation.pick_up_date,
              pick_up_location_label: apiReservation.pick_up_location_label,
              return_date: apiReservation.return_date,
              return_location_label: apiReservation.return_location_label,
              status: apiReservation.status,
              outstanding_balance: apiReservation.outstanding_balance,
              signed_at: apiReservation.signed_at,
              total_price: apiReservation.total_price_without_taxes || apiReservation.total_price
            },
            customer: {
              first_name: apiReservation.customer?.first_name || 'N/A',
              last_name: apiReservation.customer?.last_name || 'N/A',
              f855: apiReservation.customer?.f855 || '',
              phone_number: apiReservation.customer?.phone_number
            },
            selected_vehicle_class: apiReservation.selected_vehicle_class,
            vehicles: apiReservation.vehicles
          },
          created_at: apiReservation.created_at,
          updated_at: apiReservation.updated_at
        }));
      } else if (result.data) {
        // Se a API retorna uma única reserva
        const apiReservation = result.data;
        reservations = [{
          id: apiReservation.id || `search-${Date.now()}`,
          data: {
            reservation: {
              id: apiReservation.id,
              pick_up_date: apiReservation.pick_up_date,
              pick_up_location_label: apiReservation.pick_up_location_label,
              return_date: apiReservation.return_date,
              return_location_label: apiReservation.return_location_label,
              status: apiReservation.status,
              outstanding_balance: apiReservation.outstanding_balance,
              signed_at: apiReservation.signed_at,
              total_price: apiReservation.total_price_without_taxes || apiReservation.total_price
            },
            customer: {
              first_name: apiReservation.customer?.first_name || 'N/A',
              last_name: apiReservation.customer?.last_name || 'N/A',
              f855: apiReservation.customer?.f855 || '',
              phone_number: apiReservation.customer?.phone_number
            },
            selected_vehicle_class: apiReservation.selected_vehicle_class,
            vehicles: apiReservation.vehicles
          },
          created_at: apiReservation.created_at,
          updated_at: apiReservation.updated_at
        }];
      }

      setSearchResults(reservations);
      
      toast({
        title: "Busca realizada",
        description: `Encontradas ${reservations.length} reservas no período de ${new Date(startDate).toLocaleDateString('pt-BR')} a ${new Date(endDate).toLocaleDateString('pt-BR')}.`,
      });

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido ao buscar reservas';
      console.error('Erro na busca de reservas:', err);
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
    console.log('Resultados da busca limpos');
  };

  return {
    searchResults,
    loading,
    error,
    searchReservations,
    clearResults
  };
};
