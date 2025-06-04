
import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, User, Shield } from 'lucide-react';
import UserForm from './UserForm';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: 'admin' | 'seller';
  createdAt: string;
}

// Mock data para demonstração
const mockUsers: User[] = [
  {
    id: '1',
    firstName: 'Admin',
    lastName: 'Sistema',
    email: 'admin@revenshop.com',
    phone: '+55 11 99999-9999',
    role: 'admin',
    createdAt: '2024-01-01'
  },
  {
    id: '2',
    firstName: 'João',
    lastName: 'Silva',
    email: 'joao@revenshop.com',
    phone: '+55 11 88888-8888',
    role: 'seller',
    createdAt: '2024-01-02'
  },
  {
    id: '3',
    firstName: 'Maria',
    lastName: 'Santos',
    email: 'maria@revenshop.com',
    phone: '+55 11 77777-7777',
    role: 'seller',
    createdAt: '2024-01-03'
  }
];

const UserManagement = () => {
  const { t } = useLanguage();
  const { isAdmin } = useAuth();
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateUser = async (userData: any) => {
    setIsLoading(true);
    
    try {
      // Simular criação de usuário
      const newUser: User = {
        id: Date.now().toString(),
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        phone: userData.phone,
        role: userData.role,
        createdAt: new Date().toISOString().split('T')[0]
      };

      setUsers(prev => [...prev, newUser]);
      setIsDialogOpen(false);

      toast({
        title: t('success'),
        description: 'Usuário criado com sucesso!',
      });
    } catch (error) {
      toast({
        title: t('error'),
        description: 'Erro ao criar usuário. Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = (userId: string) => {
    if (confirm('Tem certeza que deseja excluir este usuário?')) {
      setUsers(prev => prev.filter(user => user.id !== userId));
      toast({
        title: t('success'),
        description: 'Usuário excluído com sucesso!',
      });
    }
  };

  if (!isAdmin) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold text-gray-600">Acesso Negado</h2>
            <p className="text-gray-500 mt-2">Você não tem permissão para acessar esta área.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('users')}</h1>
          <p className="text-gray-600 mt-1">Gerencie usuários do sistema</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-revenshop-primary hover:bg-revenshop-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              {t('addUser')}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{t('addUser')}</DialogTitle>
            </DialogHeader>
            <UserForm onSubmit={handleCreateUser} isLoading={isLoading} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {users.map((user) => (
          <Card key={user.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-full ${
                    user.role === 'admin' 
                      ? 'bg-red-100 text-red-600' 
                      : 'bg-blue-100 text-blue-600'
                  }`}>
                    {user.role === 'admin' ? (
                      <Shield className="h-6 w-6" />
                    ) : (
                      <User className="h-6 w-6" />
                    )}
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {user.firstName} {user.lastName}
                    </h3>
                    <p className="text-gray-600">{user.email}</p>
                    <p className="text-sm text-gray-500">{user.phone}</p>
                    <div className="flex items-center mt-1">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.role === 'admin'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {user.role === 'admin' ? 'Administrador' : 'Vendedor'}
                      </span>
                      <span className="text-xs text-gray-400 ml-3">
                        Criado em: {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      toast({
                        title: 'Em desenvolvimento',
                        description: 'Funcionalidade de edição será implementada em breve.',
                      });
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  
                  {user.id !== '1' && ( // Não permitir excluir o admin principal
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteUser(user.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {users.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">Nenhum usuário encontrado</h3>
            <p className="text-gray-500">Comece adicionando o primeiro usuário ao sistema.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default UserManagement;
