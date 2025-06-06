
export const useAuthPermissions = (
  isAdmin: boolean,
  isManager: boolean,
  isSeller: boolean,
  isInternalSeller: boolean
) => {
  const canEditVehicles = isAdmin || isManager || isInternalSeller;
  const canEditCustomers = isAdmin || isManager;
  const canManageUsers = isAdmin || isManager;
  const canAccessAdmin = isAdmin || isManager;
  const canEditBHPHSettings = isAdmin;
  const canViewCostPrices = isAdmin || isManager;
  const canAccessAuctions = isAdmin || isManager || isSeller;
  const canViewAllTasks = isAdmin || isManager;
  const canViewAllCustomers = isAdmin || isManager;
  const canViewBHPHDetails = isAdmin || isManager;
  const canAccessDashboard = isAdmin || isManager || isSeller || isInternalSeller;

  return {
    canEditVehicles,
    canEditCustomers,
    canManageUsers,
    canAccessAdmin,
    canEditBHPHSettings,
    canViewCostPrices,
    canAccessAuctions,
    canViewAllTasks,
    canViewAllCustomers,
    canViewBHPHDetails,
    canAccessDashboard,
  };
};
