
export type RevenueSortField = 'date' | 'description' | 'category' | 'amount' | 'type' | 'status';
export type SortOrder = 'asc' | 'desc';

export interface SortOption {
  field: RevenueSortField;
  order: SortOrder;
  label: string;
}

export const revenueSortOptions: SortOption[] = [
  { field: 'date', order: 'desc', label: 'Data (Mais recente)' },
  { field: 'date', order: 'asc', label: 'Data (Mais antiga)' },
  { field: 'description', order: 'asc', label: 'Nome (A-Z)' },
  { field: 'description', order: 'desc', label: 'Nome (Z-A)' },
  { field: 'category', order: 'asc', label: 'Categoria (A-Z)' },
  { field: 'category', order: 'desc', label: 'Categoria (Z-A)' },
  { field: 'amount', order: 'desc', label: 'Valor (Maior)' },
  { field: 'amount', order: 'asc', label: 'Valor (Menor)' },
  { field: 'type', order: 'asc', label: 'Tipo (A-Z)' },
  { field: 'status', order: 'asc', label: 'Status (Pendente primeiro)' },
  { field: 'status', order: 'desc', label: 'Status (Confirmada primeiro)' },
];

export const sortRevenues = (revenues: any[], sortField: RevenueSortField, sortOrder: SortOrder) => {
  return [...revenues].sort((a, b) => {
    let aValue: any;
    let bValue: any;

    switch (sortField) {
      case 'date':
        aValue = new Date(a.date);
        bValue = new Date(b.date);
        break;
      case 'description':
        aValue = a.description.toLowerCase();
        bValue = b.description.toLowerCase();
        break;
      case 'category':
        aValue = a.category?.name?.toLowerCase() || '';
        bValue = b.category?.name?.toLowerCase() || '';
        break;
      case 'amount':
        aValue = a.amount;
        bValue = b.amount;
        break;
      case 'type':
        aValue = a.type;
        bValue = b.type;
        break;
      case 'status':
        aValue = a.is_confirmed ? 1 : 0;
        bValue = b.is_confirmed ? 1 : 0;
        break;
      default:
        return 0;
    }

    if (aValue < bValue) {
      return sortOrder === 'asc' ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortOrder === 'asc' ? 1 : -1;
    }
    return 0;
  });
};
