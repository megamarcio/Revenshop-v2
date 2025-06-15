import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { Download, ExternalLink, Phone } from "lucide-react";

// Novo tipo, representando exatamente os campos desejados
interface Reservation {
  reservation_id: string;
  customer_first_name: string;
  customer_last_name: string;
  pickup_date: string;
  return_date: string;
  plate: string;
  phone_number?: string; // novo campo opcional
}

// Novo parser para o modelo informado
const parseReservationList = (data: any): Reservation[] => {
  const list = Array.isArray(data) ? data : data?.data || [];
  return (list || []).map(item => {
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
    const reservationId = item.reservation_id || item.custom_reservation_number || item.prefixed_id || item.id?.toString() || "-";

    // pickup_date e return_date (padrão: pick_up_date e return_date)
    const pickupDate = item.pick_up_date || item.checkin_datetime || item.initial_pick_up_date || "-";
    const returnDate = item.return_date || item.checkout_datetime || item.initial_return_date || "-";

    // Corrigido: pegar plate do primeiro elemento do ARRAY reservation_vehicle_information, se existir
    let plate = "-";
    if (Array.isArray(item.reservation_vehicle_information) && item.reservation_vehicle_information.length > 0) {
      plate = item.reservation_vehicle_information[0]?.plate || "-";
    } else if (item.reservation_vehicle_information && typeof item.reservation_vehicle_information === "object" && item.reservation_vehicle_information.plate) {
      // fallback antigo para caso algum JSON venha como objeto
      plate = item.reservation_vehicle_information.plate;
    } else if (item.vehicle && typeof item.vehicle === "object") {
      plate = item.vehicle.plate || "-";
    } else if (item.vehicle_plate) {
      plate = item.vehicle_plate;
    }

    // Novo: phone_number
    let phone_number = "-";
    if (item.customer && typeof item.customer === "object") {
      phone_number = item.customer.phone_number || item.customer.phone || "-";
    } else if (item.phone_number) {
      phone_number = item.phone_number;
    } else if (item.customer_phone) {
      phone_number = item.customer_phone;
    }
    return {
      reservation_id: reservationId,
      customer_first_name: customerFirstName,
      customer_last_name: customerLastName,
      pickup_date: pickupDate,
      return_date: returnDate,
      plate,
      phone_number
    };
  });
};

