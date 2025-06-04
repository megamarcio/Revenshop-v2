
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit, FileText } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { supabase } from '../../integrations/supabase/client';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  deal_status: string;
  payment_type: string;
  responsible_seller?: {
    first_name: string;
    last_name: string;
  };
  interested_vehicle?: {
    name: string;
    model: string;
    year: number;
  };
}

interface CustomerListProps {
  onEditCustomer: (customer: Customer) => void;
  onGenerateQuote: (customer: Customer) => void;
}

const CustomerList = ({ onEditCustomer, onGenerateQuote }: CustomerListProps) => {
  const { t } = useLanguage();

  const { data: customers = [], isLoading } = useQuery({
    queryKey: ['customers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bhph_customers')
        .select(`
          *,
          responsible_seller:profiles!bhph_customers_responsible_seller_id_fkey(first_name, last_name),
          interested_vehicle:vehicles!bhph_customers_interested_vehicle_id_fkey(name, model, year)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return <div className="text-center py-4">{t('loading')}</div>;
  }

  if (customers.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">{t('noData')}</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('customerName')}</TableHead>
            <TableHead>{t('customerPhone')}</TableHead>
            <TableHead>{t('customerEmail')}</TableHead>
            <TableHead>{t('responsibleSeller')}</TableHead>
            <TableHead>{t('interestedVehicle')}</TableHead>
            <TableHead>{t('dealStatus')}</TableHead>
            <TableHead>{t('actions')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers.map((customer) => (
            <TableRow key={customer.id}>
              <TableCell className="font-medium">{customer.name}</TableCell>
              <TableCell>{customer.phone}</TableCell>
              <TableCell>{customer.email}</TableCell>
              <TableCell>
                {customer.responsible_seller ? 
                  `${customer.responsible_seller.first_name} ${customer.responsible_seller.last_name}` : 
                  '-'
                }
              </TableCell>
              <TableCell>
                {customer.interested_vehicle ? 
                  `${customer.interested_vehicle.year} ${customer.interested_vehicle.name} ${customer.interested_vehicle.model}` : 
                  '-'
                }
              </TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  customer.deal_status === 'completed' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {customer.deal_status === 'completed' ? t('completedSale') : t('quote')}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEditCustomer(customer)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onGenerateQuote(customer)}
                  >
                    <FileText className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CustomerList;
