import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { Download, ExternalLink, Phone, Share2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { LocationBadge } from "./LocationBadge";
import ReservationWhatsAppModal from "./ReservationWhatsAppModal";

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

// Nova função para formatar datas para "DD/MM" e hora para "HH:MM AM/PM"
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
    
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours || 12; // A hora 0 (meia-noite) deve ser 12
    
    return {
      date: `${day}/${month}`,
      time: `${hours}:${minutes} ${ampm}` // e.g., 9:05 AM or 12:30 PM
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

// Atualizado: agora retorna Mco (não MCO)
function getLocationBadge(lastName: string, type: "pickup" | "return"): string | null {
  if (!lastName) return null;
  const lower = lastName.toLowerCase().replace(/\s+/g, " ");
  if (type === "pickup") {
    if (lower.includes("in mco")) return "Mco";
    if (lower.includes("in fort")) return "Fort";
    if (lower.includes("in mia")) return "Mia";
    if (lower.includes("in tampa")) return "Tampa";
  } else if (type === "return") {
    if (lower.includes("out mco")) return "Mco";
    if (lower.includes("out fort")) return "Fort";
    if (lower.includes("out mia")) return "Mia";
    if (lower.includes("out tampa")) return "Tampa";
  }
  return null;
}

// Interface para os tipos de badge
interface ExtraBadge {
  text: string;
  type: 'item' | 'alert';
}

// Helper atualizado para badges de itens extras
function getExtraItemBadges(lastName: string): ExtraBadge[] {
  if (!lastName) return [];
  const lower = lastName.toLowerCase();
  const badges: ExtraBadge[] = [];

  // Exclusões primeiro
  const excludesStroller = lower.includes("não preciso carrinho") || lower.includes("no stroller");
  const excludesCarSeat = lower.includes("não preciso car seat") || lower.includes("no car seat");

  // Inclusões
  const includesStroller = lower.includes("carrinho") || lower.includes("stroller");
  const includesCarSeat = lower.includes("cadeirinha") || lower.includes("car seat");

  if (includesStroller && !excludesStroller) {
    badges.push({ text: "Carrinho", type: 'item' });
  }
  if (includesCarSeat && !excludesCarSeat) {
    badges.push({ text: "Cadeirinha", type: 'item' });
  }

  // Novo badge "Sign"
  if (lower.includes("sign não")) {
    badges.push({ text: "Sign", type: 'alert' });
  }

  return badges;
}

// Helper para ordenar reservas pelo campo correto
function getOrderedReservations(
  reservations: Reservation[],
  type: "pickup" | "return"
): Reservation[] {
  const key = type === "pickup" ? "pickup_date" : "return_date";
  return [...reservations].sort((a: Reservation, b: Reservation) => {
    // Prioriza datas válidas
    if (!a[key] && !b[key]) return 0;
    if (!a[key]) return 1;
    if (!b[key]) return -1;
    // Faz comparação de datas
    const dateA = new Date(a[key]).getTime();
    const dateB = new Date(b[key]).getTime();
    return dateA - dateB;
  });
}

const ConsultaReservas: React.FC = () => {
  // --------- FILTROS PICKUP DATE ---------
  const [dataInicioPickup, setDataInicioPickup] = useState(getTodayDateString());
  const [dataFimPickup, setDataFimPickup] = useState(getTodayDateString());
  const [loadingPickup, setLoadingPickup] = useState(false);
  const [reservationsPickup, setReservationsPickup] = useState<Reservation[]>([]);
  const [errorPickup, setErrorPickup] = useState<string | null>(null);
  const [rawApiDataPickup, setRawApiDataPickup] = useState<any | null>(null);
  const [lastRequestLogPickup, setLastRequestLogPickup] = useState<any | null>(null);
  const [rowKommoLeadIdsPickup, setRowKommoLeadIdsPickup] = useState<{ [reservationId: string]: string }>({});

  // --------- FILTROS RETURN DATE ---------
  const [dataInicioReturn, setDataInicioReturn] = useState(getTodayDateString());
  const [dataFimReturn, setDataFimReturn] = useState(getTodayDateString());
  const [loadingReturn, setLoadingReturn] = useState(false);
  const [reservationsReturn, setReservationsReturn] = useState<Reservation[]>([]);
  const [errorReturn, setErrorReturn] = useState<string | null>(null);
  const [rawApiDataReturn, setRawApiDataReturn] = useState<any | null>(null);
  const [lastRequestLogReturn, setLastRequestLogReturn] = useState<any | null>(null);
  const [rowKommoLeadIdsReturn, setRowKommoLeadIdsReturn] = useState<{ [reservationId: string]: string }>({});

  // --------- BUSCA GENERICA (usada por ambos) ---------
  const fetchReservas = async ({
    dataIni,
    dataFim,
    columnType,
    setLoading,
    setReservations,
    setError,
    setRawApiData,
    setLastRequestLog,
    setRowKommoLeadIds,
  }: {
    dataIni: string;
    dataFim: string;
    columnType: "pick_up_date" | "return_date";
    setLoading: (b: boolean) => void;
    setReservations: (r: Reservation[]) => void;
    setError: (e: string | null) => void;
    setRawApiData: (d: any) => void;
    setLastRequestLog: (d: any) => void;
    setRowKommoLeadIds: (m: { [reservationId: string]: string }) => void;
  }) => {
    setLoading(true);
    setReservations([]);
    setError(null);
    setRawApiData(null);
    setLastRequestLog(null);

    const inicio = dataIni && /^\d{4}-\d{2}-\d{2}$/.test(dataIni) ? `${dataIni}T00:00:00` : "";
    const fim = dataFim && /^\d{4}-\d{2}-\d{2}$/.test(dataFim) ? `${dataFim}T00:00:00` : "";

    if (!inicio || !fim) {
      setError("Preencha as datas inicial e final completas.");
      setLoading(false);
      return;
    }
    const filtros = [
      {
        type: "date",
        column: columnType,
        operator: "between",
        value: `${inicio.slice(0,10)},${fim.slice(0,10)}`
      },
      {
        type: "string",
        column: "status",
        operator: "equals",
        value: "open"
      }
    ];
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
      const res = await fetch(url, { method: "GET", headers });
      if (!res.ok) {
        setError("Erro ao buscar reservas.");
        responseLog.error = `HTTP ${res.status} - ${res.statusText || "Unknown error"}`;
        setLastRequestLog(responseLog);
        setLoading(false);
        return;
      }
      const data = await res.json();
      setRawApiData(data);
      responseLog.response_json = data;
      setLastRequestLog(responseLog);

      const onlyRelevant = parseReservationList(data);
      setReservations(onlyRelevant);

      // CAPTURA O "f855" PARA CADA RESERVA
      const list = Array.isArray(data) ? data : data?.data || [];
      const kommoMap: { [reservationId: string]: string } = {};
      list.forEach((item: any) => {
        const reservationId =
          item.reservation_id ||
          item.custom_reservation_number ||
          item.prefixed_id ||
          (item.id ? String(item.id) : "-");
        let kommoId: string | undefined = undefined;
        if (
          item.customer &&
          typeof item.customer === "object" &&
          typeof item.customer.f855 === "string" &&
          !!item.customer.f855
        ) {
          kommoId = item.customer.f855;
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

  // DISPARADORES DOS DOIS TIPOS DE BUSCA
  const onBuscarPickup = () =>
    fetchReservas({
      dataIni: dataInicioPickup,
      dataFim: dataFimPickup,
      columnType: "pick_up_date",
      setLoading: setLoadingPickup,
      setReservations: setReservationsPickup,
      setError: setErrorPickup,
      setRawApiData: setRawApiDataPickup,
      setLastRequestLog: setLastRequestLogPickup,
      setRowKommoLeadIds: setRowKommoLeadIdsPickup,
    });

  const onBuscarReturn = () =>
    fetchReservas({
      dataIni: dataInicioReturn,
      dataFim: dataFimReturn,
      columnType: "return_date",
      setLoading: setLoadingReturn,
      setReservations: setReservationsReturn,
      setError: setErrorReturn,
      setRawApiData: setRawApiDataReturn,
      setLastRequestLog: setLastRequestLogReturn,
      setRowKommoLeadIds: setRowKommoLeadIdsReturn,
    });

  // Helper para renderizar busca/tabela
  const renderSection = ({
    header,
    dataInicio,
    setDataInicio,
    dataFim,
    setDataFim,
    onBuscar,
    loading,
    lastRequestLog,
    handleDownloadRequestLog,
    error,
    rawApiData,
    reservations,
    rowKommoLeadIds,
  }: {
    header: string;
    dataInicio: string;
    setDataInicio: (val: string) => void;
    dataFim: string;
    setDataFim: (val: string) => void;
    onBuscar: () => void;
    loading: boolean;
    lastRequestLog: any;
    handleDownloadRequestLog: () => void;
    error: string | null;
    rawApiData: any;
    reservations: Reservation[];
    rowKommoLeadIds: { [r: string]: string };
  }) => {
    // Detecta tipo para badge: pickup ou return
    const badgeType: "pickup" | "return" =
      header.toLowerCase().includes("pickup") ? "pickup" : "return";

    // Função para cor do badge baseado no texto
    const badgeColorClass = (badgeText: string | null) => {
      if (!badgeText) return "";
      switch (badgeText) {
        case "Mco":
          return "bg-[#2563eb] text-white border-[#2563eb]";
        case "Fort":
          return "bg-[#a21caf] text-white border-[#a21caf]";
        case "Mia":
          return "bg-[#16a34a] text-white border-[#16a34a]";
        case "Tampa":
          return "bg-[#eab308] text-[#78350f] border-[#eab308]";
        default:
          return "";
      }
    };

    // Aqui, ordena os resultados conforme solicitado:
    const orderedReservations = getOrderedReservations(reservations, badgeType);

    return (
      <div className="border-[2px] border-muted mb-8 rounded-lg p-5 shadow-sm bg-background">
        <h2 className="text-xl font-bold mb-3">{header}</h2>
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div>
            <label htmlFor="dataInicio" className="block text-sm font-medium mb-1">
              Data Inicial
            </label>
            <Input type="date" id="dataInicio" value={dataInicio} onChange={e => setDataInicio(e.target.value)} className="w-[210px]" required />
          </div>
          <div>
            <label htmlFor="dataFim" className="block text-sm font-medium mb-1">
              Data Final
            </label>
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

        {rawApiData && (
          <div className="mb-4">
            <Button
              variant="secondary"
              onClick={() => {
                const jsonStr = JSON.stringify(rawApiData, null, 2);
                const blob = new Blob([jsonStr], { type: "application/json" });
                const link = document.createElement("a");
                link.href = URL.createObjectURL(blob);
                link.download = "reservas.json";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(link.href);
              }}
            >
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
                  <th className="px-4 py-2 text-left" style={{ fontSize: 13, fontWeight: 600 }}>Reserva&nbsp;</th>
                  <th className="px-4 py-2 text-left" style={{ fontSize: 13 }}>Nome do Cliente</th>
                  <th className="px-4 py-2 text-left" style={{ fontSize: 13 }}>Pickup</th>
                  <th className="px-4 py-2 text-left" style={{ fontSize: 13 }}>Retorno</th>
                  <th className="px-4 py-2 text-left" style={{ fontSize: 13 }}>Veículo</th>
                  <th className="px-2 py-2"></th>
                  <th className="px-2 py-2"></th>
                  <th className="px-2 py-2"></th>
                  <th className="px-2 py-2"></th>
                </tr>
              </thead>
              <tbody>
                {orderedReservations.length === 0 && !loading
                  ? <tr>
                      <td colSpan={9} className="px-4 py-3 text-center text-muted-foreground">
                        Nenhum resultado.
                      </td>
                    </tr>
                  : orderedReservations.map((r, idx) => {
                      const pickup = formatDateTime(r.pickup_date);
                      const ret = formatDateTime(r.return_date);
                      const cleanedPhone = (r.phone_number || "-").replace(/\D/g, "");
                      const kommoLeadId = rowKommoLeadIds[r.reservation_id];
                      const badgeText = getLocationBadge(r.customer_last_name, badgeType) as "Mco" | "Fort" | "Mia" | "Tampa" | null;
                      const extraItemBadges = getExtraItemBadges(r.customer_last_name);
                      return (
                        <tr key={r.reservation_id + idx} className="border-t align-top">
                          {/* Reservation ID + phone_number */}
                          <td className="px-4 py-2 align-middle" style={{ fontSize: 13, fontWeight: 700 }}>
                            {r.reservation_id}
                            <div style={{ fontSize: 11, color: "#757575", fontWeight: 400, marginTop: 2 }}>{r.phone_number || "-"}</div>
                          </td>
                          {/* Customer First Name + Last Name + BADGE */}
                          <td className="px-4 py-2">
                            <div style={{ display: "flex", alignItems: "center", gap: 4, flexWrap: "wrap" }}>
                              <span style={{ display: "block", fontSize: 12, fontWeight: 600 }}>{r.customer_first_name}</span>
                              <LocationBadge location={badgeText} />
                              {extraItemBadges.map((badge) => (
                                <Badge
                                  key={badge.text}
                                  variant="secondary"
                                  className={`
                                    ${badge.text === 'Carrinho'
                                      ? 'bg-lime-400 text-black border-lime-400'
                                      : badge.text === 'Cadeirinha'
                                      ? 'bg-purple-600 text-white border-purple-600'
                                      : badge.type === 'alert'
                                      ? 'bg-red-500 text-white border-red-500'
                                      : 'bg-[#2563eb] text-white border-[#2563eb]'
                                    }
                                    font-bold h-auto py-0 px-2
                                  `}
                                  style={{ fontSize: '7px' }}
                                >
                                  {badge.text}
                                </Badge>
                              ))}
                            </div>
                            <span style={{ display: "block", fontSize: 10, color: "#757575" }}>{r.customer_last_name}</span>
                          </td>
                          {/* Pickup */}
                          <td className="px-4 py-2">
                            <span style={{ fontSize: 12, display: "block" }} className="font-normal text-xs">{pickup.date}</span>
                            <span style={{ fontSize: 12, color: "#666" }} className="font-extralight text-xs px-[17px] text-center">{pickup.time}</span>
                          </td>
                          {/* Return */}
                          <td className="px-4 py-2">
                            <span style={{ fontSize: 12, display: "block" }} className="text-xs">{ret.date}</span>
                            <span style={{ fontSize: 12, color: "#666" }} className="px-[20px] text-xs font-thin">{ret.time}</span>
                          </td>
                          {/* Veículo - plate */}
                          <td className="px-4 py-2 align-middle" style={{ fontSize: 13 }}>{r.plate || "-"}</td>
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
                          {/* Botão de compartilhar */}
                          <td className="px-2 py-2 align-middle">
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => handleOpenShareModal(r)}
                              title="Compartilhar reserva no WhatsApp"
                              aria-label="Compartilhar reserva no WhatsApp"
                              tabIndex={0}
                              className="h-8 w-8"
                            >
                              <Share2 className="w-4 h-4 text-gray-600" />
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // --------- STATE PARA MODAL DE COMPARTILHAMENTO ---------
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [selectedReservationForShare, setSelectedReservationForShare] = useState<Reservation | null>(null);

  const handleOpenShareModal = (reservation: Reservation) => {
    setSelectedReservationForShare(reservation);
    setIsShareModalOpen(true);
  };

  const handleCloseShareModal = () => {
    setIsShareModalOpen(false);
    setSelectedReservationForShare(null);
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* Seção Pickup Date */}
      {renderSection({
        header: "Consulta por Pickup Date",
        dataInicio: dataInicioPickup,
        setDataInicio: setDataInicioPickup,
        dataFim: dataFimPickup,
        setDataFim: setDataFimPickup,
        onBuscar: onBuscarPickup,
        loading: loadingPickup,
        lastRequestLog: lastRequestLogPickup,
        handleDownloadRequestLog: () => {
          if (!lastRequestLogPickup) return;
          const jsonStr = JSON.stringify(lastRequestLogPickup, null, 2);
          const blob = new Blob([jsonStr], { type: "application/json" });
          const link = document.createElement("a");
          link.href = URL.createObjectURL(blob);
          link.download = "log_requisicao_consulta_reservas_pickup.json";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(link.href);
        },
        error: errorPickup,
        rawApiData: rawApiDataPickup,
        reservations: reservationsPickup,
        rowKommoLeadIds: rowKommoLeadIdsPickup,
      })}

      {/* Seção Return Date */}
      {renderSection({
        header: "Consulta por Return Date",
        dataInicio: dataInicioReturn,
        setDataInicio: setDataInicioReturn,
        dataFim: dataFimReturn,
        setDataFim: setDataFimReturn,
        onBuscar: onBuscarReturn,
        loading: loadingReturn,
        lastRequestLog: lastRequestLogReturn,
        handleDownloadRequestLog: () => {
          if (!lastRequestLogReturn) return;
          const jsonStr = JSON.stringify(lastRequestLogReturn, null, 2);
          const blob = new Blob([jsonStr], { type: "application/json" });
          const link = document.createElement("a");
          link.href = URL.createObjectURL(blob);
          link.download = "log_requisicao_consulta_reservas_return.json";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(link.href);
        },
        error: errorReturn,
        rawApiData: rawApiDataReturn,
        reservations: reservationsReturn,
        rowKommoLeadIds: rowKommoLeadIdsReturn,
      })}

      {/* Modal de compartilhamento */}
      <ReservationWhatsAppModal
        isOpen={isShareModalOpen}
        onClose={handleCloseShareModal}
        reservationData={selectedReservationForShare}
      />
    </div>
  );
};
export default ConsultaReservas;
