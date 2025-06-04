
export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  role: 'admin' | 'manager' | 'seller';
  photo?: string;
  facebook?: string;
  commission_client_referral?: number;
  commission_client_brought?: number;
  commission_full_sale?: number;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isManager: boolean;
  canEditVehicles: boolean;
  canManageUsers: boolean;
  canAccessAdmin: boolean;
  canEditBHPHSettings: boolean;
}
