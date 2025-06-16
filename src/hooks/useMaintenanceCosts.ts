
import { useMemo } from 'react';
import { useMaintenance } from './useMaintenance';
import { format, subMonths, startOfMonth, isSameMonth } from 'date-fns';

interface MonthlyCosts {
  month: string;
  year: number;
  totalCost: number;
  count: number;
  formattedMonth: string;
}

export const useMaintenanceCosts = () => {
  const { maintenances } = useMaintenance();

  const monthlyCosts = useMemo(() => {
    const costsByMonth = new Map<string, MonthlyCosts>();

    maintenances.forEach(maintenance => {
      const repairDate = maintenance.repair_date ? new Date(maintenance.repair_date) : null;
      if (!repairDate || maintenance.total_amount <= 0) return;

      const monthKey = format(repairDate, 'yyyy-MM');
      const month = format(repairDate, 'MMM');
      const year = repairDate.getFullYear();
      const formattedMonth = format(repairDate, 'MMM/yyyy');

      if (!costsByMonth.has(monthKey)) {
        costsByMonth.set(monthKey, {
          month,
          year,
          totalCost: 0,
          count: 0,
          formattedMonth
        });
      }

      const existing = costsByMonth.get(monthKey)!;
      existing.totalCost += maintenance.total_amount;
      existing.count += 1;
    });

    return Array.from(costsByMonth.values()).sort((a, b) => 
      new Date(`${a.year}-${a.month}-01`).getTime() - new Date(`${b.year}-${b.month}-01`).getTime()
    );
  }, [maintenances]);

  const last3MonthsCosts = useMemo(() => {
    const currentDate = new Date();
    const last3Months = [];
    
    for (let i = 2; i >= 0; i--) {
      const monthDate = subMonths(startOfMonth(currentDate), i);
      const monthKey = format(monthDate, 'yyyy-MM');
      const formattedMonth = format(monthDate, 'MMM/yyyy');
      
      const existingData = monthlyCosts.find(cost => 
        isSameMonth(new Date(`${cost.year}-${cost.month}-01`), monthDate)
      );

      last3Months.push({
        month: format(monthDate, 'MMM'),
        year: monthDate.getFullYear(),
        totalCost: existingData?.totalCost || 0,
        count: existingData?.count || 0,
        formattedMonth
      });
    }

    // Add current month
    const currentMonthKey = format(currentDate, 'yyyy-MM');
    const currentMonthFormatted = format(currentDate, 'MMM/yyyy');
    const currentMonthData = monthlyCosts.find(cost => 
      isSameMonth(new Date(`${cost.year}-${cost.month}-01`), currentDate)
    );

    last3Months.push({
      month: format(currentDate, 'MMM'),
      year: currentDate.getFullYear(),
      totalCost: currentMonthData?.totalCost || 0,
      count: currentMonthData?.count || 0,
      formattedMonth: currentMonthFormatted
    });

    return last3Months;
  }, [monthlyCosts]);

  const getCostsByMonth = (selectedMonth: string) => {
    return monthlyCosts.find(cost => cost.formattedMonth === selectedMonth);
  };

  const totalCostAllTime = monthlyCosts.reduce((sum, month) => sum + month.totalCost, 0);

  return {
    monthlyCosts,
    last3MonthsCosts,
    getCostsByMonth,
    totalCostAllTime
  };
};
