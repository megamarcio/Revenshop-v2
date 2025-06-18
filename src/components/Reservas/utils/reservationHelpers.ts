
export const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'confirmed':
    case 'confirmada':
      return 'bg-green-100 text-green-800';
    case 'pending':
    case 'pendente':
      return 'bg-yellow-100 text-yellow-800';
    case 'cancelled':
    case 'cancelada':
      return 'bg-red-100 text-red-800';
    case 'open':
      return 'bg-blue-100 text-blue-800';
    case 'completed':
      return 'bg-green-100 text-green-800';
    case 'rental':
      return 'bg-purple-100 text-purple-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const getTemperatureIndicator = (temperature: string) => {
  switch (temperature.toLowerCase()) {
    case 'sol':
      return { emoji: '☀️', color: 'bg-yellow-100 text-yellow-800', bgColor: '#FEF3C7' };
    case 'quente':
      return { emoji: '🔥', color: 'bg-red-100 text-red-800', bgColor: '#FEE2E2' };
    case 'morno':
      return { emoji: '🌡️', color: 'bg-orange-100 text-orange-800', bgColor: '#FED7AA' };
    case 'frio':
      return { emoji: '❄️', color: 'bg-blue-100 text-blue-800', bgColor: '#DBEAFE' };
    case 'congelado':
      return { emoji: '🧊', color: 'bg-indigo-100 text-indigo-800', bgColor: '#E0E7FF' };
    default:
      return { emoji: '⚪', color: 'bg-gray-100 text-gray-800', bgColor: '#F3F4F6' };
  }
};

export const extractFirstLocationName = (locationLabel: string): string => {
  if (!locationLabel) return '';
  return locationLabel.split(' ')[0];
};

export const getChildEquipmentInfo = (lastName: string) => {
  const lastNameLower = lastName.toLowerCase();
  const equipments = [];
  
  // Check for Car Seat Badge
  const hasCarSeatNegative = lastNameLower.includes('no car seat') || 
                            lastNameLower.includes('nao preciso car seat');
  
  if (!hasCarSeatNegative) {
    const hasCarSeatPattern = lastNameLower.includes('1x car seat') ||
                             lastNameLower.includes('2x car seat') ||
                             lastNameLower.includes('1x cadeirinha') ||
                             lastNameLower.includes('2x cadeirinhas');
    
    if (hasCarSeatPattern) {
      let carSeatType = 'Car Seat';
      if (lastNameLower.includes('car seat a') || lastNameLower.includes('cadeirinha a')) {
        carSeatType = 'Car Seat A';
      } else if (lastNameLower.includes('car seat b') || lastNameLower.includes('cadeirinha b')) {
        carSeatType = 'Car Seat B';
      }
      equipments.push({ type: carSeatType, color: 'bg-yellow-100 text-yellow-800' });
    }
  }
  
  // Check for Stroller Badge
  const hasStrollerNegative = lastNameLower.includes('no stroller') ||
                             lastNameLower.includes('nao preciso carrinho');
  
  if (!hasStrollerNegative) {
    const hasStrollerPattern = lastNameLower.includes('1x stroller') ||
                              lastNameLower.includes('2x stroller') ||
                              lastNameLower.includes('1x carrinho') ||
                              lastNameLower.includes('2x carrinhos');
    
    if (hasStrollerPattern) {
      equipments.push({ type: 'Stroller', color: 'bg-green-100 text-green-800' });
    }
  }
  
  // Check for Booster Badge
  if (lastNameLower.includes('booster')) {
    equipments.push({ type: 'Booster', color: 'bg-purple-100 text-purple-800' });
  }
  
  return equipments;
};
