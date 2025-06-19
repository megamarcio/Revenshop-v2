
import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, subDays, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export type DateFilterType = 'day' | 'week' | 'biweekly' | 'month' | 'year' | 'all';

export interface DateRange {
  start: Date | null;
  end: Date | null;
}

export const getDateRangeForFilter = (filter: DateFilterType): DateRange => {
  // Usar uma nova instância de Date() para garantir horário local
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  switch (filter) {
    case 'day':
      return {
        start: startOfDay(today),
        end: endOfDay(today),
      };

    case 'week':
      return {
        start: startOfWeek(today, { locale: ptBR }),
        end: endOfWeek(today, { locale: ptBR }),
      };

    case 'biweekly':
      return {
        start: startOfDay(subDays(today, 14)),
        end: endOfDay(today),
      };

    case 'month':
      return {
        start: startOfMonth(today),
        end: endOfMonth(today),
      };

    case 'year':
      return {
        start: startOfYear(today),
        end: endOfYear(today),
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
    // Para receitas, usar sempre o campo 'date' (não 'due_date')
    const revenueDate = new Date(revenue.date);
    
    // Normalizar para comparação apenas de data (sem horário)
    const normalizedDate = new Date(revenueDate.getFullYear(), revenueDate.getMonth(), revenueDate.getDate());
    const normalizedStart = new Date(dateRange.start!.getFullYear(), dateRange.start!.getMonth(), dateRange.start!.getDate());
    const normalizedEnd = new Date(dateRange.end!.getFullYear(), dateRange.end!.getMonth(), dateRange.end!.getDate());
    
    return normalizedDate >= normalizedStart && normalizedDate <= normalizedEnd;
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
      return `Receitas de hoje (${start})`;
    case 'week':
      return `Receitas desta semana (${start} - ${end})`;
    case 'biweekly':
      return `Receitas dos últimos 14 dias (${start} - ${end})`;
    case 'month':
      return `Receitas deste mês (${format(dateRange.start, 'MMM/yyyy', { locale: ptBR })})`;
    case 'year':
      return `Receitas deste ano (${format(dateRange.start, 'yyyy', { locale: ptBR })})`;
    default:
      return 'Receitas do período personalizado';
  }
};
