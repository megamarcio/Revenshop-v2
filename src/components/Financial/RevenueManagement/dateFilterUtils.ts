
import { startOfToday, startOfWeek, startOfMonth, startOfYear, endOfToday, endOfWeek, endOfMonth, endOfYear, subDays, endOfDay } from 'date-fns';

export type DateFilterType = 'today' | 'week' | 'fortnight' | 'month' | 'year' | 'all';

export interface DateRange {
  start: Date;
  end: Date;
}

export const getDateRangeForFilter = (filter: DateFilterType): DateRange => {
  const today = new Date();

  switch (filter) {
    case 'today':
      return {
        start: startOfToday(),
        end: endOfToday()
      };
    case 'week':
      return {
        start: startOfWeek(today, { weekStartsOn: 1 }), // Segunda-feira
        end: endOfWeek(today, { weekStartsOn: 1 })
      };
    case 'fortnight':
      const fortnightStart = subDays(today, 14);
      return {
        start: fortnightStart,
        end: endOfDay(today)
      };
    case 'month':
      return {
        start: startOfMonth(today),
        end: endOfMonth(today)
      };
    case 'year':
      return {
        start: startOfYear(today),
        end: endOfYear(today)
      };
    case 'all':
    default:
      return {
        start: new Date(2000, 0, 1), // Data muito antiga
        end: new Date(2099, 11, 31)  // Data muito futura
      };
  }
};

export const filterRevenuesByDateRange = (revenues: any[], dateRange: DateRange, filterType: DateFilterType) => {
  if (filterType === 'all') {
    return revenues;
  }

  return revenues.filter(revenue => {
    const revenueDate = new Date(revenue.date);
    return revenueDate >= dateRange.start && revenueDate <= dateRange.end;
  });
};

export const getFilterButtonLabel = (filter: DateFilterType): string => {
  const labels = {
    'today': 'Hoje',
    'week': 'Semana',
    'fortnight': 'Quinzena',
    'month': 'Mês',
    'year': 'Ano',
    'all': 'Todos'
  };

  return labels[filter];
};

export const getFilterLabel = (filter: DateFilterType): string => {
  const labels = {
    'today': 'Receitas de hoje',
    'week': 'Receitas desta semana',
    'fortnight': 'Receitas dos últimos 15 dias',
    'month': 'Receitas deste mês',
    'year': 'Receitas deste ano',
    'all': 'Todas as receitas'
  };

  return labels[filter];
};
