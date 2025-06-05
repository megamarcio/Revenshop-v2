
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, FileText, Download, DollarSign, CreditCard, Banknote } from 'lucide-react';
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

  const getPaymentTypeIcon = (paymentType: string) => {
    switch (paymentType) {
      case 'cash':
        return <Banknote className="h-4 w-4" />;
      case 'financing':
        return <CreditCard className="h-4 w-4" />;
      case 'bhph':
        return <DollarSign className="h-4 w-4" />;
      default:
        return <DollarSign className="h-4 w-4" />;
    }
  };

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
        <div className="grid gap-4">
          {customers.map((customer) => (
            <Card key={customer.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{customer.name}</h3>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>📞 {customer.phone}</p>
                      {customer.email && <p>✉️ {customer.email}</p>}
                      {customer.address && <p>📍 {customer.address}</p>}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Badge className={getStatusBadgeColor(customer.deal_status)}>
                      {customer.deal_status === 'quote' ? t('quote') : t('completedSale')}
                    </Badge>
                    <div className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-md">
                      {getPaymentTypeIcon(customer.payment_type)}
                      <span className="text-xs">
                        {customer.payment_type === 'cash' ? t('cash') :
                         customer.payment_type === 'financing' ? t('financing') : t('bhph')}
                      </span>
                    </div>
                  </div>
                </div>

                {customer.interested_vehicle && (
                  <div className="bg-gray-50 p-3 rounded-md mb-4">
                    <p className="text-sm font-medium">🚗 Veículo de Interesse:</p>
                    <p className="text-sm text-gray-600">
                      {customer.interested_vehicle.year} {customer.interested_vehicle.name} {customer.interested_vehicle.model}
                    </p>
                    <p className="text-sm text-gray-600">
                      Preço: R$ {customer.interested_vehicle.sale_price?.toLocaleString()}
                    </p>
                  </div>
                )}

                {customer.responsible_seller && (
                  <div className="text-sm text-gray-600 mb-4">
                    <p>👤 Vendedor: {customer.responsible_seller.first_name} {customer.responsible_seller.last_name}</p>
                  </div>
                )}

                <div className="flex gap-2 flex-wrap">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditCustomer(customer)}
                  >
                    {t('edit')}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleShowDealDetails(customer)}
                  >
                    <DollarSign className="h-4 w-4 mr-1" />
                    Detalhes do Deal
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleGenerateQuote(customer)}
                  >
                    <FileText className="h-4 w-4 mr-1" />
                    {t('generateQuote')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomerList;
