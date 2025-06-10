
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Save, X } from 'lucide-react';

interface WhatsAppGroup {
  id?: string;
  name: string;
  description: string;
  phone: string;
}

interface WhatsAppGroupFormProps {
  newGroup: WhatsAppGroup;
  isLoading: boolean;
  onSave: (group: WhatsAppGroup) => void;
  onCancel: () => void;
  onChange: (group: WhatsAppGroup) => void;
}

const WhatsAppGroupForm = ({
  newGroup,
  isLoading,
  onSave,
  onCancel,
  onChange
}: WhatsAppGroupFormProps) => {
  return (
    <Card className="border-dashed">
      <CardContent className="p-4 space-y-4">
        <h4 className="font-medium">Novo Grupo</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="new-name">Nome do Grupo *</Label>
            <Input
              id="new-name"
              value={newGroup.name}
              onChange={(e) => onChange({ ...newGroup, name: e.target.value })}
              placeholder="Ex: Vendas Orlando"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-phone">Telefone do Grupo *</Label>
            <Input
              id="new-phone"
              value={newGroup.phone}
              onChange={(e) => onChange({ ...newGroup, phone: e.target.value })}
              placeholder="Ex: +1234567890"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="new-description">Descrição</Label>
          <Textarea
            id="new-description"
            value={newGroup.description}
            onChange={(e) => onChange({ ...newGroup, description: e.target.value })}
            placeholder="Descrição do grupo..."
            rows={2}
          />
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={() => onSave(newGroup)}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            Salvar
          </Button>
          <Button 
            variant="outline" 
            onClick={onCancel}
            disabled={isLoading}
          >
            <X className="h-4 w-4" />
            Cancelar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default WhatsAppGroupForm;
