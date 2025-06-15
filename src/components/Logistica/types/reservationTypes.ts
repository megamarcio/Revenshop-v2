
export interface Reservation {
  reservation_id: string;
  customer_first_name: string;
  customer_last_name: string;
  pickup_date: string;
  return_date: string;
  plate: string;
  phone_number?: string;
}

export interface ExtraBadge {
  text: string;
  type: 'item' | 'alert';
}

export interface ReservationFetchParams {
  dataIni: string;
  dataFim: string;
  columnType: "pick_up_date" | "return_date";
  setLoading: (b: boolean) => void;
  setReservations: (r: Reservation[]) => void;
  setError: (e: string | null) => void;
  setRawApiData: (d: any) => void;
  setLastRequestLog: (d: any) => void;
  setRowKommoLeadIds: (m: { [reservationId: string]: string }) => void;
}
