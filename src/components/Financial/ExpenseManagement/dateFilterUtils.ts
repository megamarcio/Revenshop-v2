
import { format, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, addDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { Expense } from '@/hooks/useExpenses';

export type DateFilterType = 'today' | 'week' | 'fortnight' | 'month' | 'year' | 'all';

export interface DateRange {
  start: Date;
  end: Date;
}

export const getDateRangeForFilter = (filter: DateFilterType): DateRange | null => {
  const now = new Date();
  
  switch (filter) {
    case 'today':
      return {
        start: startOfDay(now),
        end: endOfDay(now)
      };
    
    case 'week':
      return {
        start: startOfDay(now),
        end: endOfDay(addDays(now, 7))
      };
    
    case 'fortnight':
      return {
        start: startOfDay(now),
        end: endOfDay(addDays(now, 15))
      };
    
    case 'month':
      return {
        start: startOfMonth(now),
        end: endOfMonth(now)
      };
    
    case 'year':
      return {
        start: startOfYear(now),
        end: endOfYear(now)
      };
    
    case 'all':
    default:
      return null;
  }
};

export const filterExpensesByDateRange = (expenses: Expense[], dateRange: DateRange | null): Expense[] => {
  if (!dateRange) {
    return expenses;
  }

  return expenses.filter(expense => {
    const dueDate = new Date(expense.due_date);
    return dueDate >= dateRange.start && dueDate <= dateRange.end;
  });
};

export const getFilterLabel = (filter: DateFilterType): string => {
  const now = new Date();
  
  switch (filter) {
    case 'today':
      return `Hoje - ${format(now, 'dd/MM/yyyy', { locale: ptBR })}`;
    
    case 'week':
      const weekEnd = addDays(now, 7);
      return `Próximos 7 dias - ${format(now, 'dd/MM', { locale: ptBR })} à ${format(weekEnd, 'dd/MM', { locale: ptBR })}`;
    
    case 'fortnight':
      const fortnightEnd = addDays(now, 15);
      return `Próximos 15 dias - ${format(now, 'dd/MM', { locale: ptBR })} à ${format(fortnightEnd, 'dd/MM', { locale: ptBR })}`;
    
    case 'month':
      return `Este mês - ${format(now, 'MMMM yyyy', { locale: ptBR })}`;
    
    case 'year':
      return `Este ano - ${format(now, 'yyyy', { locale: ptBR })}`;
    
    case 'all':
    default:
      return 'Todas as despesas';
  }
};

export const getFilterButtonLabel = (filter: DateFilterType): string => {
  switch (filter) {
    case 'today':
      return 'Dia';
    case 'week':
      return 'Semana';
    case 'fortnight':
      return 'Quinzena';
    case 'month':
      return 'Mês';
    case 'year':
      return 'Ano';
    case 'all':
      return 'Todos';
    default:
      return 'Todos';
  }
};
