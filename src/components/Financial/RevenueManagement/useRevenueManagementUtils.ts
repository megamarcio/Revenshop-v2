
export const useRevenueManagementUtils = () => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const getTypeColor = (type: string) => {
    const colors = {
      'mensal': 'bg-blue-100 text-blue-800',
      'avulsa': 'bg-green-100 text-green-800',
      'comissao': 'bg-purple-100 text-purple-800',
      'extra': 'bg-orange-100 text-orange-800',
      'investimento': 'bg-indigo-100 text-indigo-800',
      'padrao': 'bg-blue-100 text-blue-800',
      'estimada': 'bg-yellow-100 text-yellow-800',
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const canReplicate = (revenue: any) => {
    // Permite replicar receitas mensais ou estimadas
    return revenue.type === 'mensal' || revenue.type === 'estimada';
  };

  return {
    formatCurrency,
    getTypeColor,
    canReplicate,
  };
};
