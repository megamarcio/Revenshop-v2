import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useExpenseForecasts, type CreateExpenseForecastData, type ExpenseForecast } from '@/hooks/useExpenseForecasts';
import { useFinancialCategories } from '@/hooks/useFinancialCategories';

interface ExpenseForecastFormProps {
  forecast?: ExpenseForecast | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const ExpenseForecastForm: React.FC<ExpenseForecastFormProps> = ({
  forecast,
  onSuccess,
  onCancel,
}) => {
  const { createExpense, updateExpense } = useExpenseForecasts();
  const { categories } = useFinancialCategories();
  
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    type: 'fixa' as 'fixa' | 'variavel',
    category_id: null as string | null,
    due_day: 1,
    is_active: true,
    notes: '',
    import_category: '',
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (forecast) {
      setFormData({
        description: forecast.description || '',
        amount: forecast.amount.toString(),
        type: forecast.type,
        category_id: forecast.category_id || null,
        due_day: forecast.due_day || 1,
        is_active: forecast.is_active,
        notes: forecast.notes || '',
        import_category: forecast.import_category || '',
      });
    }
  }, [forecast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.description || !formData.amount) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    setIsLoading(true);

    try {
      const expenseData = {
        description: formData.description,
        amount: parseFloat(formData.amount),
        type: formData.type,
        category_id: formData.category_id,
        due_day: formData.due_day,
        is_active: formData.is_active,
        notes: formData.notes || null,
      };

      console.log('📝 Dados do formulário:', formData);
      console.log('💾 Dados a serem salvos:', expenseData);

      if (forecast) {
        console.log('✏️ Atualizando previsão...');
        await updateExpense(forecast.id, expenseData);
      } else {
        console.log('➕ Criando nova previsão...');
        await createExpense(expenseData);
      }
      
      console.log('✅ Previsão salva com sucesso!');
      onSuccess?.();
    } catch (error) {
      console.error('❌ Erro detalhado ao salvar previsão:', error);
      console.error('📊 Dados que causaram erro:', formData);
      alert(`Erro ao salvar previsão: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Gerar array de dias do mês (1-31)
  const dayOptions = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Descrição */}
        <div className="md:col-span-2">
          <Label htmlFor="description">Descrição *</Label>
          <Input
            id="description"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Ex: Seguro do veículo"
            required
          />
        </div>

        {/* Valor */}
        <div>
          <Label htmlFor="amount">Valor (USD) *</Label>
          <Input
            id="amount"
            type="number"
            step="0.01"
            min="0"
            value={formData.amount}
            onChange={(e) => handleInputChange('amount', e.target.value)}
            placeholder="0.00"
            required
          />
        </div>

        {/* Tipo */}
        <div>
          <Label htmlFor="type">Tipo de Despesa *</Label>
          <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fixa">Fixa</SelectItem>
              <SelectItem value="variavel">Variável</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Categoria */}
        <div>
          <Label htmlFor="category_id">Categoria *</Label>
          <Select value={formData.category_id || ''} onValueChange={(value) => handleInputChange('category_id', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione a categoria" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Categoria Importação */}
        <div>
          <Label htmlFor="import_category">Categoria Importação</Label>
          <Input
            id="import_category"
            value={formData.import_category}
            onChange={(e) => handleInputChange('import_category', e.target.value)}
            placeholder="Ex: UTILS, RENT, INSURANCE"
          />
        </div>

        {/* Dia de Vencimento */}
        <div>
          <Label htmlFor="due_day">Dia do Vencimento</Label>
          <Select 
            value={formData.due_day.toString()} 
            onValueChange={(value) => handleInputChange('due_day', parseInt(value))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o dia" />
            </SelectTrigger>
            <SelectContent>
              {dayOptions.map((day) => (
                <SelectItem key={day} value={day.toString()}>
                  Dia {day}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Status Ativo */}
        <div className="md:col-span-2">
          <div className="flex items-center space-x-2">
            <Switch
              id="is_active"
              checked={formData.is_active}
              onCheckedChange={(checked) => handleInputChange('is_active', checked)}
            />
            <Label htmlFor="is_active">Previsão ativa</Label>
          </div>
        </div>

        {/* Observações */}
        <div className="md:col-span-2">
          <Label htmlFor="notes">Observações</Label>
          <Textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => handleInputChange('notes', e.target.value)}
            placeholder="Informações adicionais sobre esta previsão..."
            rows={3}
          />
        </div>
      </div>

      {/* Botões */}
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Salvando...' : forecast ? 'Atualizar' : 'Criar Previsão'}
        </Button>
      </div>
    </form>
  );
};

export default ExpenseForecastForm; 