export interface Reservation {
  id: string;
  customer: {
    label: string;
    phone_number: string;
    first_name: string;
    last_name: string;
  };
  pick_up_date: string;
  return_date: string;
  reservation_vehicle_information: {
    plate: string;
  };
  vehicle_name: string;
  status: string; // Adicionado campo status
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
