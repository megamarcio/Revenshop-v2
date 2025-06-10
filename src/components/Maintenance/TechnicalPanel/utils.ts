import { TechnicalItem } from '../../../hooks/useTechnicalItems';

export const categorizeItems = (items: TechnicalItem[]) => {
  const mainItems = items.filter(item => 
    ['oil', 'electrical', 'brakes'].includes(item.type)
  );
  
  const tireItems = items.filter(item => item.type === 'tires');
  
  const otherItems = items.filter(item => 
    !['oil', 'electrical', 'brakes', 'tires'].includes(item.type)
  );

  return { mainItems, tireItems, otherItems };
};

export const getItemsByStatus = (items: TechnicalItem[]) => {
  const trocarItems = items.filter(item => item.status === 'trocar');
  const proximoTrocaItems = items.filter(item => item.status === 'proximo-troca');
  const emDiaItems = items.filter(item => item.status === 'em-dia');

  return { trocarItems, proximoTrocaItems, emDiaItems };
};

export const getStatusIcon = (status: string) => {
  switch (status) {
    case 'em-dia':
      return '✅';
    case 'proximo-troca':
      return '⚠️';
    case 'trocar':
      return '🔴';
    default:
      return '❓';
  }
};
