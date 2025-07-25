
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import CustomerList from './CustomerList';
import CustomerForm from './CustomerForm';
import QuoteGenerator from './QuoteGenerator';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  deal_status: string;
  payment_type: string;
}

interface CustomerManagementProps {
  showAddForm?: boolean;
  onBackToVehicles?: () => void;
}

const CustomerManagement = ({ showAddForm = false, onBackToVehicles }: CustomerManagementProps) => {
  const { t } = useLanguage();
  const { canEditVehicles } = useAuth();
  const [showForm, setShowForm] = useState(showAddForm);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [showQuoteGenerator, setShowQuoteGenerator] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const handleAddCustomer = () => {
    setEditingCustomer(null);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingCustomer(null);
    if (onBackToVehicles) {
      onBackToVehicles();
    }
  };

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

  if (showForm) {
    return (
      <CustomerForm 
        customer={editingCustomer}
        onSave={handleCloseForm}
        onCancel={handleCloseForm}
      />
    );
  }

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                {t('customers')}
              </CardTitle>
              <p className="text-gray-600">{t('managingCustomers')}</p>
            </div>
            <div className="flex gap-2">
              {onBackToVehicles && (
                <Button 
                  variant="outline"
                  onClick={onBackToVehicles}
                >
                  Voltar aos Veículos
                </Button>
              )}
              {canEditVehicles && (
                <Button 
                  onClick={handleAddCustomer}
                  className="bg-revenshop-primary hover:bg-revenshop-primary/90"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {t('addCustomer')}
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <CustomerList />
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerManagement;
