
import React, { useState } from 'react';
import { Truck, ChevronRight, Search } from 'lucide-react';
import { SidebarMenuItem, SidebarMenuButton, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem, useSidebar } from '@/components/ui/sidebar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

type ReservationItem = {
  reservation_number: string;
  customer_name: string;
  checkin_datetime: string;
  checkout_datetime: string;
};

const LogisticsMenu = () => {
  const { state } = useSidebar();

  // Filtros: datas inicial e final
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({ from: undefined, to: undefined });
  const [result, setResult] = useState<ReservationItem[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  // Exibir ou não a busca custom
  const [open, setOpen] = useState(false);

  // Handlers para filtragem e busca dos dados
  const fetchReservations = async () => {
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
    // Monta filtros (igual exemplo)
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
      // Extrai só campos necessários
      const onlyRelevant: ReservationItem[] = data?.data?.map((res: any) => ({
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
  };

  return (
    <SidebarMenuItem>
      <Collapsible className="group/collapsible" open={open} onOpenChange={setOpen}>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton 
            tooltip={state === "collapsed" ? "Logística Rental Car" : undefined}
            className="w-full hover:bg-muted data-[state=open]:bg-muted"
          >
            <Truck className="h-4 w-4" />
            <span className="text-sm px-0 mx-0">Logística Rental Car</span>
            <ChevronRight className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-90" />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            <SidebarMenuSubItem>
              <div className="flex flex-col w-full gap-3 px-2 pb-3 pt-1">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-muted-foreground">Filtrar por datas:</label>
                  <div className="flex gap-2">
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
                          onSelect={from => setDateRange(old => ({ ...old, from }))}
                          className="p-3 pointer-events-auto"
                          disabled={(date) => !!dateRange.to && date > dateRange.to}
                        />
                      </PopoverContent>
                    </Popover>
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
                          onSelect={to => setDateRange(old => ({ ...old, to }))}
                          className="p-3 pointer-events-auto"
                          disabled={(date) => !!dateRange.from && date < dateRange.from}
                        />
                      </PopoverContent>
                    </Popover>
                    <Button
                      size="sm"
                      disabled={loading}
                      className="ml-2"
                      onClick={fetchReservations}
                    >
                      <Search className="w-4 h-4 mr-1" /> {loading ? "Buscando..." : "Buscar"}
                    </Button>
                  </div>
                </div>
                {/* Exibe erros */}
                {error && <div className="text-xs text-red-500 mt-1">{error}</div>}

                {/* Resultado da busca */}
                {result && (
                  <div className="bg-gray-100 rounded px-2 py-1 mt-3 max-h-52 overflow-auto">
                    <table className="text-xs w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="p-1 text-left font-bold">Reserva</th>
                          <th className="p-1 text-left font-bold">Cliente</th>
                          <th className="p-1 text-left font-bold">Checkin</th>
                          <th className="p-1 text-left font-bold">Checkout</th>
                        </tr>
                      </thead>
                      <tbody>
                        {result.length === 0 && (
                          <tr>
                            <td colSpan={4} className="p-2 text-center text-gray-500">Nenhuma reserva encontrada</td>
                          </tr>
                        )}
                        {result.map((res, idx) => (
                          <tr key={idx} className="border-b last:border-0">
                            <td className="p-1">{res.reservation_number}</td>
                            <td className="p-1">{res.customer_name}</td>
                            <td className="p-1">{res.checkin_datetime ? res.checkin_datetime.replace("T", " ").slice(0,16) : "-"}</td>
                            <td className="p-1">{res.checkout_datetime ? res.checkout_datetime.replace("T", " ").slice(0,16) : "-"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </SidebarMenuSubItem>
          </SidebarMenuSub>
        </CollapsibleContent>
      </Collapsible>
    </SidebarMenuItem>
  );
};

export default LogisticsMenu;
