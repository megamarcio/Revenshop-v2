import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { useCustomers } from '../../hooks/useCustomers';
import CustomerForm from './CustomerForm';
import CustomerList from './CustomerList';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Filter, Users, Phone, MapPin, Calendar, Download } from 'lucide-react';
import { Customer } from '../../types/customer';
import { toast } from '@/hooks/use-toast';

const CustomerManagement = () => {
  const { t } = useLanguage();
  const { canEditCustomers, user, isAdmin, isManager } = useAuth();
  const { customers, loading, createCustomer, updateCustomer, deleteCustomer } = useCustomers();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  // Filter customers based on user role
  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.phone.toLowerCase().includes(searchTerm.toLowerCase());
    
    // For sellers, only show their assigned customers
    const matchesUser = isAdmin || isManager || customer.assigned_to === user?.id;
    
    return matchesSearch && matchesUser;
  });

  const handleCreateCustomer = async (customerData: Omit<Customer, 'id' | 'created_at' | 'updated_at'>) => {
    // Check for duplicate phone number
    const existingCustomer = customers.find(c => c.phone === customerData.phone);
    if (existingCustomer) {
      toast({
        title: 'Erro',
        description: 'Já existe um cliente cadastrado com este telefone.',
        variant: 'destructive',
      });
      return;
    }

    const success = await createCustomer(customerData);
    if (success) {
      setIsFormOpen(false);
    }
  };

  const handleUpdateCustomer = async (customerData: Omit<Customer, 'id' | 'created_at' | 'updated_at'>) => {
    if (!editingCustomer) return;
    
    // Check for duplicate phone number (excluding current customer)
    const existingCustomer = customers.find(c => c.phone === customerData.phone && c.id !== editingCustomer.id);
    if (existingCustomer) {
      toast({
        title: 'Erro',
        description: 'Já existe um cliente cadastrado com este telefone.',
        variant: 'destructive',
      });
      return;
    }
    
    const success = await updateCustomer(editingCustomer.id, customerData);
    if (success) {
      setEditingCustomer(null);
    }
  };

  const handleDeleteCustomer = async (customerId: string) => {
    if (confirm(t('confirmDelete'))) {
      await deleteCustomer(customerId);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('customers')}</h1>
          <p className="text-gray-600 mt-1">Gerencie seus clientes e leads</p>
        </div>
        
        {canEditCustomers && (
          <Button onClick={() => setIsFormOpen(true)} className="bg-revenshop-primary hover:bg-revenshop-primary/90">
            <Plus className="h-4 w-4 mr-2" />
            {t('addCustomer')}
          </Button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Clientes</p>
                <p className="text-3xl font-bold text-gray-900">{filteredCustomers.length}</p>
              </div>
              <Users className="h-8 w-8 text-revenshop-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Com Telefone</p>
                <p className="text-3xl font-bold text-gray-900">
                  {filteredCustomers.filter(c => c.phone).length}
                </p>
              </div>
              <Phone className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Com Endereço</p>
                <p className="text-3xl font-bold text-gray-900">
                  {filteredCustomers.filter(c => c.address).length}
                </p>
              </div>
              <MapPin className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar por nome, email ou telefone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-gray-400" />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filtrar por status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="lead">Leads</SelectItem>
              <SelectItem value="customer">Clientes</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Customer List */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-20 bg-gray-200 rounded-lg animate-pulse"></div>
          ))}
        </div>
      ) : (
        <CustomerList
          customers={filteredCustomers}
          onEdit={canEditCustomers ? (customer) => setEditingCustomer(customer) : undefined}
          onDelete={canEditCustomers ? deleteCustomer : undefined}
        />
      )}

      {/* Add Customer Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t('addCustomer')}</DialogTitle>
          </DialogHeader>
          <CustomerForm onSubmit={handleCreateCustomer} />
        </DialogContent>
      </Dialog>

      {/* Edit Customer Dialog */}
      <Dialog open={!!editingCustomer} onOpenChange={() => setEditingCustomer(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t('editCustomer')}</DialogTitle>
          </DialogHeader>
          {editingCustomer && (
            <CustomerForm 
              initialData={editingCustomer} 
              onSubmit={handleUpdateCustomer} 
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CustomerManagement;
