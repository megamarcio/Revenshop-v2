
import { useAuthState } from './useAuthState';
import { useAuthSession } from './useAuthSession';
import { useAuthPermissions } from './useAuthPermissions';
import { useAuthActions } from './useAuthActions';

export const useAuth = () => {
  const {
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
  } = useAuthState();

  const { fetchUserProfile } = useAuthSession(setUser, setLoading, clearUser);
  const { signIn, signUp, signOut } = useAuthActions(fetchUserProfile, clearUser);
  
  const permissions = useAuthPermissions(isAdmin, isManager, isSeller, isInternalSeller);

  return {
    user,
    loading,
    isAuthenticated,
    isAdmin,
    isManager,
    isInternalSeller,
    isSeller,
    ...permissions,
    signIn,
    signUp,
    signOut,
  };
};
