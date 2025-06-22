export const getTodayDateString = (): string => {
  return new Date().toISOString().split('T')[0];
};

// Função para ajustar horário para fuso horário da Flórida (+4h)
export const adjustTimeForFlorida = (timeString: string): string => {
  if (!timeString) return timeString;
  
  // Extrai horas e minutos do formato "HH:MM" ou "HH:MM:SS"
  const timeParts = timeString.split(':');
  if (timeParts.length < 2) return timeString;
  
  let hours = parseInt(timeParts[0], 10);
  const minutes = timeParts[1];
  const seconds = timeParts[2] || '00';
  
  // Adiciona 4 horas para ajustar ao fuso horário da Flórida
  hours += 4;
  
  // Ajusta para formato 24h
  if (hours >= 24) {
    hours -= 24;
  }
  
  // Formata com zero à esquerda se necessário
  const formattedHours = hours.toString().padStart(2, '0');
  
  return `${formattedHours}:${minutes}:${seconds}`;
};

// Função para formatar data e hora com ajuste de fuso horário
export const formatDateTimeForFlorida = (dateTimeString: string): string => {
  if (!dateTimeString) return '';
  
  try {
    const date = new Date(dateTimeString);
    
    // Adiciona 4 horas para ajustar ao fuso horário da Flórida
    date.setHours(date.getHours() + 4);
    
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  } catch (error) {
    console.error('Erro ao formatar data/hora:', error);
    return dateTimeString;
  }
};

// Função para converter UTC para horário da Flórida - corrigida
export const convertUTCToFloridaTime = (utcDateTime: string): string => {
  if (!utcDateTime) return 'N/A';
  
  try {
    console.log('Converting date:', utcDateTime);
    
    // Tenta criar a data diretamente primeiro
    let date = new Date(utcDateTime);
    
    // Se a data for inválida, tenta diferentes abordagens
    if (isNaN(date.getTime())) {
      // Se não tem 'Z' no final e parece ser UTC, adiciona
      if (!utcDateTime.includes('Z') && !utcDateTime.includes('+') && !utcDateTime.includes('-')) {
        date = new Date(utcDateTime + 'Z');
      }
      
      // Se ainda for inválida, tenta parse manual
      if (isNaN(date.getTime())) {
        console.error('Failed to parse date:', utcDateTime);
        return 'Data Inválida';
      }
    }
    
    // Adiciona 4 horas para ajustar ao fuso horário da Flórida (EDT)
    const floridaDate = new Date(date.getTime() + (4 * 60 * 60 * 1000));
    
    console.log('Original date:', date, 'Florida date:', floridaDate);
    
    return floridaDate.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  } catch (error) {
    console.error('Erro ao converter UTC para horário da Flórida:', error, 'Input:', utcDateTime);
    return 'Erro na Data';
  }
};

interface ApiReservationItem {
  id?: string;
  reservation_id?: string;
  custom_reservation_number?: string;
  prefixed_id?: string;
  customer?: {
    label?: string;
    first_name?: string;
    last_name?: string;
    phone_number?: string;
  };
  pick_up_date?: string;
  pickup_date?: string;
  pick_up_datetime?: string;
  return_date?: string;
  return_datetime?: string;
  reservation_vehicle_information?: {
    plate?: string;
  };
  plate?: string;
  vehicle?: {
    plate?: string;
    label?: string;
    name?: string;
  };
  active_vehicle_information?: {
    vehicle?: {
      label?: string;
    };
  };
  status?: string;
}

// Função para processar lista de reservas da API
export const parseReservationList = (apiData: unknown): unknown[] => {
  if (!apiData) return [];
  
  const list = Array.isArray(apiData) ? apiData : (apiData as { data?: unknown[] })?.data || [];
  
  return list.map((item: unknown) => {
    console.log('Processing reservation item:', item);
    
    const reservationItem = item as ApiReservationItem;
    
    return {
      // Primary fields from the specification
      id: reservationItem.id || reservationItem.reservation_id || reservationItem.custom_reservation_number || reservationItem.prefixed_id || "-",
      customer: {
        label: reservationItem.customer?.label || `${reservationItem.customer?.first_name || ''} ${reservationItem.customer?.last_name || ''}`.trim() || 'N/A',
        phone_number: reservationItem.customer?.phone_number || 'N/A'
      },
      pick_up_date: reservationItem.pick_up_date || reservationItem.pickup_date || reservationItem.pick_up_datetime || '',
      return_date: reservationItem.return_date || reservationItem.return_datetime || '',
      reservation_vehicle_information: {
        plate: reservationItem.reservation_vehicle_information?.plate || reservationItem.plate || reservationItem.vehicle?.plate || 'N/A'
      },
      vehicle_name: reservationItem.active_vehicle_information?.vehicle?.label || reservationItem.vehicle?.label || reservationItem.vehicle?.name || 'N/A',
      status: reservationItem.status || 'Open'
    };
  });
};

interface ReservationWithDates {
  pick_up_date?: string;
  return_date?: string;
}

// Função para ordenar reservas
export const getOrderedReservations = (reservations: unknown[], badgeType: "pickup" | "return"): unknown[] => {
  if (!reservations || reservations.length === 0) return [];
  
  return [...reservations].sort((a, b) => {
    const reservationA = a as ReservationWithDates;
    const reservationB = b as ReservationWithDates;
    const dateA = badgeType === "pickup" ? reservationA.pick_up_date : reservationA.return_date;
    const dateB = badgeType === "pickup" ? reservationB.pick_up_date : reservationB.return_date;
    
    if (!dateA && !dateB) return 0;
    if (!dateA) return 1;
    if (!dateB) return -1;
    
    return new Date(dateA).getTime() - new Date(dateB).getTime();
  });
};
