import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface Reservation {
  reservation_number: string;
  customer_name: string;
  checkin_datetime: string;
  checkout_datetime: string;
  // ...other fields ignored
}

const parseReservationList = (data: any[]): Reservation[] => {
  // Map/filter to only the relevant fields for display
  return (data || []).map((item) => ({
    reservation_number: item.reservation_number || "-",
    customer_name: item.customer_name || "-",
    checkin_datetime: item.checkin_datetime || "-",
    checkout_datetime: item.checkout_datetime || "-",
  }));
};

const ConsultaReservas: React.FC = () => {
  const [dateStart, setDateStart] = useState<Date | undefined>(undefined);
  const [dateEnd, setDateEnd] = useState<Date | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [error, setError] = useState<string | null>(null);

  const onBuscar = async () => {
    setLoading(true);
    setReservations([]);
    setError(null);

    if (!dateStart || !dateEnd) {
      setError("Selecione as datas inicial e final.");
      setLoading(false);
      return;
    }

    // Formatar datas para o formato esperado pela API (YYYY-MM-DD)
    const start = format(dateStart, "yyyy-MM-dd");
    const end = format(dateEnd, "yyyy-MM-dd");

    // Montar string de filtros
    const filters = encodeURIComponent(
      JSON.stringify([
        {
          type: "string",
          column: "status",
          operator: "equals",
          value: "open",
        },
        {
          type: "date",
          column: "reservation_date",
          operator: "between",
          value: `${start},${end}`,
        },
      ])
    );

    const url = `https://api-america-3.us5.hqrentals.app/api-america-3/car-rental/reservations?filters=${filters}`;

    try {
      const res = await fetch(url, {
        method: "GET",
        headers: {
          "generated_token": "tenant_token:rafaelvpm",
          "Authorization": "Basic TURqVUUzSDc4UE82RTkxZTlsZFdHUkdRVnBDMmFGUWo0UzRPUVJyblJ5SXRvelhoQks6Um1NZm1iVER0TUptb1FpQUVRcUVZSEJsOEpXM3N2bUFMTTl5ZWZ1bUxYdjhvWnV6aVU=",
        },
      });
      if (!res.ok) {
        setError("Erro ao buscar reservas.");
        setLoading(false);
        return;
      }
      const data = await res.json();

      // Filtrar apenas os campos requeridos, mesmo que o json seja grande
      const onlyRelevant: Reservation[] = parseReservationList(data);
      setReservations(onlyRelevant);
    } catch (e: any) {
      setError("Ocorreu um erro ao buscar dados.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Consulta de Reservas</h2>
      <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 mb-4">
        {/* Data Inicial */}
        <div>
          <label className="block font-medium mb-1">Data Inicial</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className="w-[170px] justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateStart ? format(dateStart, "PPP") : <span>Selecione</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-auto p-0">
              <Calendar
                mode="single"
                selected={dateStart}
                onSelect={setDateStart}
                className="p-3 pointer-events-auto"
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Data Final */}
        <div>
          <label className="block font-medium mb-1">Data Final</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className="w-[170px] justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateEnd ? format(dateEnd, "PPP") : <span>Selecione</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-auto p-0">
              <Calendar
                mode="single"
                selected={dateEnd}
                onSelect={setDateEnd}
                className="p-3 pointer-events-auto"
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <Button
          className="h-10 px-8 mt-2 sm:mt-0"
          onClick={onBuscar}
          disabled={!dateStart || !dateEnd || loading}
        >
          {loading ? "Buscando..." : "Buscar"}
        </Button>
      </div>

      {error && <div className="text-red-500 mb-3">{error}</div>}

      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Resultados</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full border divide-y divide-gray-200">
            <thead>
              <tr className="bg-muted">
                <th className="px-4 py-2 text-left"># Reserva</th>
                <th className="px-4 py-2 text-left">Nome do Cliente</th>
                <th className="px-4 py-2 text-left">Check-in</th>
                <th className="px-4 py-2 text-left">Check-out</th>
              </tr>
            </thead>
            <tbody>
              {reservations.length === 0 && !loading ? (
                <tr>
                  <td colSpan={4} className="px-4 py-3 text-center text-muted-foreground">
                    Nenhum resultado para o período selecionado.
                  </td>
                </tr>
              ) : (
                reservations.map((r, idx) => (
                  <tr key={r.reservation_number + idx} className="border-t">
                    <td className="px-4 py-2">{r.reservation_number}</td>
                    <td className="px-4 py-2">{r.customer_name}</td>
                    <td className="px-4 py-2">{r.checkin_datetime}</td>
                    <td className="px-4 py-2">{r.checkout_datetime}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ConsultaReservas;
