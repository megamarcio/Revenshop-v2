
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { EditUserFormData } from './EditUserTypes';

interface EditUserRoleSectionProps {
  form: UseFormReturn<EditUserFormData>;
  isAdmin: boolean;
}

const EditUserRoleSection = ({ form, isAdmin }: EditUserRoleSectionProps) => {
  if (!isAdmin) return null;

  return (
    <FormField
      control={form.control}
      name="role"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Tipo de Usuário</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo de usuário" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="seller">Vendedor</SelectItem>
              <SelectItem value="internal_seller">Vendedor Interno</SelectItem>
              <SelectItem value="manager">Gerente</SelectItem>
              <SelectItem value="admin">Administrador</SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default EditUserRoleSection;
