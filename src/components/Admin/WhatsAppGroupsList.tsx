
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle, Plus } from 'lucide-react';
import WhatsAppGroupCard from './WhatsAppGroupCard';
import WhatsAppGroupForm from './WhatsAppGroupForm';

interface WhatsAppGroup {
  id?: string;
  name: string;
  description: string;
  phone: string;
}

interface WhatsAppGroupsListProps {
  groups: WhatsAppGroup[];
  isLoading: boolean;
  editingGroup: WhatsAppGroup | null;
  newGroup: WhatsAppGroup;
  isAddingGroup: boolean;
  onAddGroup: () => void;
  onSaveGroup: (group: WhatsAppGroup) => void;
  onEditGroup: (group: WhatsAppGroup) => void;
  onDeleteGroup: (id: string) => void;
  onCancelEdit: () => void;
  onNewGroupChange: (group: WhatsAppGroup) => void;
  onEditingGroupChange: (group: WhatsAppGroup) => void;
}

const WhatsAppGroupsList = ({
  groups,
  isLoading,
  editingGroup,
  newGroup,
  isAddingGroup,
  onAddGroup,
  onSaveGroup,
  onEditGroup,
  onDeleteGroup,
  onCancelEdit,
  onNewGroupChange,
  onEditingGroupChange
}: WhatsAppGroupsListProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MessageCircle className="h-5 w-5" />
            <span>Grupos do WhatsApp</span>
          </div>
          <Button 
            onClick={onAddGroup}
            disabled={isAddingGroup || editingGroup !== null}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Adicionar Grupo
          </Button>
        </CardTitle>
        <CardDescription>
          Gerencie os grupos do WhatsApp para integração com o sistema
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Formulário para novo grupo */}
        {isAddingGroup && (
          <WhatsAppGroupForm
            newGroup={newGroup}
            isLoading={isLoading}
            onSave={onSaveGroup}
            onCancel={onCancelEdit}
            onChange={onNewGroupChange}
          />
        )}

        {/* Lista de grupos */}
        <div className="space-y-3">
          {groups.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Nenhum grupo cadastrado. Clique em "Adicionar Grupo" para começar.
            </div>
          ) : (
            groups.map((group) => (
              <WhatsAppGroupCard
                key={group.id}
                group={group}
                isEditing={editingGroup?.id === group.id}
                editingGroup={editingGroup}
                isLoading={isLoading}
                onEdit={onEditGroup}
                onSave={onSaveGroup}
                onDelete={onDeleteGroup}
                onCancel={onCancelEdit}
                onEditingChange={onEditingGroupChange}
              />
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default WhatsAppGroupsList;
