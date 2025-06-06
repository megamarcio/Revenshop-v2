
import React from 'react';
import { Search, User } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Customer } from '@/hooks/useCustomersOptimized';

interface CustomerSearchProps {
  customers: Customer[];
  selectedCustomer?: Customer; 
  onCustomerSelect: (customer: Customer | undefined) => void;
  customerSearch: string;
  setCustomerSearch: (search: string) => void;
  isLoading: boolean;
}

const CustomerSearch = ({
  customers,
  selectedCustomer,
  onCustomerSelect,
  customerSearch,
  setCustomerSearch,
  isLoading
}: CustomerSearchProps) => {
  return (
    <div className="space-y-2">
      <Label className="flex items-center space-x-2 text-sm">
        <User className="h-3 w-3 sm:h-4 sm:w-4" />
        <span>Cliente (Opcional)</span>
      </Label>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
        <Input
          placeholder="Buscar cliente..."
          value={customerSearch}
          onChange={(e) => setCustomerSearch(e.target.value)}
          className="pl-8 sm:pl-10 text-sm h-9 sm:h-10"
        />
      </div>

      <Select
        value={selectedCustomer?.id || ''}
        onValueChange={(value) => {
          const customer = customers.find(c => c.id === value);
          onCustomerSelect(customer);
        }}
        disabled={isLoading}
      >
        <SelectTrigger className="h-9 sm:h-10 text-sm">
          <SelectValue placeholder={isLoading ? "Carregando..." : "Selecione um cliente"} />
        </SelectTrigger>
        <SelectContent className="max-h-48 sm:max-h-60">
          {customers.map((customer) => (
            <SelectItem key={customer.id} value={customer.id} className="text-sm">
              <div className="flex flex-col">
                <span>{customer.name}</span>
                <span className="text-xs text-muted-foreground">{customer.phone}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default CustomerSearch;
