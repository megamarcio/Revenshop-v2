
import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, subDays, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export type DateFilterType = 'day' | 'week' | 'biweekly' | 'month' | 'year' | 'all';

export interface DateRange {
  start: Date | null;
  end: Date | null;
}

export const getDateRangeForFilter = (filter: DateFilterType): DateRange => {
  // Usar uma nova instância de Date() para garantir horário local
  const today = new Date();
  // Ajustar para fuso horário local
  const localToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  switch (filter) {
    case 'day':
      return {
        start: startOfDay(localToday),
        end: endOfDay(localToday),
      };

    case 'week':
      return {
        start: startOfWeek(localToday, { locale: ptBR }),
        end: endOfWeek(localToday, { locale: ptBR }),
      };

    case 'biweekly':
      return {
        start: startOfDay(subDays(localToday, 14)),
        end: endOfDay(localToday),
      };

    case 'month':
      return {
        start: startOfMonth(localToday),
        end: endOfMonth(localToday),
      };

    case 'year':
      return {
        start: startOfYear(localToday),
        end: endOfYear(localToday),
      };

    case 'all':
    default:
      return {
        start: null,
        end: null,
      };
  }
};

export const filterRevenuesByDateRange = (revenues: any[], dateRange: DateRange) => {
  if (!dateRange.start || !dateRange.end) {
    return revenues;
  }

  return revenues.filter(revenue => {
    // Para receitas, usar sempre date
    const revenueDate = new Date(revenue.date);
    // Garantir que a comparação seja feita em horário local
    const localRevenueDate = new Date(revenueDate.getFullYear(), revenueDate.getMonth(), revenueDate.getDate());
    
    return localRevenueDate >= dateRange.start! && localRevenueDate <= dateRange.end!;
  });
};

export const getFilterLabel = (filter: DateFilterType): string => {
  const dateRange = getDateRangeForFilter(filter);
  
  if (!dateRange.start || !dateRange.end) {
    return 'Todas as receitas';
  }

  const start = format(dateRange.start, 'dd/MM', { locale: ptBR });
  const end = format(dateRange.end, 'dd/MM', { locale: ptBR });
  
  switch (filter) {
    case 'day':
      return `Hoje (${start})`;
    case 'week':
      return `Esta semana (${start} - ${end})`;
    case 'biweekly':
      return `Últimos 14 dias (${start} - ${end})`;
    case 'month':
      return `Este mês (${format(dateRange.start, 'MMM/yyyy', { locale: ptBR })})`;
    case 'year':
      return `Este ano (${format(dateRange.start, 'yyyy', { locale: ptBR })})`;
    default:
      return 'Período personalizado';
  }
};
