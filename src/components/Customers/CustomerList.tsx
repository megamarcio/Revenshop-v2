import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Search, FileText, DollarSign, Edit, Trash2, Loader2 } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
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
  responsible_seller_id?: string;
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
  const { user, isAdmin, isManager } = useAuth();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showForm, setShowForm] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showQuoteGenerator, setShowQuoteGenerator] = useState(false);
  const [showDealDetails, setShowDealDetails] = useState(false);
  const [deletingCustomerId, setDeletingCustomerId] = useState<string | null>(null);

  const { data: customers = [], isLoading } = useQuery({
    queryKey: ['customers', searchTerm, statusFilter, user?.id],
    queryFn: async () => {
      let query = supabase
        .from('bhph_customers')
        .select(`
          *,
          interested_vehicle:vehicles(id, name, model, year, sale_price),
          responsible_seller:profiles(first_name, last_name)
        `)
        .order('created_at', { ascending: false });

      // Se não for admin ou manager, mostrar apenas clientes do vendedor
      if (!isAdmin && !isManager && user?.id) {
        query = query.eq('responsible_seller_id', user.id);
      }

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

  const handleDeleteCustomer = async (customerId: string) => {
    try {
      setDeletingCustomerId(customerId);
      
      const { error } = await supabase
        .from('bhph_customers')
        .delete()
        .eq('id', customerId);

      if (error) {
        console.error('Error deleting customer:', error);
        throw error;
      }

      // Invalidate and refetch the customers query
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      
      toast({
        title: 'Sucesso',
        description: 'Cliente excluído com sucesso!',
      });
    } catch (error: any) {
      console.error('Error deleting customer:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao excluir cliente. Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setDeletingCustomerId(null);
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
    <div className="space-y-4">
      <div className="flex gap-4">
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
                  <TableHead className="text-xs font-medium w-36">Nome</TableHead>
                  <TableHead className="text-xs font-medium w-28">Telefone</TableHead>
                  <TableHead className="text-xs font-medium w-64">Veículo de Interesse</TableHead>
                  <TableHead className="text-xs font-medium w-24">Preço</TableHead>
                  <TableHead className="text-xs font-medium w-32">Vendedor</TableHead>
                  <TableHead className="text-xs font-medium w-20">Status</TableHead>
                  <TableHead className="text-xs font-medium text-right w-32">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers.map((customer) => (
                  <TableRow key={customer.id} className="hover:bg-gray-50">
                    <TableCell className="text-xs py-2">
                      <div>
                        <div className="font-medium text-xs">{customer.name}</div>
                        {customer.email && (
                          <div className="text-gray-500 text-[9px]">{customer.email}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-xs py-2">{customer.phone}</TableCell>
                    <TableCell className="py-2">
                      {customer.interested_vehicle ? (
                        <div>
                          <div className="font-medium text-[9px]">
                            {customer.interested_vehicle.year} {customer.interested_vehicle.name}
                          </div>
                          <div className="text-gray-500 text-[9px]">{customer.interested_vehicle.model}</div>
                        </div>
                      ) : (
                        <span className="text-gray-400 text-[9px]">Não informado</span>
                      )}
                    </TableCell>
                    <TableCell className="text-xs py-2">
                      {customer.interested_vehicle?.sale_price ? (
                        <span className="font-medium text-xs">
                          R$ {customer.interested_vehicle.sale_price.toLocaleString()}
                        </span>
                      ) : (
                        <span className="text-gray-400 text-xs">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-xs py-2">
                      {customer.responsible_seller ? (
                        <span className="text-xs">
                          {customer.responsible_seller.first_name} {customer.responsible_seller.last_name}
                        </span>
                      ) : (
                        <span className="text-gray-400 text-xs">Não atribuído</span>
                      )}
                    </TableCell>
                    <TableCell className="py-2">
                      <Badge className={`text-[7px] px-1 py-0 ${getStatusBadgeColor(customer.deal_status)}`}>
                        {customer.deal_status === 'quote' ? t('quote') : t('completedSale')}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right py-2">
                      <div className="flex gap-1 justify-end">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditCustomer(customer)}
                          className="h-6 w-6 p-0"
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleShowDealDetails(customer)}
                          className="h-6 w-6 p-0"
                        >
                          <DollarSign className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleGenerateQuote(customer)}
                          className="h-6 w-6 p-0"
                        >
                          <FileText className="h-3 w-3" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                              disabled={deletingCustomerId === customer.id}
                            >
                              {deletingCustomerId === customer.id ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                              ) : (
                                <Trash2 className="h-3 w-3" />
                              )}
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja excluir o cliente <strong>{customer.name}</strong>?
                                <br />
                                Esta ação não pode ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteCustomer(customer.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Excluir Cliente
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
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
