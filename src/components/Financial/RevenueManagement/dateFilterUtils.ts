
import { format, startOfDay, endOfDay, startOfMonth, endOfMonth, startOfYear, endOfYear, addDays, isSameDay, isSameMonth, isSameYear, isWithinInterval, parseISO, isValid } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export type DateFilterType = 'day' | 'week' | 'biweekly' | 'month' | 'year' | 'all';

export interface DateRange {
  start: Date;
  end: Date;
}

export const getDateRangeForFilter = (filter: DateFilterType): DateRange | null => {
  const now = new Date();
  
  switch (filter) {
    case 'day':
      return {
        start: startOfDay(now),
        end: endOfDay(now)
      };
    
    case 'week':
      return {
        start: startOfDay(now),
        end: endOfDay(addDays(now, 7))
      };
    
    case 'biweekly':
      return {
        start: startOfDay(now),
        end: endOfDay(addDays(now, 14))
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

export const filterRevenuesByDateRange = (revenues: any[], dateRange: DateRange | null, filter: DateFilterType) => {
  if (!dateRange) {
    return revenues;
  }

  const now = new Date();

  return revenues.filter(revenue => {
    // Parse da data da receita
    let revenueDate: Date;
    try {
      // Tenta diferentes formatos de data
      if (revenue.date.includes('T')) {
        revenueDate = parseISO(revenue.date);
      } else if (revenue.date.includes('/')) {
        // Formato dd/MM/yyyy
        const [day, month, year] = revenue.date.split('/');
        revenueDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      } else {
        revenueDate = new Date(revenue.date);
      }

      if (!isValid(revenueDate)) {
        console.warn('Data inválida encontrada:', revenue.date);
        return false;
      }
    } catch (error) {
      console.warn('Erro ao parsear data:', revenue.date, error);
      return false;
    }

    // Lógica específica para cada filtro
    switch (filter) {
      case 'day':
        return isSameDay(revenueDate, now);
      
      case 'week':
        // Próximos 7 dias a partir de hoje
        return isWithinInterval(revenueDate, {
          start: startOfDay(now),
          end: endOfDay(addDays(now, 7))
        });
      
      case 'biweekly':
        // Próximos 14 dias a partir de hoje
        return isWithinInterval(revenueDate, {
          start: startOfDay(now),
          end: endOfDay(addDays(now, 14))
        });
      
      case 'month':
        // Mesmo mês, mas aceita anos diferentes se necessário
        if (isSameMonth(revenueDate, now) && isSameYear(revenueDate, now)) {
          return true;
        }
        // Se não há receitas no mês atual, aceita próximo ano
        return isSameMonth(revenueDate, now);
      
      case 'year':
        // Mesmo ano ou próximo ano se necessário
        if (isSameYear(revenueDate, now)) {
          return true;
        }
        // Aceita próximo ano se a diferença for pequena
        const yearDiff = revenueDate.getFullYear() - now.getFullYear();
        return yearDiff === 1;
      
      default:
        return true;
    }
  });
};

export const getFilterLabel = (filter: DateFilterType): string => {
  const now = new Date();
  
  switch (filter) {
    case 'day':
      return `Receitas de hoje - ${format(now, 'dd/MM/yyyy', { locale: ptBR })}`;
    
    case 'week':
      const weekEnd = addDays(now, 7);
      return `Próximos 7 dias - ${format(now, 'dd/MM', { locale: ptBR })} à ${format(weekEnd, 'dd/MM', { locale: ptBR })}`;
    
    case 'biweekly':
      const biweeklyEnd = addDays(now, 14);
      return `Próximos 14 dias - ${format(now, 'dd/MM', { locale: ptBR })} à ${format(biweeklyEnd, 'dd/MM', { locale: ptBR })}`;
    
    case 'month':
      return `Este mês - ${format(now, 'MMMM yyyy', { locale: ptBR })}`;
    
    case 'year':
      return `Este ano - ${format(now, 'yyyy', { locale: ptBR })}`;
    
    case 'all':
    default:
      return 'Todas as receitas';
  }
};
