interface Revenue {
  id: string;
  description: string;
  amount: number;
  type: string;
  date: string;
  is_confirmed: boolean;
  notes?: string;
  category?: {
    name: string;
    type: string;
  };
}

export const useRevenueManagementUtils = () => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'venda': return 'bg-green-100 text-green-800';
      case 'comissao': return 'bg-blue-100 text-blue-800';
      case 'servico': return 'bg-purple-100 text-purple-800';
      case 'financiamento': return 'bg-orange-100 text-orange-800';
      case 'estimada': return 'bg-yellow-100 text-yellow-800';
      case 'padrao': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const canReplicate = (revenue: Revenue) => {
    return revenue.type === 'estimada' || revenue.type === 'padrao';
  };

  return {
    formatCurrency,
    getTypeColor,
    canReplicate,
  };
}; 