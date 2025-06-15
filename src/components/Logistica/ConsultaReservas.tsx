
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

// Novo tipo, representando exatamente os campos desejados
interface Reservation {
  reservation_id: string;
  customer_first_name: string;
  customer_last_name: string;
  pickup_date: string;
  return_date: string;
  vehicle: string;
}

// Novo parser para o modelo informado
const parseReservationList = (data: any): Reservation[] => {
  const list = Array.isArray(data) ? data : (data?.data || []);
  return (list || []).map((item) => {
    // customer pode ser um objeto ou não, então extraímos de ambos jeitos
    let customerFirstName = "-";
    let customerLastName = "-";
    if (item.customer && typeof item.customer === "object") {
      customerFirstName = item.customer.first_name || "-";
      customerLastName = item.customer.last_name || "-";
    } else if (item.customer_fullname) {
      // Se vier nome completo, tentar separar por espaço
      const nameParts = String(item.customer_fullname).split(" ");
      customerFirstName = nameParts[0] || "-";
      customerLastName = nameParts.slice(1).join(" ") || "-";
    }

    // reservation_id pode ser id, prefixed_id ou custom_reservation_number
    const reservationId =
      item.reservation_id ||
      item.custom_reservation_number ||
      item.prefixed_id ||
      item.id?.toString() ||
      "-";

    // pickup_date e return_date (padrão: pick_up_date e return_date)
    const pickupDate =
      item.pick_up_date ||
      item.checkin_datetime ||
      item.initial_pick_up_date ||
      "-";
    const returnDate =
      item.return_date ||
      item.checkout_datetime ||
      item.initial_return_date ||
      "-";
    // Vehicle: buscar campos comuns ao vehicle na reserva
    let vehicle = "-";
    if (item.vehicle && typeof item.vehicle === "object") {
      vehicle = item.vehicle.name || item.vehicle.model || "-";
    } else if (item.vehicle_name) {
      vehicle = item.vehicle_name;
    } else if (item.model) {
      vehicle = item.model;
    }

    return {
      reservation_id: reservationId,
      customer_first_name: customerFirstName,
      customer_last_name: customerLastName,
      pickup_date: pickupDate,
      return_date: returnDate,
      vehicle,
    };
  });
};

// Mesma lógica ISO (mantida do original)
function toFullIsoWithZ(dt: string): string {
  if (!dt) return "";
  if (dt.endsWith("Z") && dt.includes("T")) return dt;
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
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [loading, setLoading] = useState(false);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [rawApiData, setRawApiData] = useState<any | null>(null);

  const getFiltroDatas = () => {
    const inicio = toFullIsoWithZ(dataInicio);
    const fim = toFullIsoWithZ(dataFim);
    return { inicio, fim };
  };

  const onBuscar = async () => {
    setLoading(true);
    setReservations([]);
    setError(null);
    setRawApiData(null);

    const { inicio, fim } = getFiltroDatas();

    if (!inicio || !fim) {
      setError("Preencha as datas inicial e final completas (data e hora).");
      setLoading(false);
      return;
    }

    // Monta filtro somente pelo pick_up_date
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

      setRawApiData(data);

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
                <th className="px-4 py-2 text-left">Reservation ID</th>
                <th className="px-4 py-2 text-left">Customer First Name</th>
                <th className="px-4 py-2 text-left">Customer Last Name</th>
                <th className="px-4 py-2 text-left">Pickup Date</th>
                <th className="px-4 py-2 text-left">Return Date</th>
                <th className="px-4 py-2 text-left">Vehicle</th>
              </tr>
            </thead>
            <tbody>
              {reservations.length === 0 && !loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-3 text-center text-muted-foreground">
                    Nenhum resultado.
                  </td>
                </tr>
              ) : (
                reservations.map((r, idx) => (
                  <tr key={r.reservation_id + idx} className="border-t">
                    <td className="px-4 py-2">{r.reservation_id}</td>
                    <td className="px-4 py-2">{r.customer_first_name}</td>
                    <td className="px-4 py-2">{r.customer_last_name}</td>
                    <td className="px-4 py-2">{r.pickup_date}</td>
                    <td className="px-4 py-2">{r.return_date}</td>
                    <td className="px-4 py-2">{r.vehicle}</td>
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

