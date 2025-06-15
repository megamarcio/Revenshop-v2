import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { format, parseISO } from "date-fns";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

interface Reservation {
  reservation_number: string;
  customer_name: string;
  checkin_datetime: string;
  checkout_datetime: string;
}

const parseReservationList = (data: any): Reservation[] => {
  // Tenta encontrar reservas dentro de diferentes modelos de resposta.
  const list = Array.isArray(data) ? data : (data?.data || []);
  // Busca campos customizados no JSON (pode variar conforme API)
  return (list || []).map((item) => ({
    reservation_number: item.custom_reservation_number ||
      item.reservation_number ||
      item.prefixed_id ||
      item.id?.toString() ||
      "-",
    customer_name:
      item.customer_name ||
      item.customer?.name ||
      item.customer_fullname ||
      item.customer?.full_name ||
      "-",
    checkin_datetime:
      item.pick_up_date ||
      item.checkin_datetime ||
      item.initial_pick_up_date ||
      "-",
    checkout_datetime:
      item.return_date ||
      item.checkout_datetime ||
      item.initial_return_date ||
      "-",
  }));
};

function toFullIsoWithZ(dt: string): string {
  if (!dt) return "";
  // Já em ISO?
  if (dt.endsWith("Z") && dt.includes("T")) return dt;
  // Converte para o formato correto (YYYY-MM-DDTHH:mm:ss.000000Z)
  try {
    const date = new Date(dt);
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const day = String(date.getUTCDate()).padStart(2, "0");
    const hour = String(date.getUTCHours()).padStart(2, "0");
    const min = String(date.getUTCMinutes()).padStart(2, "0");
    const sec = String(date.getUTCSeconds()).padStart(2, "0");
    return `${year}-${month}-${day}T${hour}:${min}:${sec}.000000Z`;
  } catch {
    return dt;
  }
}

const ConsultaReservas: React.FC = () => {
  // data_inicio/data_fim em formato "2025-06-12T08:00"
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [loading, setLoading] = useState(false);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [rawApiData, setRawApiData] = useState<any | null>(null); // NOVO: armazenamento bruto do JSON

  // Garante string correta ISO para filtro
  const getFiltroDatas = () => {
    const inicio = toFullIsoWithZ(dataInicio);
    const fim = toFullIsoWithZ(dataFim);
    return { inicio, fim };
  };

  const onBuscar = async () => {
    setLoading(true);
    setReservations([]);
    setError(null);
    setRawApiData(null); // reseta o dado bruto

    const { inicio, fim } = getFiltroDatas();

    if (!inicio || !fim) {
      setError("Preencha as datas inicial e final completas (data e hora).");
      setLoading(false);
      return;
    }

    // Monta o JSON de filtros conforme instrução
    const filtros = [
      {
        type: "string",
        column: "status",
        operator: "equals",
        value: "open",
      },
      {
        type: "string",
        column: "pick_up_date",
        operator: "between",
        value: `${inicio},${fim}`,
      },
      {
        type: "string",
        column: "return_date",
        operator: "between",
        value: `${inicio},${fim}`,
      },
    ];

    const filtros_codificados = encodeURIComponent(JSON.stringify(filtros));
    const url = `https://api-america-3.us5.hqrentals.app/api-america-3/car-rental/reservations?filters=${filtros_codificados}`;

    try {
      const res = await fetch(url, {
        method: "GET",
        headers: {
          "generated_token": "tenant_token:rafaelvpm",
          "Authorization":
            "Basic TURqVUUzSDc4UE82RTkxZTlsZFdHUkdRVnBDMmFGUWo0UzRPUVJyblJ5SXRvelhoQks6Um1NZm1iVER0TUptb1FpQUVRcUVZSEJsOEpXM3N2bUFMTTl5ZWZ1bUxYdjhvWnV6aVU=",
        },
      });
      if (!res.ok) {
        setError("Erro ao buscar reservas.");
        setLoading(false);
        return;
      }
      const data = await res.json();

      setRawApiData(data); // salva dados brutos

      // Só mostra campos solicitados:
      const onlyRelevant = parseReservationList(data);
      setReservations(onlyRelevant);
      if (onlyRelevant.length === 0) {
        toast({ title: "Nenhum resultado.", description: "Nenhuma reserva encontrada para o filtro." });
      }
    } catch (e: any) {
      setError("Ocorreu um erro ao buscar dados.");
    } finally {
      setLoading(false);
    }
  };

  // NOVO: Função para baixar o JSON
  const handleDownloadJson = () => {
    if (!rawApiData) return;
    const jsonStr = JSON.stringify(rawApiData, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "reservas.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Consulta de Reservas</h2>
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        {/* Data/Hora Inicial */}
        <div>
          <label htmlFor="dataInicio" className="block text-sm font-medium mb-1">Data Inicial</label>
          <Input
            type="datetime-local"
            id="dataInicio"
            value={dataInicio}
            onChange={(e) => setDataInicio(e.target.value)}
            className="w-[210px]"
            step={1}
            required
          />
        </div>
        {/* Data/Hora Final */}
        <div>
          <label htmlFor="dataFim" className="block text-sm font-medium mb-1">Data Final</label>
          <Input
            type="datetime-local"
            id="dataFim"
            value={dataFim}
            onChange={(e) => setDataFim(e.target.value)}
            className="w-[210px]"
            step={1}
            required
          />
        </div>
        <Button
          className="h-10 px-8 mt-7"
          onClick={onBuscar}
          disabled={loading || !dataInicio || !dataFim}
        >
          {loading ? "Buscando..." : "Buscar"}
        </Button>
      </div>
      {error && <div className="text-red-500 mb-3">{error}</div>}

      {/* NOVO: Botão de download JSON */}
      {rawApiData && (
        <div className="mb-4">
          <Button variant="secondary" onClick={handleDownloadJson}>
            Baixar JSON do Resultado
          </Button>
        </div>
      )}

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
                    Nenhum resultado.
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
