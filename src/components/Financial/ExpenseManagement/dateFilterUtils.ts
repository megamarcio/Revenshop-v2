
import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, subDays, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export type DateFilterType = 'day' | 'week' | 'biweekly' | 'month' | 'year' | 'all';

export interface DateRange {
  start: Date | null;
  end: Date | null;
}

export const getDateRangeForFilter = (filter: DateFilterType): DateRange => {
  const today = new Date();

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
        start: subDays(today, 14),
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

export const filterExpensesByDateRange = (expenses: any[], dateRange: DateRange) => {
  if (!dateRange.start || !dateRange.end) {
    return expenses;
  }

  return expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    return expenseDate >= dateRange.start! && expenseDate <= dateRange.end!;
  });
};

export const getFilterLabel = (filter: DateFilterType): string => {
  const dateRange = getDateRangeForFilter(filter);
  
  if (!dateRange.start || !dateRange.end) {
    return 'Todas as despesas';
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
