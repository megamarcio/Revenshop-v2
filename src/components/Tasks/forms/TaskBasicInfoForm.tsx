
import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface TaskBasicInfoFormProps {
  title: string;
  description: string;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
}

const TaskBasicInfoForm = ({ 
  title, 
  description, 
  onTitleChange, 
  onDescriptionChange 
}: TaskBasicInfoFormProps) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="title">Título *</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Ex: Trocar óleo do motor"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descrição</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          placeholder="Detalhes da tarefa..."
          rows={3}
        />
      </div>
    </>
  );
};

export default TaskBasicInfoForm;
