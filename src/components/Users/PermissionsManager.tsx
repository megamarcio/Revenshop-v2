import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ShieldCheck, ShieldX, User, CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRolePermissions } from "@/hooks/useRolePermissions";
import { toast } from "@/hooks/use-toast";

const screenPermissions = [
  { id: "dashboard", label: "Dashboard" },
  { id: "vehicles", label: "Veículos" },
  { id: "customers", label: "Clientes" },
  { id: "auctions", label: "Leilões" },
  { id: "tasks", label: "Tarefas" },
  { id: "maintenance", label: "Manutenção" },
  { id: "ai-beta", label: "IA (beta)" },
  { id: "bhph", label: "Buy Here Pay Here" },
  { id: "financing", label: "Simulador de Financiamento" },
  { id: "logistica", label: "Logística" },
  { id: "users", label: "Lista de Usuários" },
  { id: "permissions", label: "Gerenciar Permissões" },
  { id: "profile", label: "Perfil" },
  { id: "admin", label: "Painel Admin" },
];

const roles = [
  { id: "admin", label: "Administrador" },
  { id: "manager", label: "Gerente" },
  { id: "internal_seller", label: "Vendedor Interno" },
  { id: "seller", label: "Vendedor" },
];

const PermissionsManager: React.FC = () => {
  const [selectedRole, setSelectedRole] = React.useState<"admin" | "manager" | "internal_seller" | "seller">("admin");
  const { permissions, loading, addPermission, removePermission, updatePermissions, setPermissions } = useRolePermissions(selectedRole);

  // Toggle de permissão na tela (adição/remoção)
  const handleTogglePermission = async (screenId: string) => {
    const has = permissions.includes(screenId as any);
    if (has) {
      await removePermission(screenId as any);
      toast({ title: "Permissão removida!", description: `Permissão para ${screenPermissions.find(x => x.id === screenId)?.label} removida da role.` });
    } else {
      await addPermission(screenId as any);
      toast({ title: "Permissão concedida!", description: `Permissão para ${screenPermissions.find(x => x.id === screenId)?.label} adicionada.` });
    }
  };

  // Salvar todas permissões (não é obrigatório pois já salva ao clicar)
  const handleSave = async () => {
    await updatePermissions(permissions);
    toast({ title: "Permissões atualizadas!", description: "Permissões salvas com sucesso." });
  };

  // Adiciona loading visual para UX
  return (
    <div className="p-4 max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <ShieldCheck className="w-5 h-5" />
            Gerenciar Permissões por Função
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex flex-col gap-2 w-full sm:w-1/3 bg-muted rounded-md p-2">
              <span className="mb-2 text-xs font-semibold text-muted-foreground">Selecionar Papel</span>
              {roles.map(role => (
                <Button
                  key={role.id}
                  variant={selectedRole === role.id ? "default" : "outline"}
                  className="w-full"
                  onClick={() => setSelectedRole(role.id as any)}
                  size="sm"
                  disabled={loading}
                >
                  <User className="mr-2 w-4 h-4" />
                  {role.label}
                </Button>
              ))}
            </div>
            <div className="flex-1 flex flex-col gap-3">
              <span className="mb-2 text-xs font-semibold text-muted-foreground">Permissões para: {roles.find(r => r.id === selectedRole)?.label}</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {screenPermissions.map(sp => {
                  const hasPermission = permissions.includes(sp.id as any);
                  return (
                    <Button
                      type="button"
                      key={sp.id}
                      variant={hasPermission ? "default" : "outline"}
                      className={`flex items-center gap-2 ${hasPermission ? 'bg-green-500 text-white hover:bg-green-600' : 'opacity-80'}`}
                      size="sm"
                      onClick={() => handleTogglePermission(sp.id)}
                      disabled={loading}
                    >
                      {hasPermission ? <CheckCircle className="w-4 h-4 text-white" /> : <ShieldX className="w-4 h-4 text-muted-foreground" />}
                      {sp.label}
                    </Button>
                  );
                })}
              </div>
              <div className="mt-4 flex justify-end">
                <Button onClick={handleSave} disabled={loading} className="bg-revenshop-primary" type="button">
                  {loading ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : null}
                  Salvar Permissões
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PermissionsManager;
