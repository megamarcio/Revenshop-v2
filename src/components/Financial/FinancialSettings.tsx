
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useFinancialCategories } from '@/hooks/useFinancialCategories';

const FinancialSettings = () => {
  const { categories, createCategory, updateCategory, deleteCategory } = useFinancialCategories();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'despesa' as const,
    is_default: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (selectedCategory) {
        await updateCategory(selectedCategory.id, formData);
      } else {
        await createCategory(formData);
      }
      handleCloseForm();
    } catch (error) {
      console.error('Error saving category:', error);
    }
  };

  const handleEdit = (category: any) => {
    setSelectedCategory(category);
    setFormData({
      name: category.name,
      type: category.type,
      is_default: category.is_default,
    });
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta categoria?')) {
      await deleteCategory(id);
    }
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setSelectedCategory(null);
    setFormData({
      name: '',
      type: 'despesa',
      is_default: false,
    });
  };

  const revenueCategories = categories.filter(cat => cat.type === 'receita');
  const expenseCategories = categories.filter(cat => cat.type === 'despesa');

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h2 className="text-xl font-bold">Configurações Financeiras</h2>
          <p className="text-sm text-muted-foreground">Gerencie categorias de receitas e despesas</p>
        </div>
        
        <Button onClick={() => setIsFormOpen(true)} size="sm">
          <Plus className="h-3 w-3 mr-1" />
          Nova Categoria
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="text-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base text-green-600">Categorias de Receitas</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-1.5">
              {revenueCategories.map((category) => (
                <div key={category.id} className="flex items-center justify-between p-2 border rounded-md">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{category.name}</span>
                    {category.is_default && (
                      <Badge variant="outline" className="text-xs px-1.5 py-0.5">Padrão</Badge>
                    )}
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 w-7 p-0"
                      onClick={() => handleEdit(category)}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    {!category.is_default && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 w-7 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleDelete(category.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
              {revenueCategories.length === 0 && (
                <p className="text-center text-sm text-muted-foreground py-4">Nenhuma categoria de receita</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="text-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base text-red-600">Categorias de Despesas</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-1.5">
              {expenseCategories.map((category) => (
                <div key={category.id} className="flex items-center justify-between p-2 border rounded-md">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{category.name}</span>
                    {category.is_default && (
                      <Badge variant="outline" className="text-xs px-1.5 py-0.5">Padrão</Badge>
                    )}
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 w-7 p-0"
                      onClick={() => handleEdit(category)}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    {!category.is_default && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 w-7 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleDelete(category.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
              {expenseCategories.length === 0 && (
                <p className="text-center text-sm text-muted-foreground py-4">Nenhuma categoria de despesa</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg">
              {selectedCategory ? 'Editar Categoria' : 'Nova Categoria'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-sm">Nome da Categoria</Label>
              <Input
                id="name"
                className="h-9"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="type" className="text-sm">Tipo</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData(prev => ({ ...prev, type: value as any }))}
              >
                <SelectTrigger className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="receita">Receita</SelectItem>
                  <SelectItem value="despesa">Despesa</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2 pt-2">
              <Button type="submit" size="sm">
                {selectedCategory ? 'Atualizar' : 'Criar'}
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={handleCloseForm}>
                Cancelar
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FinancialSettings;
