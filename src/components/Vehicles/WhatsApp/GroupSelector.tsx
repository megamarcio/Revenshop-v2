
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface WhatsAppGroup {
  id: string;
  name: string;
  phone: string;
}

interface GroupSelectorProps {
  groups: WhatsAppGroup[];
  selectedGroup: string;
  onGroupChange: (value: string) => void;
}

const GroupSelector = ({ groups, selectedGroup, onGroupChange }: GroupSelectorProps) => {
  return (
    <div className="space-y-2">
      <Label>Selecionar Grupo</Label>
      <Select value={selectedGroup} onValueChange={onGroupChange}>
        <SelectTrigger>
          <SelectValue placeholder="Escolha um grupo..." />
        </SelectTrigger>
        <SelectContent>
          {groups.map((group) => (
            <SelectItem key={group.id} value={group.id}>
              {group.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default GroupSelector;
