
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
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h2 className="text-xl font-bold">Receitas</h2>
          <p className="text-sm text-muted-foreground">Gerencie suas receitas e previsões</p>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowConfirmed(!showConfirmed)}
          >
            {showConfirmed ? <EyeOff className="h-3 w-3 mr-1" /> : <Eye className="h-3 w-3 mr-1" />}
            {showConfirmed ? 'Ocultar Confirmadas' : 'Mostrar Todas'}
          </Button>
          
          <Button onClick={() => setIsFormOpen(true)} size="sm">
            <Plus className="h-3 w-3 mr-1" />
            Nova Receita
          </Button>
        </div>
      </div>

      <div className="grid gap-3">
        {filteredRevenues.map((revenue) => (
          <Card key={revenue.id} className="text-sm">
            <CardContent className="p-3">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1.5">
                    <h3 className="font-medium text-sm">{revenue.description}</h3>
                    <Badge className={`${getTypeColor(revenue.type)} text-xs px-1.5 py-0.5`}>
                      {revenue.type}
                    </Badge>
                    {revenue.is_confirmed && (
                      <Badge variant="outline" className="bg-green-100 text-green-800 text-xs px-1.5 py-0.5">
                        Confirmada
                      </Badge>
                    )}
                  </div>
                  
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p>Data: {format(new Date(revenue.date), 'dd/MM/yyyy', { locale: ptBR })}</p>
                    {revenue.category && <p>Categoria: {revenue.category.name}</p>}
                    {revenue.notes && <p>Obs: {revenue.notes}</p>}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-base font-bold text-green-600">
                      {formatCurrency(revenue.amount)}
                    </div>
                  </div>

                  <div className="flex gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 w-7 p-0"
                      onClick={() => handleEdit(revenue)}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 w-7 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleDelete(revenue.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredRevenues.length === 0 && (
          <Card className="text-sm">
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">Nenhuma receita encontrada</p>
            </CardContent>
          </Card>
        )}
      </div>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg">
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
