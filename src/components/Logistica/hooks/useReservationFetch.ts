
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { Reservation, ReservationFetchParams } from "../types/reservationTypes";
import { parseReservationList, getTodayDateString } from "../utils/reservationUtils";

export const useReservationFetch = () => {
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
  }: ReservationFetchParams) => {
    console.log('fetchReservas iniciado:', { dataIni, dataFim, columnType });
    
    setLoading(true);
    setReservations([]);
    setError(null);
    setRawApiData(null);
    setLastRequestLog(null);

    const inicio = dataIni && /^\d{4}-\d{2}-\d{2}$/.test(dataIni) ? `${dataIni}T00:00:00` : "";
    const fim = dataFim && /^\d{4}-\d{2}-\d{2}$/.test(dataFim) ? `${dataFim}T00:00:00` : "";

    if (!inicio || !fim) {
      console.error('Datas inválidas:', { inicio, fim });
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
      console.log('Fazendo requisição para:', url);
      const res = await fetch(url, { method: "GET", headers });
      
      if (!res.ok) {
        const errorMessage = `HTTP ${res.status} - ${res.statusText || "Unknown error"}`;
        console.error('Erro na requisição:', errorMessage);
        setError("Erro ao buscar reservas. Verifique sua conexão.");
        responseLog.error = errorMessage;
        setLastRequestLog(responseLog);
        setLoading(false);
        return;
      }

      const data = await res.json();
      console.log('Dados recebidos:', data);
      
      setRawApiData(data);
      responseLog.response_json = data;
      setLastRequestLog(responseLog);

      const onlyRelevant = parseReservationList(data);
      console.log('Reservas processadas:', onlyRelevant);
      setReservations(onlyRelevant);

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
          description: "Nenhuma reserva encontrada para o filtro aplicado."
        });
      } else {
        toast({
          title: "Busca concluída",
          description: `${onlyRelevant.length} reserva(s) encontrada(s).`
        });
      }
    } catch (e: any) {
      const errorMessage = `Erro de conexão: ${e?.message || e}`;
      console.error('Erro na busca:', errorMessage);
      setError("Erro de conexão. Verifique sua internet e tente novamente.");
      responseLog.error = errorMessage;
      setLastRequestLog(responseLog);
    } finally {
      console.log('fetchReservas finalizado');
      setLoading(false);
    }
  };

  return { fetchReservas };
};
