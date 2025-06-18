
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { useRevenues } from '@/hooks/useRevenues';
import RevenueForm from './RevenueForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const RevenueManagement = () => {
  const { revenues, deleteRevenue, refetch } = useRevenues();
  const [selectedRevenue, setSelectedRevenue] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [showConfirmed, setShowConfirmed] = useState(true);

  const filteredRevenues = revenues.filter(revenue => 
    showConfirmed ? true : !revenue.is_confirmed
  );

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  const handleEdit = (revenue: any) => {
    setSelectedRevenue(revenue);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta receita?')) {
      await deleteRevenue(id);
    }
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    setSelectedRevenue(null);
    refetch();
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'padrao': return 'bg-blue-100 text-blue-800';
      case 'estimada': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Receitas</h2>
          <p className="text-muted-foreground">Gerencie suas receitas e previsões</p>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowConfirmed(!showConfirmed)}
          >
            {showConfirmed ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
            {showConfirmed ? 'Ocultar Confirmadas' : 'Mostrar Todas'}
          </Button>
          
          <Button onClick={() => setIsFormOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nova Receita
          </Button>
        </div>
      </div>

      <div className="grid gap-4">
        {filteredRevenues.map((revenue) => (
          <Card key={revenue.id}>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold">{revenue.description}</h3>
                    <Badge className={getTypeColor(revenue.type)}>
                      {revenue.type}
                    </Badge>
                    {revenue.is_confirmed && (
                      <Badge variant="outline" className="bg-green-100 text-green-800">
                        Confirmada
                      </Badge>
                    )}
                  </div>
                  
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>Data: {format(new Date(revenue.date), 'dd/MM/yyyy', { locale: ptBR })}</p>
                    {revenue.category && <p>Categoria: {revenue.category.name}</p>}
                    {revenue.notes && <p>Obs: {revenue.notes}</p>}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-lg font-bold text-green-600">
                      {formatCurrency(revenue.amount)}
                    </div>
                  </div>

                  <div className="flex gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(revenue)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(revenue.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredRevenues.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">Nenhuma receita encontrada</p>
            </CardContent>
          </Card>
        )}
      </div>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedRevenue ? 'Editar Receita' : 'Nova Receita'}
            </DialogTitle>
          </DialogHeader>
          <RevenueForm
            revenue={selectedRevenue}
            onSuccess={handleFormSuccess}
            onCancel={() => {
              setIsFormOpen(false);
              setSelectedRevenue(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RevenueManagement;
