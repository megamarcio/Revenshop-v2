
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { DollarSign } from 'lucide-react';
import { EditUserFormData } from './EditUserTypes';

interface EditUserCommissionSectionProps {
  form: UseFormReturn<EditUserFormData>;
}

const EditUserCommissionSection = ({ form }: EditUserCommissionSectionProps) => {
  return (
    <>
      <Separator className="my-6" />

      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center">
          <DollarSign className="h-5 w-5 mr-2" />
          Acordo de Comissão (USD)
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="commissionClientReferral"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Indicação de Cliente</FormLabel>
                <FormControl>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      {...field}
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      className="pl-10"
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="commissionClientBrought"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Levou Cliente</FormLabel>
                <FormControl>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      {...field}
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      className="pl-10"
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="commissionFullSale"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Venda Completa</FormLabel>
                <FormControl>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      {...field}
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      className="pl-10"
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </>
  );
};

export default EditUserCommissionSection;
