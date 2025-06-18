
export interface ParsedReservationData {
  realFirstName: string;
  realLastName: string;
  pickupLocation: string;
  returnLocation: string;
  carSeat: boolean;
  stroller: boolean;
  confirmationNumber: string;
  duration: string;
  observations: string;
  vehicleType: string;
  groupInfo: string;
  passengers: string;
  signStatus: string;
  rawMetadata: string;
}

export const parseReservationMetadata = (customer: any): ParsedReservationData => {
  const firstName = customer?.first_name || '';
  const lastName = customer?.last_name || '';
  
  // Verificar se o last_name contém metadados (indicado pela presença de " - In ")
  const hasMetadata = lastName.includes(' - In ');
  
  if (!hasMetadata) {
    // Formato normal - usar dados como estão
    return {
      realFirstName: firstName,
      realLastName: lastName,
      pickupLocation: '',
      returnLocation: '',
      carSeat: false,
      stroller: false,
      confirmationNumber: '',
      duration: '',
      observations: '',
      vehicleType: '',
      groupInfo: '',
      passengers: '',
      signStatus: '',
      rawMetadata: lastName
    };
  }
  
  // Extrair informações dos metadados no last_name
  const metadata = lastName;
  
  // Extrair localização de pickup
  const pickupMatch = metadata.match(/- In\s+(\w+)/i);
  const pickupLocation = pickupMatch ? pickupMatch[1] : '';
  
  // Extrair localização de retorno
  const returnMatch = metadata.match(/- Out\s+(\w+)/i);
  const returnLocation = returnMatch ? returnMatch[1] : '';
  
  // Extrair car seat
  const carSeatMatch = metadata.match(/- (.*?Car Seat.*?) -/i);
  const carSeat = carSeatMatch ? !carSeatMatch[1].toLowerCase().includes('não') : false;
  
  // Extrair carrinho/stroller
  const strollerMatch = metadata.match(/- (.*?Carrinho.*?) -/i);
  const stroller = strollerMatch ? !strollerMatch[1].toLowerCase().includes('não') : false;
  
  // Extrair número de confirmação
  const confirmationMatch = metadata.match(/#(\d+)/);
  const confirmationNumber = confirmationMatch ? confirmationMatch[1] : '';
  
  // Extrair duração
  const durationMatch = metadata.match(/(\d+)\s+Dias/i);
  const duration = durationMatch ? `${durationMatch[1]} dias` : '';
  
  // Extrair observações
  const obsMatch = metadata.match(/- Obs:\s*(.*?)\s*-/i);
  const observations = obsMatch ? obsMatch[1].trim() : '';
  
  // Extrair tipo de veículo
  const vehicleMatch = metadata.match(/- (SUV|Sedan|7_Passenger_Minivan|8_Passenger_Minivan|.*?) -/);
  const vehicleType = vehicleMatch ? vehicleMatch[1].replace(/_/g, ' ') : '';
  
  // Extrair informações de grupo
  const groupMatch = metadata.match(/- (.*grupo.*?) -/i);
  const groupInfo = groupMatch ? groupMatch[1] : '';
  
  // Extrair informações de passageiros
  const passengersMatch = metadata.match(/- (\d+\s*adult.*?) -/i);
  const passengers = passengersMatch ? passengersMatch[1] : '';
  
  // Extrair status de assinatura
  const signMatch = metadata.match(/- Sign (.*?)$/i);
  const signStatus = signMatch ? signMatch[1].trim() : '';
  
  return {
    realFirstName: firstName,
    realLastName: '', // O last_name real não está disponível nos metadados
    pickupLocation,
    returnLocation,
    carSeat,
    stroller,
    confirmationNumber,
    duration,
    observations,
    vehicleType,
    groupInfo,
    passengers,
    signStatus,
    rawMetadata: metadata
  };
};

export const getLocationFromString = (location: string): "Mco" | "Fort" | "Mia" | "Tampa" | null => {
  const loc = location.toLowerCase();
  if (loc.includes('mco')) return 'Mco';
  if (loc.includes('fort')) return 'Fort';
  if (loc.includes('mia')) return 'Mia';
  if (loc.includes('tampa')) return 'Tampa';
  return null;
};
