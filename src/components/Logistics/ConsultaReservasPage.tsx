
import React, { useCallback } from "react";
import { useReservaConsulta } from "@/contexts/ReservaConsultaContext";
import { Button } from "@/components/ui/button";
import { X, Search } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";

const ConsultaReservasPage = () => {
  const {
    dateRange, setDateRange,
    result, setResult,
    loading, setLoading,
    error, setError,
    clear
  } = useReservaConsulta();

  // Função para buscar reservas (antes estava no sidebar)
  const fetchReservations = useCallback(async () => {
    setLoading(true);
    setError("");
    setResult(null);

    if (!dateRange.from || !dateRange.to) {
      setError("Selecione data inicial e final.");
      setLoading(false);
      return;
    }

    const fromStr = format(dateRange.from, "yyyy-MM-dd");
    const toStr = format(dateRange.to, "yyyy-MM-dd");
    const filters = encodeURIComponent(JSON.stringify([
      { type: "string", column: "status", operator: "equals", value: "open" },
      { type: "date", column: "reservation_date", operator: "between", value: `${fromStr},${toStr}` }
    ]));
    try {
      const res = await fetch(`https://api-america-3.us5.hqrentals.app/api-america-3/car-rental/reservations?filters=${filters}`, {
        headers: {
          "generated_token": "tenant_token:rafaelvpm",
          "Authorization": "Basic TURqVUUzSDc4UE82RTkxZTlsZFdHUkdRVnBDMmFGUWo0UzRPUVJyblJ5SXRvelhoQks6Um1NZm1iVER0TUptb1FpQUVRcUVZSEJsOEpXM3N2bUFMTTl5ZWZ1bUxYdjhvWnV6aVU="
        },
        method: "GET"
      });
      if (!res.ok) throw new Error("Falha ao buscar reservas");
      const data = await res.json();
      const onlyRelevant = data?.data?.map((res: any) => ({
        reservation_number: res.reservation_number || "-",
        customer_name: res.customer_name || "-",
        checkin_datetime: res.checkin_datetime || "-",
        checkout_datetime: res.checkout_datetime || "-"
      })) ?? [];
      setResult(onlyRelevant);
    } catch (err: any) {
      setError(err.message || "Erro desconhecido na requisição");
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateRange.from, dateRange.to]); // depende só dessas datas

  // Se nunca buscou, mostra zona de filtro
  const filtroInvalido = !dateRange.from || !dateRange.to;

  // Filtro/datapicker inputs no centro da tela agora!
  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded-lg shadow flex flex-col gap-3 mt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Consulta de Reservas</h2>
        <Button variant="ghost" size="icon" onClick={clear} title="Fechar resultados">
          <X className="w-5 h-5" />
        </Button>
      </div>
      
      {/* Campos de filtro centralizados no painel central */}
      <div className="flex flex-col gap-3 md:flex-row md:items-end">
        <div className="flex gap-2">
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground mb-1">Data inicial:</span>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-[130px] justify-start text-left font-normal">
                  {dateRange.from ? format(dateRange.from, "dd/MM/yyyy") : "Data inicial"}
                </Button>
              </PopoverTrigger>
              <PopoverContent align="start" className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={dateRange.from}
                  onSelect={from => setDateRange({ ...dateRange, from })}
                  className="p-3 pointer-events-auto"
                  disabled={(date) => !!dateRange.to && date > dateRange.to}
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground mb-1">Data final:</span>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-[130px] justify-start text-left font-normal">
                  {dateRange.to ? format(dateRange.to, "dd/MM/yyyy") : "Data final"}
                </Button>
              </PopoverTrigger>
              <PopoverContent align="start" className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={dateRange.to}
                  onSelect={to => setDateRange({ ...dateRange, to })}
                  className="p-3 pointer-events-auto"
                  disabled={(date) => !!dateRange.from && date < dateRange.from}
                />
              </PopoverContent>
            </Popover>
          </div>
          <Button
            size="sm"
            disabled={loading}
            className="ml-2 self-end"
            onClick={fetchReservations}
          >
            <Search className="w-4 h-4 mr-1" /> {loading ? "Buscando..." : "Buscar"}
          </Button>
        </div>
      </div>

      {error && <div className="text-xs text-red-500">{error}</div>}

      {/* Se filtro inválido, informativo */}
      {filtroInvalido && (
        <div className="text-sm text-muted-foreground">
          Selecione o intervalo de datas para buscar reservas.
        </div>
      )}

      {!error && loading && <div className="text-sm">Buscando reservas...</div>}

      {result && !loading && !error && (
        <div className="rounded border bg-gray-50 overflow-x-auto">
          <table className="text-sm w-full">
            <thead>
              <tr className="border-b">
                <th className="p-2 text-left font-bold">Reserva</th>
                <th className="p-2 text-left font-bold">Cliente</th>
                <th className="p-2 text-left font-bold">Checkin</th>
                <th className="p-2 text-left font-bold">Checkout</th>
              </tr>
            </thead>
            <tbody>
              {result.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-3 text-center text-gray-500">
                    Nenhuma reserva encontrada
                  </td>
                </tr>
              )}
              {result.map((res, idx) => (
                <tr key={idx} className="border-b last:border-0">
                  <td className="p-2">{res.reservation_number}</td>
                  <td className="p-2">{res.customer_name}</td>
                  <td className="p-2">
                    {res.checkin_datetime ? res.checkin_datetime.replace("T", " ").slice(0, 16) : "-"}
                  </td>
                  <td className="p-2">
                    {res.checkout_datetime ? res.checkout_datetime.replace("T", " ").slice(0, 16) : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ConsultaReservasPage;
