
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ShieldCheck, ShieldX, User, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const screenPermissions = [
  { id: "dashboard", label: "Dashboard" },
  { id: "users", label: "Usuários" },
  { id: "profile", label: "Perfil" },
  { id: "auctions", label: "Leilões" },
  { id: "vehicles", label: "Veículos" },
  { id: "customers", label: "Clientes" },
  { id: "maintenance", label: "Manutenção" },
  { id: "settings", label: "Configurações" },
];

const roles = [
  { id: "admin", label: "Administrador" },
  { id: "manager", label: "Gerente" },
  { id: "internal_seller", label: "Vendedor Interno" },
  { id: "seller", label: "Vendedor" },
];

// Mock de permissões (por enquanto; ajuste conforme persistência futura)
const initialPermissions: Record<string, string[]> = {
  admin: screenPermissions.map(sp => sp.id),
  manager: ["dashboard", "users", "profile", "auctions", "vehicles", "customers", "maintenance", "settings"],
  internal_seller: ["dashboard", "profile", "auctions", "vehicles", "customers"],
  seller: ["dashboard", "profile", "auctions", "vehicles"],
};

const PermissionsManager: React.FC = () => {
  const [selectedRole, setSelectedRole] = React.useState("admin");
  const [permissions, setPermissions] = React.useState(initialPermissions);

  const handleTogglePermission = (screenId: string) => {
    setPermissions(prev => {
      const current = prev[selectedRole] || [];
      const has = current.includes(screenId);
      return {
        ...prev,
        [selectedRole]: has
          ? current.filter(p => p !== screenId)
          : [...current, screenId],
      };
    });
  };

  // Futuramente, enviar para backend. Aqui só mock.
  const handleSave = () => {
    // Salvar permissões aqui
    alert("Permissões salvas! (futuro: persistir no banco de dados)");
  };

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
                  onClick={() => setSelectedRole(role.id)}
                  size="sm"
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
                  const hasPermission = permissions[selectedRole]?.includes(sp.id);
                  return (
                    <Button
                      type="button"
                      key={sp.id}
                      variant={hasPermission ? "default" : "outline"}
                      className={`flex items-center gap-2 ${hasPermission ? 'bg-green-500 text-white hover:bg-green-600' : 'opacity-80'}`}
                      size="sm"
                      onClick={() => handleTogglePermission(sp.id)}
                    >
                      {hasPermission ? <CheckCircle className="w-4 h-4 text-white" /> : <ShieldX className="w-4 h-4 text-muted-foreground" />}
                      {sp.label}
                    </Button>
                  );
                })}
              </div>
              <div className="mt-4 flex justify-end">
                <Button onClick={handleSave} className="bg-revenshop-primary">Salvar Permissões</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PermissionsManager;
