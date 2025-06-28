export interface FluxoCaixaData {
  id: string;
  date: Date;
  description: string;
  amount: number;
  type: 'receita' | 'despesa';
  category: string;
  color?: string;
}

export interface FluxoCaixaFilters {
  month: number;
  year: number;
  view: 'mensal' | 'anual';
}

export interface FluxoCaixaTotals {
  totalReceitas: number;
  totalDespesas: number;
  saldoFinal: number;
}

export interface ChartDataPoint {
  date: string;
  receitas: number;
  despesas: number;
  saldo: number;
} 