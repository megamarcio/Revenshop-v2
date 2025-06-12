
import React from 'react';
import { useWhatsAppGroups } from '@/hooks/useWhatsAppGroups';
import WhatsAppGroupsList from './WhatsAppGroupsList';
import WhatsAppWebhookSettings from './WhatsAppWebhookSettings';

const WhatsAppIntegration = () => {
  const {
    groups,
    isLoading,
    isLoadingGroups,
    editingGroup,
    newGroup,
    isAddingGroup,
    setIsAddingGroup,
    setNewGroup,
    setEditingGroup,
    saveGroup,
    deleteGroup,
    handleEdit,
    handleCancelEdit
  } = useWhatsAppGroups();

  if (isLoadingGroups) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-muted-foreground">Carregando grupos...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <WhatsAppGroupsList
        groups={groups}
        isLoading={isLoading}
        editingGroup={editingGroup}
        newGroup={newGroup}
        isAddingGroup={isAddingGroup}
        onAddGroup={() => setIsAddingGroup(true)}
        onSaveGroup={saveGroup}
        onEditGroup={handleEdit}
        onDeleteGroup={deleteGroup}
        onCancelEdit={handleCancelEdit}
        onNewGroupChange={setNewGroup}
        onEditingGroupChange={setEditingGroup}
      />

      <WhatsAppWebhookSettings />
    </div>
  );
};

export default WhatsAppIntegration;
