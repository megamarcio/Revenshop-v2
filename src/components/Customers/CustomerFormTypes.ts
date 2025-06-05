
import { Customer } from '../../types/customer';

export interface CustomerFormProps {
  onSubmit: (customerData: Omit<Customer, "created_at" | "id" | "updated_at">) => Promise<void>;
  initialData?: Customer;
}
