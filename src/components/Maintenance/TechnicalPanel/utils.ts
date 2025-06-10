
import { TechnicalItem } from './types';

export const getStatusColor = (status: string) => {
  switch (status) {
    case 'em-dia': return 'bg-green-100 text-green-800 border-green-200';
    case 'precisa-troca': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'urgente': return 'bg-red-100 text-red-800 border-red-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export const formatDate = (month: string, year: string, miles?: string) => {
  if (!month && !year) return '';
  const dateStr = `${month}/${year}`;
  return miles ? `${dateStr} - ${miles} mi` : dateStr;
};

export const groupItemsByType = (items: TechnicalItem[]) => ({
  oil: items.filter(item => item.type === 'oil'),
  electrical: items.filter(item => item.type === 'electrical'),
  filter: items.filter(item => item.type === 'filter'),
  suspension: items.filter(item => item.type === 'suspension'),
  brakes: items.filter(item => item.type === 'brakes'),
  fluids: items.filter(item => item.type === 'fluids'),
  tuneup: items.filter(item => item.type === 'tuneup'),
  tires: items.filter(item => item.type === 'tires')
});
