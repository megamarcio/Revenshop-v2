
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Plus, User } from 'lucide-react';
import { useCustomers } from '@/hooks/useCustomers';

interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
}

interface CustomerSelectorProps {
  value?: Customer;
  onChange: (customer: Customer | null) => void;
  onCreateNew: () => void;
}

const CustomerSelector = ({ value, onChange, onCreateNew }: CustomerSelectorProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const { customers, isLoading } = useCustomers();

  const filteredCustomers = customers?.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm)
  ) || [];

  const handleCustomerSelect = (customerId: string) => {
    const customer = customers?.find(c => c.id === customerId);
    if (customer) {
      onChange({
        id: customer.id,
        name: customer.name,
        phone: customer.phone,
        email: customer.email
      });
      setIsOpen(false);
    }
  };

  const clearSelection = () => {
    onChange(null);
    setSearchTerm('');
  };

  return (
    <div className="space-y-2">
      <Label>Cliente</Label>
      
      {value ? (
        <div className="flex items-center justify-between p-3 border rounded-md bg-gray-50">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-gray-500" />
            <div>
              <p className="font-medium">{value.name}</p>
              <p className="text-sm text-gray-500">{value.phone}</p>
              {value.email && <p className="text-xs text-gray-400">{value.email}</p>}
            </div>
          </div>
          <Button 
            type="button" 
            variant="outline" 
            size="sm" 
            onClick={clearSelection}
          >
            Alterar
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar cliente por nome ou telefone..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setIsOpen(true);
                }}
                onFocus={() => setIsOpen(true)}
                className="pl-9"
              />
            </div>
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              onClick={onCreateNew}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Novo Cliente
            </Button>
          </div>

          {isOpen && searchTerm && !isLoading && (
            <div className="border rounded-md bg-white shadow-lg max-h-48 overflow-y-auto">
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((customer) => (
                  <div
                    key={customer.id}
                    className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                    onClick={() => handleCustomerSelect(customer.id)}
                  >
                    <p className="font-medium">{customer.name}</p>
                    <p className="text-sm text-gray-500">{customer.phone}</p>
                    {customer.email && <p className="text-xs text-gray-400">{customer.email}</p>}
                  </div>
                ))
              ) : (
                <div className="p-3 text-center text-gray-500">
                  <p>Nenhum cliente encontrado</p>
                  <Button 
                    type="button" 
                    variant="link" 
                    size="sm" 
                    onClick={onCreateNew}
                    className="mt-1"
                  >
                    Criar novo cliente
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CustomerSelector;
