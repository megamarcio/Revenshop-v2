
import { format, startOfDay, endOfDay, startOfMonth, endOfMonth, startOfYear, endOfYear, addDays, isSameDay, isSameMonth, isSameYear, isWithinInterval, parseISO, isValid } from 'date-fns';
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

export const filterExpensesByDateRange = (expenses: Expense[], dateRange: DateRange | null, filter: DateFilterType): Expense[] => {
  if (!dateRange) {
    return expenses;
  }

  const now = new Date();

  return expenses.filter(expense => {
    // Parse da data de vencimento
    let dueDate: Date;
    try {
      // Tenta diferentes formatos de data
      if (expense.due_date.includes('T')) {
        dueDate = parseISO(expense.due_date);
      } else if (expense.due_date.includes('/')) {
        // Formato dd/MM/yyyy
        const [day, month, year] = expense.due_date.split('/');
        dueDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      } else {
        dueDate = new Date(expense.due_date);
      }

      if (!isValid(dueDate)) {
        console.warn('Data inválida encontrada:', expense.due_date);
        return false;
      }
    } catch (error) {
      console.warn('Erro ao parsear data:', expense.due_date, error);
      return false;
    }

    // Lógica específica para cada filtro
    switch (filter) {
      case 'today':
        return isSameDay(dueDate, now);
      
      case 'week':
        // Próximos 7 dias a partir de hoje
        return isWithinInterval(dueDate, {
          start: startOfDay(now),
          end: endOfDay(addDays(now, 7))
        });
      
      case 'fortnight':
        // Próximos 15 dias a partir de hoje
        return isWithinInterval(dueDate, {
          start: startOfDay(now),
          end: endOfDay(addDays(now, 15))
        });
      
      case 'month':
        // Mesmo mês, mas aceita anos diferentes se necessário
        if (isSameMonth(dueDate, now) && isSameYear(dueDate, now)) {
          return true;
        }
        // Se não há despesas no mês atual, aceita próximo ano
        return isSameMonth(dueDate, now);
      
      case 'year':
        // Mesmo ano ou próximo ano se necessário
        if (isSameYear(dueDate, now)) {
          return true;
        }
        // Aceita próximo ano se a diferença for pequena
        const yearDiff = dueDate.getFullYear() - now.getFullYear();
        return yearDiff === 1;
      
      default:
        return true;
    }
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
