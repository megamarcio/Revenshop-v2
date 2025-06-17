
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

// Função para converter UTC para horário da Flórida
export const convertUTCToFloridaTime = (utcDateTime: string): string => {
  if (!utcDateTime) return '';
  
  try {
    const utcDate = new Date(utcDateTime + 'Z'); // Garante que seja tratado como UTC
    
    // Adiciona 4 horas (EDT) ou 5 horas (EST) - usando 4h como padrão
    utcDate.setHours(utcDate.getHours() + 4);
    
    return utcDate.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  } catch (error) {
    console.error('Erro ao converter UTC para horário da Flórida:', error);
    return utcDateTime;
  }
};

// Função para processar lista de reservas da API
export const parseReservationList = (apiData: any): any[] => {
  if (!apiData) return [];
  
  const list = Array.isArray(apiData) ? apiData : apiData?.data || [];
  
  return list.map((item: any) => ({
    // Primary fields from the specification
    id: item.id || item.reservation_id || item.custom_reservation_number || item.prefixed_id || "-",
    customer: {
      label: item.customer?.label || `${item.customer?.first_name || ''} ${item.customer?.last_name || ''}`.trim() || 'N/A',
      phone_number: item.customer?.phone_number || 'N/A'
    },
    pick_up_date: item.pick_up_date || '',
    return_date: item.return_date || '',
    reservation_vehicle_information: {
      plate: item.reservation_vehicle_information?.plate || item.plate || 'N/A'
    }
  }));
};

// Função para ordenar reservas
export const getOrderedReservations = (reservations: any[], badgeType: "pickup" | "return"): any[] => {
  if (!reservations || reservations.length === 0) return [];
  
  return [...reservations].sort((a, b) => {
    const dateA = badgeType === "pickup" ? a.pick_up_date : a.return_date;
    const dateB = badgeType === "pickup" ? b.pick_up_date : b.return_date;
    
    if (!dateA && !dateB) return 0;
    if (!dateA) return 1;
    if (!dateB) return -1;
    
    return new Date(dateA).getTime() - new Date(dateB).getTime();
  });
};
