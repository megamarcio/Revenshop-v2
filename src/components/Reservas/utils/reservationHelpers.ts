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

export const getLogisticaBadges = (lastName: string, customerLabel?: string) => {
  const lastNameLower = lastName.toLowerCase();
  const labelLower = customerLabel?.toLowerCase() || '';
  const badges = [];
  
  // Check for location badges
  if (lastNameLower.includes('in mco') || labelLower.includes('in mco')) {
    badges.push({ text: 'Mco', color: 'bg-yellow-400 text-yellow-900' });
  }
  if (lastNameLower.includes('in mia') || labelLower.includes('in mia')) {
    badges.push({ text: 'Mia', color: 'bg-red-400 text-red-900' });
  }
  if (lastNameLower.includes('in tampa') || labelLower.includes('in tampa')) {
    badges.push({ text: 'Tampa', color: 'bg-blue-400 text-blue-900' });
  }
  if (lastNameLower.includes('in fort') || labelLower.includes('in fort')) {
    badges.push({ text: 'Fort', color: 'bg-purple-400 text-purple-900' });
  }
  
  // Check for equipment badges
  if (lastNameLower.includes('booster') || labelLower.includes('booster')) {
    badges.push({ text: 'Booster', color: 'bg-green-400 text-green-900' });
  }
  if (lastNameLower.includes('2x car seat a') || labelLower.includes('2x car seat a')) {
    badges.push({ text: '2x Car Seat A', color: 'bg-green-400 text-green-900' });
  }
  if (lastNameLower.includes('1x car seat a') || labelLower.includes('1x car seat a')) {
    badges.push({ text: '1x Car Seat A', color: 'bg-pink-400 text-pink-900' });
  }
  if ((lastNameLower.includes('1x car seat') && !lastNameLower.includes('car seat a') && !lastNameLower.includes('car seat b')) || 
      (labelLower.includes('1x car seat') && !labelLower.includes('car seat a') && !labelLower.includes('car seat b'))) {
    badges.push({ text: '1x Car Seat', color: 'bg-pink-400 text-pink-900' });
  }
  if ((lastNameLower.includes('2x car seat') && !lastNameLower.includes('car seat a') && !lastNameLower.includes('car seat b')) || 
      (labelLower.includes('2x car seat') && !labelLower.includes('car seat a') && !labelLower.includes('car seat b'))) {
    badges.push({ text: '2x Car Seat', color: 'bg-pink-400 text-pink-900' });
  }
  if (lastNameLower.includes('1x car seat b') || labelLower.includes('1x car seat b')) {
    badges.push({ text: '1x Car Seat B', color: 'bg-blue-400 text-blue-900' });
  }
  if (lastNameLower.includes('2x car seat b') || labelLower.includes('2x car seat b')) {
    badges.push({ text: '2x Car Seat B', color: 'bg-blue-400 text-blue-900' });
  }
  if (lastNameLower.includes('1x stroller') || labelLower.includes('1x stroller')) {
    badges.push({ text: '1x Stroller', color: 'bg-red-500 text-red-900' });
  }
  if (lastNameLower.includes('2x stroller') || labelLower.includes('2x stroller')) {
    badges.push({ text: '2x Stroller', color: 'bg-green-500 text-green-900' });
  }
  if (lastNameLower.includes('1x carrinho') || labelLower.includes('1x carrinho')) {
    badges.push({ text: '1x Stroller', color: 'bg-red-500 text-red-900' });
  }
  if (lastNameLower.includes('2x carrinho') || labelLower.includes('2x carrinho')) {
    badges.push({ text: '2x Stroller', color: 'bg-pink-500 text-pink-900' });
  }
  
  return badges;
};
