import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Plus, User, Phone, Car, DollarSign, ArrowLeft, FileText, Download } from 'lucide-react';
import CustomerForm from './CustomerForm';
import DealDetails from './DealDetails';
import QuoteGenerator from './QuoteGenerator';

interface Customer {
  id: string;
  name: string;
  email?: string;
  phone: string;
  address?: string;
  interested_vehicle_id?: string;
  responsible_seller_id?: string;
  deal_status?: string;
  payment_type?: string;
  created_at: string;
  vehicle?: {
    id: string;
    name: string;
    year: number;
    model: string;
    sale_price: number;
  };
}

interface CustomerManagementProps {
  showAddForm?: boolean;
  onBackToVehicles?: () => void;
}

const CustomerManagement = ({ showAddForm = false, onBackToVehicles }: CustomerManagementProps) => {
  const { t } = useLanguage();
  const { user, isAdmin, isManager } = useAuth();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(showAddForm);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isQuoteDialogOpen, setIsQuoteDialogOpen] = useState(false);

  const fetchCustomers = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      let query = supabase
        .from('bhph_customers')
        .select(`
          *,
          vehicle:interested_vehicle_id(
            id,
            name,
            year,
            model,
            sale_price
          )
        `)
        .order('created_at', { ascending: false });

      // Se não for admin/manager, mostrar apenas clientes do vendedor logado
      if (!isAdmin && !isManager) {
        query = query.eq('responsible_seller_id', user.id);
      }

      const { data, error } = await query;

      if (error) throw error;
      
      setCustomers(data || []);
    } catch (error) {
      console.error('Error fetching customers:', error);
      toast({
        title: t('error'),
        description: 'Erro ao carregar clientes.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [user, isAdmin, isManager]);

  useEffect(() => {
    setIsCreateDialogOpen(showAddForm);
  }, [showAddForm]);

  const handleCreateCustomer = () => {
    setIsCreateDialogOpen(false);
    fetchCustomers();
  };

  const handleGeneratePDF = async (customer: Customer) => {
    if (!customer.vehicle) {
      toast({
        title: 'Erro',
        description: 'Cliente não possui veículo selecionado.',
        variant: 'destructive',
      });
      return;
    }

    // Calcular Sales Tax (6%)
    const salesTax = customer.vehicle.sale_price * 0.06;
    const totalWithTax = customer.vehicle.sale_price + salesTax;

    // Criar conteúdo do PDF (baseado na imagem enviada)
    const pdfContent = `
      <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px;">
        <h1 style="text-align: center; color: #333;">Proposta de Financiamento</h1>
        
        <div style="border: 1px solid #ccc; padding: 20px; margin: 20px 0;">
          <h2>Informações do Cliente</h2>
          <p><strong>Nome:</strong> ${customer.name}</p>
          <p><strong>Telefone:</strong> ${customer.phone}</p>
          <p><strong>Email:</strong> ${customer.email || 'Não informado'}</p>
          <p><strong>Endereço:</strong> ${customer.address || 'Não informado'}</p>
        </div>

        <div style="border: 1px solid #ccc; padding: 20px; margin: 20px 0;">
          <h2>Informações do Veículo</h2>
          <p><strong>Veículo:</strong> ${customer.vehicle.year} ${customer.vehicle.name}</p>
          <p><strong>Modelo:</strong> ${customer.vehicle.model}</p>
          <p><strong>Preço de Venda:</strong> $${customer.vehicle.sale_price.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
          <p><strong>Sales Tax (6%):</strong> $${salesTax.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
          <p><strong>Total com Impostos:</strong> $${totalWithTax.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
        </div>

        <div style="border: 1px solid #ccc; padding: 20px; margin: 20px 0;">
          <h2>Termos de Financiamento</h2>
          <p>Esta proposta está sujeita à aprovação de crédito e verificação de documentos.</p>
          <p>Taxa de juros e condições serão definidas após análise completa.</p>
        </div>

        <div style="text-align: center; margin-top: 40px;">
          <p style="color: #666;">Documento gerado em ${new Date().toLocaleDateString('pt-BR')}</p>
        </div>
      </div>
    `;

    // Criar e baixar o PDF
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Proposta - ${customer.name}</title>
          </head>
          <body>
            ${pdfContent}
            <script>
              window.onload = function() {
                window.print();
                setTimeout(function() {
                  window.close();
                }, 100);
              };
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status?: string) => {
    switch (status) {
      case 'approved': return 'Aprovado';
      case 'pending': return 'Pendente';
      case 'rejected': return 'Rejeitado';
      default: return 'Novo';
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-gray-600">Carregando clientes...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          {onBackToVehicles && (
            <Button variant="outline" onClick={onBackToVehicles}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar para Veículos
            </Button>
          )}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{t('customers')}</h1>
            <p className="text-gray-600 mt-1">
              {isAdmin || isManager ? 'Gerencie todos os clientes' : 'Gerencie seus clientes'}
            </p>
            <p className="text-sm text-gray-500 mt-1">Total de clientes: {customers.length}</p>
          </div>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-revenshop-primary hover:bg-revenshop-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Cliente
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Adicionar Novo Cliente</DialogTitle>
            </DialogHeader>
            <CustomerForm 
              onSave={handleCreateCustomer}
              onCancel={() => setIsCreateDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Lista de Clientes */}
      <div className="grid gap-4">
        {customers.map((customer) => (
          <Card key={customer.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 flex-1">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{customer.name}</h3>
                      <Badge className={getStatusColor(customer.deal_status)}>
                        {getStatusLabel(customer.deal_status)}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <span>{customer.phone}</span>
                      </div>
                      
                      {customer.vehicle && (
                        <>
                          <div className="flex items-center space-x-2">
                            <Car className="h-4 w-4 text-gray-400" />
                            <span>{customer.vehicle.year} {customer.vehicle.name}</span>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <DollarSign className="h-4 w-4 text-green-600" />
                            <span className="font-semibold text-green-600">
                              ${customer.vehicle.sale_price.toLocaleString('en-US')}
                            </span>
                          </div>
                        </>
                      )}
                      
                      <div className="text-gray-500">
                        Criado em: {new Date(customer.created_at).toLocaleDateString('pt-BR')}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedCustomer(customer)}
                  >
                    <User className="h-4 w-4 mr-1" />
                    Detalhes
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleGeneratePDF(customer)}
                    disabled={!customer.vehicle}
                  >
                    <FileText className="h-4 w-4 mr-1" />
                    PDF
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Dialog de Detalhes do Cliente */}
      <Dialog open={!!selectedCustomer} onOpenChange={() => setSelectedCustomer(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalhes do Cliente</DialogTitle>
          </DialogHeader>
          {selectedCustomer && (
            <DealDetails customer={selectedCustomer} onClose={() => setSelectedCustomer(null)} />
          )}
        </DialogContent>
      </Dialog>

      {customers.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">Nenhum cliente encontrado</h3>
            <p className="text-gray-500">
              {isAdmin || isManager 
                ? 'Comece adicionando o primeiro cliente ao sistema.' 
                : 'Você ainda não possui clientes cadastrados.'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CustomerManagement;
