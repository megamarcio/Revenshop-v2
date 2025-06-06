
import React from 'react';
import { Customer } from '@/hooks/useCustomersOptimized';

interface CustomerInfoProps {
  customer: Customer;
}

const CustomerInfo = ({ customer }: CustomerInfoProps) => {
  return (
    <div className="mt-4 p-3 bg-green-50 rounded-lg">
      <h4 className="font-medium text-green-900 mb-2 text-sm">Cliente Selecionado</h4>
      <div className="text-xs sm:text-sm text-green-700 space-y-1">
        <p><span className="font-medium">Nome:</span> {customer.name}</p>
        <p><span className="font-medium">Telefone:</span> {customer.phone}</p>
        {customer.email && (
          <p className="hidden sm:block"><span className="font-medium">Email:</span> {customer.email}</p>
        )}
      </div>
    </div>
  );
};

export default CustomerInfo;
