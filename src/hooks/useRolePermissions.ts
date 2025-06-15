
import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

// Tipos das roles e telas
export type RoleType = "admin" | "manager" | "internal_seller" | "seller";
export type ScreenIdType =
  | "dashboard"
  | "vehicles"
  | "customers"
  | "auctions"
  | "tasks"
  | "maintenance"
  | "ai-beta"
  | "bhph"
  | "financing"
  | "logistica"
  | "users"
  | "permissions"
  | "profile"
  | "admin";

export interface RolePermission {
  id: string;
  role: RoleType;
  screen_id: ScreenIdType;
  created_at: string;
}

export function useRolePermissions(selectedRole: RoleType) {
  const [permissions, setPermissions] = useState<ScreenIdType[]>([]);
  const [loading, setLoading] = useState(false);

  // Buscar permissões da role selecionada
  const fetchPermissions = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("role_permissions")
      .select("id, screen_id")
      .eq("role", selectedRole);

    if (error) {
      setLoading(false);
      return;
    }

    // Corrigir o cast para garantir tipos corretos
    setPermissions((data?.map(p => p.screen_id) ?? []) as ScreenIdType[]);
    setLoading(false);
  }, [selectedRole]);

  useEffect(() => {
    fetchPermissions();
  }, [fetchPermissions]);

  // Adiciona permissão para a role
  const addPermission = async (screen_id: ScreenIdType) => {
    setLoading(true);
    const { error } = await supabase
      .from("role_permissions")
      .insert([{ role: selectedRole, screen_id }]);
    setLoading(false);
    if (!error) fetchPermissions();
  };

  // Remove permissão da role
  const removePermission = async (screen_id: ScreenIdType) => {
    setLoading(true);
    const { error } = await supabase
      .from("role_permissions")
      .delete()
      .eq("role", selectedRole)
      .eq("screen_id", screen_id);
    setLoading(false);
    if (!error) fetchPermissions();
  };

  // Atualiza as permissões em lote (remove tudo e insere selecionadas)
  const updatePermissions = async (newPermissions: ScreenIdType[]) => {
    setLoading(true);
    // Remover todas as permissões atuais da role
    await supabase.from("role_permissions").delete().eq("role", selectedRole);
    // Inserir as novas permissões
    if (newPermissions.length > 0) {
      await supabase
        .from("role_permissions")
        .insert(newPermissions.map(screen_id => ({ role: selectedRole, screen_id })));
    }
    setLoading(false);
    fetchPermissions();
  };

  return {
    permissions,
    loading,
    addPermission,
    removePermission,
    updatePermissions,
    refetch: fetchPermissions,
    setPermissions,
  };
}
