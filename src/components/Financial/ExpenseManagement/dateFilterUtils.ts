
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

export const filterExpensesByDateRange = (expenses: any[], dateRange: DateRange) => {
  if (!dateRange.start || !dateRange.end) {
    return expenses;
  }

  return expenses.filter(expense => {
    // Para despesas, usar due_date como prioridade, fallback para date
    const referenceDate = expense.due_date ? new Date(expense.due_date) : new Date(expense.date);
    
    // Normalizar para comparação apenas de data (sem horário)
    const normalizedDate = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), referenceDate.getDate());
    const normalizedStart = new Date(dateRange.start!.getFullYear(), dateRange.start!.getMonth(), dateRange.start!.getDate());
    const normalizedEnd = new Date(dateRange.end!.getFullYear(), dateRange.end!.getMonth(), dateRange.end!.getDate());
    
    // Debug logs (remover após teste)
    console.log('Expense:', expense.description, {
      dueDate: expense.due_date,
      normalizedDate: normalizedDate.toISOString(),
      rangeStart: normalizedStart.toISOString(),
      rangeEnd: normalizedEnd.toISOString(),
      isInRange: normalizedDate >= normalizedStart && normalizedDate <= normalizedEnd
    });
    
    return normalizedDate >= normalizedStart && normalizedDate <= normalizedEnd;
  });
};

export const filterRevenuesByDateRange = (revenues: any[], dateRange: DateRange) => {
  if (!dateRange.start || !dateRange.end) {
    return revenues;
  }

  return revenues.filter(revenue => {
    // Para receitas, usar sempre date
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
