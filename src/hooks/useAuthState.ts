
import { useState } from 'react';
import type { User } from '@/types/auth';

export const useAuthState = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const clearUser = () => {
    setUser(null);
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin';
  const isManager = user?.role === 'manager';
  const isInternalSeller = user?.role === 'internal_seller';
  const isSeller = user?.role === 'seller';

  return {
    user,
    setUser,
    loading,
    setLoading,
    clearUser,
    isAuthenticated,
    isAdmin,
    isManager,
    isInternalSeller,
    isSeller,
  };
};
