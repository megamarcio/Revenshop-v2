
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Software {
  id: string;
  name: string;
  description?: string;
  cost: number;
  payment_type: 'unico' | 'mensal' | 'anual' | 'bianual' | 'trianual';
  purchase_date?: string;
  next_payment_date?: string;
  is_active: boolean;
  vendor?: string;
  license_key?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

const SoftwareManagement = () => {
  const [software, setSoftware] = useState<Software[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedSoftware, setSelectedSoftware] = useState<Software | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    cost: 0,
    payment_type: 'mensal' as const,
    purchase_date: '',
    next_payment_date: '',
    is_active: true,
    vendor: '',
    license_key: '',
    notes: '',
  });

  const fetchSoftware = async () => {
    try {
      const { data, error } = await supabase
        .from('company_software')
        .select('*')
        .order('name');

      if (error) throw error;
      setSoftware(data || []);
    } catch (error) {
      console.error('Error fetching software:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao carregar software',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const dataToSubmit = {
        ...formData,
        purchase_date: formData.purchase_date || null,
        next_payment_date: formData.next_payment_date || null,
        description: formData.description || null,
        vendor: formData.vendor || null,
        license_key: formData.license_key || null,
        notes: formData.notes || null,
      };

      if (selectedSoftware) {
        const { error } = await supabase
          .from('company_software')
          .update(dataToSubmit)
          .eq('id', selectedSoftware.id);

        if (error) throw error;
        toast({
          title: 'Sucesso',
          description: 'Software atualizado com sucesso',
        });
      } else {
        const { error } = await supabase
          .from('company_software')
          .insert([dataToSubmit]);

        if (error) throw error;
        toast({
          title: 'Sucesso',
          description: 'Software cadastrado com sucesso',
        });
      }

      handleCloseForm();
      fetchSoftware();
    } catch (error) {
      console.error('Error saving software:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao salvar software',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (software: Software) => {
    setSelectedSoftware(software);
    setFormData({
      name: software.name,
      description: software.description || '',
      cost: software.cost,
      payment_type: software.payment_type,
      purchase_date: software.purchase_date || '',
      next_payment_date: software.next_payment_date || '',
      is_active: software.is_active,
      vendor: software.vendor || '',
      license_key: software.license_key || '',
      notes: software.notes || '',
    });
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este software?')) {
      try {
        const { error } = await supabase
          .from('company_software')
          .delete()
          .eq('id', id);

        if (error) throw error;
        
        toast({
          title: 'Sucesso',
          description: 'Software removido com sucesso',
        });
        fetchSoftware();
      } catch (error) {
        console.error('Error deleting software:', error);
        toast({
          title: 'Erro',
          description: 'Erro ao remover software',
          variant: 'destructive',
        });
      }
    }
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setSelectedSoftware(null);
    setFormData({
      name: '',
      description: '',
      cost: 0,
      payment_type: 'mensal',
      purchase_date: '',
      next_payment_date: '',
      is_active: true,
      vendor: '',
      license_key: '',
      notes: '',
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  const getPaymentTypeLabel = (type: string) => {
    switch (type) {
      case 'unico': return 'Único';
      case 'mensal': return 'Mensal';
      case 'anual': return 'Anual';
      case 'bianual': return 'Bianual';
      case 'trianual': return 'Trianual';
      default: return type;
    }
  };

  const getPaymentTypeColor = (type: string) => {
    switch (type) {
      case 'unico': return 'bg-gray-100 text-gray-800';
      case 'mensal': return 'bg-blue-100 text-blue-800';
      case 'anual': return 'bg-green-100 text-green-800';
      case 'bianual': return 'bg-yellow-100 text-yellow-800';
      case 'trianual': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  useEffect(() => {
    fetchSoftware();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Software & Licenças</h2>
          <p className="text-muted-foreground">Gerencie software e licenças da empresa</p>
        </div>
        
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Software
        </Button>
      </div>

      <div className="grid gap-4">
        {software.map((item) => (
          <Card key={item.id}>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold">{item.name}</h3>
                    <Badge className={getPaymentTypeColor(item.payment_type)}>
                      {getPaymentTypeLabel(item.payment_type)}
                    </Badge>
                    {!item.is_active && (
                      <Badge variant="secondary">Inativo</Badge>
                    )}
                  </div>
                  
                  <div className="text-sm text-muted-foreground space-y-1">
                    {item.description && <p>{item.description}</p>}
                    {item.vendor && <p>Fornecedor: {item.vendor}</p>}
                    {item.purchase_date && (
                      <p>Compra: {format(new Date(item.purchase_date), 'dd/MM/yyyy', { locale: ptBR })}</p>
                    )}
                    {item.next_payment_date && (
                      <p>Próximo pagamento: {format(new Date(item.next_payment_date), 'dd/MM/yyyy', { locale: ptBR })}</p>
                    )}
                    {item.license_key && <p>Licença: {item.license_key}</p>}
                    {item.notes && <p>Obs: {item.notes}</p>}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-lg font-bold">
                      {formatCurrency(item.cost)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {getPaymentTypeLabel(item.payment_type)}
                    </div>
                  </div>

                  <div className="flex gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(item)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {software.length === 0 && !isLoading && (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">Nenhum software cadastrado</p>
            </CardContent>
          </Card>
        )}
      </div>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedSoftware ? 'Editar Software' : 'Novo Software'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="vendor">Fornecedor</Label>
                <Input
                  id="vendor"
                  value={formData.vendor}
                  onChange={(e) => setFormData(prev => ({ ...prev, vendor: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cost">Custo *</Label>
                <Input
                  id="cost"
                  type="number"
                  step="0.01"
                  value={formData.cost}
                  onChange={(e) => setFormData(prev => ({ ...prev, cost: parseFloat(e.target.value) || 0 }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="payment_type">Tipo de Pagamento *</Label>
                <Select
                  value={formData.payment_type}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, payment_type: value as any }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unico">Único</SelectItem>
                    <SelectItem value="mensal">Mensal</SelectItem>
                    <SelectItem value="anual">Anual</SelectItem>
                    <SelectItem value="bianual">Bianual</SelectItem>
                    <SelectItem value="trianual">Trianual</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="purchase_date">Data de Compra</Label>
                <Input
                  id="purchase_date"
                  type="date"
                  value={formData.purchase_date}
                  onChange={(e) => setFormData(prev => ({ ...prev, purchase_date: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="next_payment_date">Próximo Pagamento</Label>
                <Input
                  id="next_payment_date"
                  type="date"
                  value={formData.next_payment_date}
                  onChange={(e) => setFormData(prev => ({ ...prev, next_payment_date: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="license_key">Chave de Licença</Label>
                <Input
                  id="license_key"
                  value={formData.license_key}
                  onChange={(e) => setFormData(prev => ({ ...prev, license_key: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
                  />
                  <Label htmlFor="is_active">Ativo</Label>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Observações</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                rows={2}
              />
            </div>

            <div className="flex gap-2">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Salvando...' : selectedSoftware ? 'Atualizar' : 'Criar'}
              </Button>
              <Button type="button" variant="outline" onClick={handleCloseForm}>
                Cancelar
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SoftwareManagement;
