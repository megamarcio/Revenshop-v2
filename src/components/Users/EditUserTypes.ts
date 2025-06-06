
import * as z from 'zod';

export const editUserSchema = z.object({
  firstName: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  lastName: z.string().min(2, 'Sobrenome deve ter pelo menos 2 caracteres'),
  email: z.string().email('E-mail inválido'),
  phone: z.string().min(10, 'Telefone deve ter pelo menos 10 dígitos'),
  facebook: z.string().url('URL do Facebook inválida').optional().or(z.literal('')),
  role: z.enum(['admin', 'manager', 'seller', 'internal_seller']),
  commissionClientReferral: z.number().min(0, 'Valor deve ser positivo'),
  commissionClientBrought: z.number().min(0, 'Valor deve ser positivo'),
  commissionFullSale: z.number().min(0, 'Valor deve ser positivo')
});

export type EditUserFormData = z.infer<typeof editUserSchema>;

export interface EditUserFormProps {
  user: any;
  onSubmit: (data: EditUserFormData) => void;
  isLoading?: boolean;
}
