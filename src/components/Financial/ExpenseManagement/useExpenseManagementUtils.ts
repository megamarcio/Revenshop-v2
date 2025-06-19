
export const useExpenseManagementUtils = () => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'fixa': return 'bg-red-100 text-red-800';
      case 'variavel': return 'bg-blue-100 text-blue-800';
      case 'sazonal': return 'bg-yellow-100 text-yellow-800';
      case 'investimento': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const canReplicate = (expense: any) => {
    return expense.type === 'fixa' || expense.type === 'investimento';
  };

  return {
    formatCurrency,
    getTypeColor,
    canReplicate,
  };
};
