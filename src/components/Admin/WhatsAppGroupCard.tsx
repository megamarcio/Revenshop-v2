
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Edit, Trash2, Save, X } from 'lucide-react';

interface WhatsAppGroup {
  id?: string;
  name: string;
  description: string;
  phone: string;
}

interface WhatsAppGroupCardProps {
  group: WhatsAppGroup;
  isEditing: boolean;
  editingGroup: WhatsAppGroup | null;
  isLoading: boolean;
  onEdit: (group: WhatsAppGroup) => void;
  onSave: (group: WhatsAppGroup) => void;
  onDelete: (id: string) => void;
  onCancel: () => void;
  onEditingChange: (group: WhatsAppGroup) => void;
}

const WhatsAppGroupCard = ({
  group,
  isEditing,
  editingGroup,
  isLoading,
  onEdit,
  onSave,
  onDelete,
  onCancel,
  onEditingChange
}: WhatsAppGroupCardProps) => {
  return (
    <Card>
      <CardContent className="p-4">
        {isEditing ? (
          // Modo de edição
          <div className="space-y-4">
            <h4 className="font-medium">Editando Grupo</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nome do Grupo *</Label>
                <Input
                  value={editingGroup?.name || ''}
                  onChange={(e) => onEditingChange({ ...editingGroup!, name: e.target.value })}
                  placeholder="Ex: Vendas Orlando"
                />
              </div>
              <div className="space-y-2">
                <Label>Telefone do Grupo *</Label>
                <Input
                  value={editingGroup?.phone || ''}
                  onChange={(e) => onEditingChange({ ...editingGroup!, phone: e.target.value })}
                  placeholder="Ex: +1234567890"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Descrição</Label>
              <Textarea
                value={editingGroup?.description || ''}
                onChange={(e) => onEditingChange({ ...editingGroup!, description: e.target.value })}
                placeholder="Descrição do grupo..."
                rows={2}
              />
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={() => onSave(editingGroup!)}
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
          </div>
        ) : (
          // Modo de visualização
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h4 className="font-medium">{group.name}</h4>
              <p className="text-sm text-muted-foreground">{group.phone}</p>
              {group.description && (
                <p className="text-sm text-muted-foreground mt-1">{group.description}</p>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(group)}
                disabled={isLoading}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDelete(group.id!)}
                disabled={isLoading}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WhatsAppGroupCard;