// Nova função para formatar datas para "DD/MM" e hora para "HH:MM"
function formatDateTime(dateStr: string): {
  date: string;
  time: string;
} {
  if (!dateStr || dateStr === "-") return {
    date: "-",
    time: "-"
  };
  try {
    const date = new Date(dateStr);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return {
      date: `${day}/${month}`,
      time: `${hours}:${minutes}`
    };
  } catch {
    return {
      date: "-",
      time: "-"
    };
  }
}

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
const getTodayDateString = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};
const ConsultaReservas: React.FC = () => {
  // Definindo padrão: data de hoje
  const [dataInicio, setDataInicio] = useState(getTodayDateString());
  const [dataFim, setDataFim] = useState(getTodayDateString());
  const [loading, setLoading] = useState(false);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [rawApiData, setRawApiData] = useState<any | null>(null);
  const [lastRequestLog, setLastRequestLog] = useState<any | null>(null);
  const [rowKommoLeadIds, setRowKommoLeadIds] = useState<{ [reservationId: string]: string }>({});

  // Nova função para extrair e formatar datas
  const getFiltroDatas = () => {
    // Recebe do usuário em yyyy-mm-dd, precisa compor ISO de "meia-noite"
    const inicio = dataInicio && /^\d{4}-\d{2}-\d{2}$/.test(dataInicio) ? `${dataInicio}T00:00:00` : "";
    const fim = dataFim && /^\d{4}-\d{2}-\d{2}$/.test(dataFim) ? `${dataFim}T00:00:00` : "";
    // A API espera yyyy-mm-dd, então extraímos só a parte da data
    return {
      inicio: inicio ? inicio.slice(0, 10) : "",
      fim: fim ? fim.slice(0, 10) : ""
    };
  };
  const onBuscar = async () => {
    setLoading(true);
    setReservations([]);
    setError(null);
    setRawApiData(null);
    setLastRequestLog(null);
    const {
      inicio,
      fim
    } = getFiltroDatas();
    if (!inicio || !fim) {
      setError("Preencha as datas inicial e final completas (data e hora).");
      setLoading(false);
      return;
    }
    const filtros = [{
      type: "date",
      column: "pick_up_date",
      operator: "between",
      value: `${inicio},${fim}`
    }, {
      type: "string",
      column: "status",
      operator: "equals",
      value: "open"
    }];
    const filtros_codificados = encodeURIComponent(JSON.stringify(filtros));
    const url = `https://api-america-3.us5.hqrentals.app/api-america-3/car-rental/reservations?filters=${filtros_codificados}`;
    const headers = {
      "generated_token": "tenant_token:rafaelvpm",
      "Authorization": "Basic TURqVUUzSDc4UE82RTkxZTlsZFdHUkdRVnBDMmFGUWo0UzRPUVJyblJ5SXRvelhoQks6Um1NZm1iVER0TUptb1FpQUVRcUVZSEJsOEpXM3N2bUFMTTl5ZWZ1bUxYdjhvWnV6aVU="
    };
    let responseLog: any = {
      url,
      method: "GET",
      headers,
      filters: filtros,
      filters_encoded: filtros_codificados,
      response_json: null,
      error: null
    };
    try {
      const res = await fetch(url, {
        method: "GET",
        headers
      });
      if (!res.ok) {
        setError("Erro ao buscar reservas.");
        responseLog.error = `HTTP ${res.status} - ${res.statusText || "Unknown error"}`;
        setLastRequestLog(responseLog);
        setLoading(false);
        return;
      }
      const data = await res.json();
      setRawApiData(data);

      // Salvar resposta no log
      responseLog.response_json = data;
      setLastRequestLog(responseLog);

      const onlyRelevant = parseReservationList(data);
      setReservations(onlyRelevant);

      // --- CAPTURA O "f855" PARA CADA RESERVA ---
      // Construir um map: reservation.reservation_id => f855
      // Aceita formatos data.data, data, etc.
      const list = Array.isArray(data) ? data : data?.data || [];
      const kommoMap: { [reservationId: string]: string } = {};
      list.forEach((item: any) => {
        // Pegue o reservation_id pelo mesmo critério que o parser
        const reservationId =
          item.reservation_id ||
          item.custom_reservation_number ||
          item.prefixed_id ||
          (item.id ? String(item.id) : "-");
        // Nova lógica: procura em customer.f855, item.f855 ou item.custom_fields.f855
        let kommoId: string | undefined = undefined;
        if (item.customer && typeof item.customer === "object" && item.customer.f855) {
          kommoId = String(item.customer.f855);
        } else if (item.f855) {
          kommoId = String(item.f855);
        } else if (item.custom_fields && item.custom_fields.f855) {
          kommoId = String(item.custom_fields.f855);
        }
        if (reservationId && kommoId) {
          kommoMap[reservationId] = kommoId;
        }
      });
      setRowKommoLeadIds(kommoMap);

      if (onlyRelevant.length === 0) {
        toast({
          title: "Nenhum resultado.",
          description: "Nenhuma reserva encontrada para o filtro."
        });
      }
    } catch (e: any) {
      setError("Ocorreu um erro ao buscar dados.");
      responseLog.error = `JS Exception: ${e?.message || e}`;
      setLastRequestLog(responseLog);
    } finally {
      setLoading(false);
    }
  };

  // Botão para baixar o log da última requisição
  const handleDownloadRequestLog = () => {
    if (!lastRequestLog) return;
    const jsonStr = JSON.stringify(lastRequestLog, null, 2);
    const blob = new Blob([jsonStr], {
      type: "application/json"
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "log_requisicao_consulta_reservas.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  };
  return <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Consulta de Reservas</h2>
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div>
          <label htmlFor="dataInicio" className="block text-sm font-medium mb-1">Data Inicial</label>
          <Input type="date" id="dataInicio" value={dataInicio} onChange={e => setDataInicio(e.target.value)} className="w-[210px]" required />
        </div>
        <div>
          <label htmlFor="dataFim" className="block text-sm font-medium mb-1">Data Final</label>
          <Input type="date" id="dataFim" value={dataFim} onChange={e => setDataFim(e.target.value)} className="w-[210px]" required />
        </div>
        <div className="flex flex-row items-end gap-2 mt-7">
          <Button className="h-10 px-8" onClick={onBuscar} disabled={loading || !dataInicio || !dataFim}>
            {loading ? "Buscando..." : "Buscar"}
          </Button>
          <Button variant="outline" size="icon" className="h-10 w-10" onClick={handleDownloadRequestLog} disabled={!lastRequestLog} title="Baixar log da última requisição" aria-label="Baixar log da última requisição" tabIndex={0}>
            <Download className="w-5 h-5" />
          </Button>
        </div>
      </div>
      {error && <div className="text-red-500 mb-3">{error}</div>}

      {rawApiData && <div className="mb-4">
          <Button variant="secondary" onClick={() => {
        const jsonStr = JSON.stringify(rawApiData, null, 2);
        const blob = new Blob([jsonStr], {
          type: "application/json"
        });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "reservas.json";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
      }}>
            Baixar JSON do Resultado
          </Button>
        </div>}

      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Resultados</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full border divide-y divide-gray-200">
            <thead>
              <tr className="bg-muted">
                <th className="px-4 py-2 text-left" style={{
                fontSize: 13,
                fontWeight: 600
              }}>Reserva&nbsp;</th>
                <th className="px-4 py-2 text-left" style={{
                fontSize: 13
              }}>Nome do Cliente</th>
                <th className="px-4 py-2 text-left" style={{
                fontSize: 13
              }}>Pickup</th>
                <th className="px-4 py-2 text-left" style={{
                fontSize: 13
              }}>Retorno</th>
                <th className="px-4 py-2 text-left" style={{
                fontSize: 13
              }}>Veículo</th>
                <th className="px-2 py-2"></th>
                <th className="px-2 py-2"></th>
                <th className="px-2 py-2"></th> {/* Nova coluna para botão Kommo */}
              </tr>
            </thead>
            <tbody>
              {reservations.length === 0 && !loading
                ? <tr>
                  <td colSpan={8} className="px-4 py-3 text-center text-muted-foreground">
                    Nenhum resultado.
                  </td>
                </tr>
                : reservations.map((r, idx) => {
                  const pickup = formatDateTime(r.pickup_date);
                  const ret = formatDateTime(r.return_date);
                  const cleanedPhone = (r.phone_number || "-").replace(/\D/g, "");

                  // Pegue o KommoLeadId associado a esta reserva
                  const kommoLeadId = rowKommoLeadIds[r.reservation_id];

                  return (
                    <tr key={r.reservation_id + idx} className="border-t align-top">
                      {/* Reservation ID + phone_number */}
                      <td className="px-4 py-2 align-middle" style={{
                        fontSize: 13,
                        fontWeight: 700
                      }}>
                        {r.reservation_id}
                        <div style={{
                          fontSize: 11,
                          color: "#757575",
                          fontWeight: 400,
                          marginTop: 2
                        }}>
                          {r.phone_number || "-"}
                        </div>
                      </td>
                      {/* Customer First Name + Last Name */}
                      <td className="px-4 py-2">
                        <span style={{
                          display: "block",
                          fontSize: 12,
                          fontWeight: 600
                        }}>
                          {r.customer_first_name}
                        </span>
                        <span style={{
                          display: "block",
                          fontSize: 10,
                          color: "#757575"
                        }}>
                          {r.customer_last_name}
                        </span>
                      </td>
                      {/* Pickup */}
                      <td className="px-4 py-2">
                        <span style={{
                          fontSize: 12,
                          display: "block"
                        }} className="font-normal text-xs">{pickup.date}</span>
                        <span style={{
                          fontSize: 12,
                          color: "#666"
                        }} className="font-extralight text-xs px-[17px] text-center">{pickup.time}</span>
                      </td>
                      {/* Return */}
                      <td className="px-4 py-2">
                        <span style={{
                          fontSize: 12,
                          display: "block"
                        }} className="text-xs">{ret.date}</span>
                        <span style={{
                          fontSize: 12,
                          color: "#666"
                        }} className="px-[20px] text-xs font-thin">{ret.time}</span>
                      </td>
                      {/* Veículo - plate */}
                      <td className="px-4 py-2 align-middle" style={{
                        fontSize: 13
                      }}>
                        {r.plate || "-"}
                      </td>
                      {/* Botão para abrir reserva */}
                      <td className="px-2 py-2 align-middle">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => window.open(`https://r3-rental.us5.hqrentals.app/car-rental/reservations/step3?id=${encodeURIComponent(r.reservation_id)}`, '_blank')}
                          title="Abrir reserva do cliente"
                          aria-label="Abrir reserva do cliente"
                          tabIndex={0}
                          className="h-8 w-8"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </td>
                      {/* Botão WhatsApp (só aparece se tiver número limpo) */}
                      <td className="px-2 py-2 align-middle">
                        {cleanedPhone && cleanedPhone !== "-" ?
                          <Button
                            asChild
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-green-600"
                            title="Enviar mensagem no WhatsApp"
                            aria-label="Enviar mensagem no WhatsApp"
                            tabIndex={0}
                          >
                            <a
                              href={`http://wa.me/${cleanedPhone}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Phone className="w-4 h-4" />
                            </a>
                          </Button>
                          : null}
                      </td>
                      {/* Botão Kommo (abre Kommo CRM com id "f855" do JSON) */}
                      <td className="px-2 py-2 align-middle">
                        {kommoLeadId ? (
                          <Button
                            asChild
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-blue-600 hover:text-blue-800"
                            title="Ver lead no Kommo"
                            aria-label="Ver lead no Kommo"
                            tabIndex={0}
                          >
                            <a
                              href={`https://r3rentalcar.kommo.com/leads/detail/${encodeURIComponent(kommoLeadId)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          </Button>
                        ) : (
                          <Button
                            size="icon"
                            variant="ghost"
                            disabled
                            className="h-8 w-8 text-gray-300"
                            title="Lead Kommo não encontrado"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        )}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    </div>;
};
export default ConsultaReservas;
