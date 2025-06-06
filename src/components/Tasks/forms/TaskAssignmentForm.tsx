
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface TaskAssignmentFormProps {
  vehicleId: string;
  assignedTo: string;
  dueDate: string;
  onVehicleChange: (value: string) => void;
  onAssignedToChange: (value: string) => void;
  onDueDateChange: (value: string) => void;
}

const TaskAssignmentForm = ({
  vehicleId,
  assignedTo,
  dueDate,
  onVehicleChange,
  onAssignedToChange,
  onDueDateChange
}: TaskAssignmentFormProps) => {
  // Buscar veículos para seleção
  const { data: vehicles } = useQuery({
    queryKey: ['vehicles-for-tasks'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vehicles')
        .select('id, name, internal_code')
        .eq('category', 'forSale')
        .order('name');

      if (error) throw error;
      return data;
    },
  });

  // Buscar usuários para delegação
  const { data: users } = useQuery({
    queryKey: ['users-for-tasks'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, role')
        .order('first_name');

      if (error) throw error;
      return data;
    },
  });

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="vehicle">Veículo (Opcional)</Label>
        <Select value={vehicleId} onValueChange={onVehicleChange}>
          <SelectTrigger>
            <SelectValue placeholder="Selecionar veículo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Nenhum veículo</SelectItem>
            {vehicles?.map((vehicle) => (
              <SelectItem key={vehicle.id} value={vehicle.id}>
                {vehicle.name} - {vehicle.internal_code}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="assigned_to">Responsável</Label>
        <Select value={assignedTo} onValueChange={onAssignedToChange}>
          <SelectTrigger>
            <SelectValue placeholder="Selecionar responsável" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="unassigned">Não atribuída</SelectItem>
            {users?.map((user) => (
              <SelectItem key={user.id} value={user.id}>
                {user.first_name} {user.last_name} ({user.role})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="due_date">Data de Vencimento</Label>
        <Input
          id="due_date"
          type="date"
          value={dueDate}
          onChange={(e) => onDueDateChange(e.target.value)}
        />
      </div>
    </>
  );
};

export default TaskAssignmentForm;
