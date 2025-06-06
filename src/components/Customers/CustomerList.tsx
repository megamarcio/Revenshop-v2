
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Search, FileText, DollarSign, Edit } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { supabase } from '../../integrations/supabase/client';
import CustomerForm from './CustomerForm';
import QuoteGenerator from './QuoteGenerator';
import DealDetails from './DealDetails';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  deal_status: string;
  payment_type: string;
  interested_vehicle?: {
    id: string;
    name: string;
    model: string;
    year: number;
    sale_price: number;
  };
  responsible_seller?: {
    first_name: string;
    last_name: string;
  };
}

interface CustomerListProps {
  onCustomerSelect?: (customer: Customer) => void;
}

const CustomerList = ({ onCustomerSelect }: CustomerListProps) => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showForm, setShowForm] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showQuoteGenerator, setShowQuoteGenerator] = useState(false);
  const [showDealDetails, setShowDealDetails] = useState(false);

  const { data: customers = [], isLoading } = useQuery({
    queryKey: ['customers', searchTerm, statusFilter],
    queryFn: async () => {
      let query = supabase
        .from('bhph_customers')
        .select(`
          *,
          interested_vehicle:vehicles(id, name, model, year, sale_price),
          responsible_seller:profiles(first_name, last_name)
        `)
        .order('created_at', { ascending: false });

      if (searchTerm) {
        query = query.or(`name.ilike.%${searchTerm}%,phone.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`);
      }

      if (statusFilter !== 'all') {
        query = query.eq('deal_status', statusFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Customer[];
    },
  });

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'quote':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleGenerateQuote = (customer: Customer) => {
    setSelectedCustomer(customer);
    setShowQuoteGenerator(true);
  };

  const handleShowDealDetails = (customer: Customer) => {
    setSelectedCustomer(customer);
    setShowDealDetails(true);
  };

  const handleEditCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setShowForm(true);
  };

  if (showForm) {
    return (
      <CustomerForm
        customer={selectedCustomer}
        onSave={() => {
          setShowForm(false);
          setSelectedCustomer(null);
        }}
        onCancel={() => {
          setShowForm(false);
          setSelectedCustomer(null);
        }}
      />
    );
  }

  if (showQuoteGenerator && selectedCustomer) {
    return (
      <QuoteGenerator
        customer={selectedCustomer}
        onBack={() => {
          setShowQuoteGenerator(false);
          setSelectedCustomer(null);
        }}
      />
    );
  }

  if (showDealDetails && selectedCustomer) {
    return (
      <DealDetails
        customer={selectedCustomer}
        onBack={() => {
          setShowDealDetails(false);
          setSelectedCustomer(null);
        }}
      />
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{t('customers')}</h1>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          {t('addCustomer')}
        </Button>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder={`${t('search')} ${t('customers').toLowerCase()}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder={t('filter')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os Status</SelectItem>
            <SelectItem value="quote">{t('quote')}</SelectItem>
            <SelectItem value="completed">{t('completedSale')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="text-center py-8">{t('loading')}</div>
      ) : customers.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-500">{t('noData')}</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs font-medium">Nome</TableHead>
                  <TableHead className="text-xs font-medium">Telefone</TableHead>
                  <TableHead className="text-xs font-medium">Veículo de Interesse</TableHead>
                  <TableHead className="text-xs font-medium">Preço</TableHead>
                  <TableHead className="text-xs font-medium">Vendedor</TableHead>
                  <TableHead className="text-xs font-medium">Status</TableHead>
                  <TableHead className="text-xs font-medium text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers.map((customer) => (
                  <TableRow key={customer.id} className="hover:bg-gray-50">
                    <TableCell className="text-xs">
                      <div>
                        <div className="font-medium">{customer.name}</div>
                        {customer.email && (
                          <div className="text-gray-500 text-xs">{customer.email}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-xs">{customer.phone}</TableCell>
                    <TableCell className="text-xs">
                      {customer.interested_vehicle ? (
                        <div>
                          <div className="font-medium">
                            {customer.interested_vehicle.year} {customer.interested_vehicle.name}
                          </div>
                          <div className="text-gray-500">{customer.interested_vehicle.model}</div>
                        </div>
                      ) : (
                        <span className="text-gray-400">Não informado</span>
                      )}
                    </TableCell>
                    <TableCell className="text-xs">
                      {customer.interested_vehicle?.sale_price ? (
                        <span className="font-medium">
                          R$ {customer.interested_vehicle.sale_price.toLocaleString()}
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-xs">
                      {customer.responsible_seller ? (
                        <span>
                          {customer.responsible_seller.first_name} {customer.responsible_seller.last_name}
                        </span>
                      ) : (
                        <span className="text-gray-400">Não atribuído</span>
                      )}
                    </TableCell>
                    <TableCell className="text-xs">
                      <Badge className={`text-xs ${getStatusBadgeColor(customer.deal_status)}`}>
                        {customer.deal_status === 'quote' ? t('quote') : t('completedSale')}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-1 justify-end">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditCustomer(customer)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleShowDealDetails(customer)}
                          className="h-8 w-8 p-0"
                        >
                          <DollarSign className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleGenerateQuote(customer)}
                          className="h-8 w-8 p-0"
                        >
                          <FileText className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CustomerList;
