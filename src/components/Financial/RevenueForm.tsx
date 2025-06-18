
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useRevenues, Revenue } from '@/hooks/useRevenues';
import { useFinancialCategories } from '@/hooks/useFinancialCategories';
import { format } from 'date-fns';

interface RevenueFormProps {
  revenue?: Revenue;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const RevenueForm: React.FC<RevenueFormProps> = ({ revenue, onSuccess, onCancel }) => {
  const { createRevenue, updateRevenue } = useRevenues();
  const { categories } = useFinancialCategories();
  
  const [formData, setFormData] = useState({
    description: revenue?.description || '',
    amount: revenue?.amount || 0,
    category_id: revenue?.category_id || '',
    type: revenue?.type || 'padrao' as const,
    date: revenue?.date || format(new Date(), 'yyyy-MM-dd'),
    is_confirmed: revenue?.is_confirmed || false,
    notes: revenue?.notes || '',
  });

  const [isLoading, setIsLoading] = useState(false);

  const revenueCategories = categories.filter(cat => cat.type === 'receita');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (revenue) {
        await updateRevenue(revenue.id, formData);
      } else {
        await createRevenue(formData);
      }
      onSuccess?.();
    } catch (error) {
      console.error('Error saving revenue:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{revenue ? 'Editar Receita' : 'Nova Receita'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Valor</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => handleInputChange('amount', parseFloat(e.target.value) || 0)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Categoria</Label>
              <Select
                value={formData.category_id}
                onValueChange={(value) => handleInputChange('category_id', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {revenueCategories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Tipo</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => handleInputChange('type', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="padrao">Padrão</SelectItem>
                  <SelectItem value="estimada">Estimada</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Data</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_confirmed"
                  checked={formData.is_confirmed}
                  onCheckedChange={(checked) => handleInputChange('is_confirmed', checked)}
                />
                <Label htmlFor="is_confirmed">Confirmada</Label>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Observações</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex gap-2">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Salvando...' : revenue ? 'Atualizar' : 'Criar'}
            </Button>
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default RevenueForm;
