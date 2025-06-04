import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, User, Shield, DollarSign, ExternalLink } from 'lucide-react';
import { Facebook } from 'lucide-react';
import UserForm from './UserForm';
import EditUserForm from './EditUserForm';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  facebook?: string;
  role: 'admin' | 'manager' | 'seller';
  createdAt: string;
  photo?: string;
  commissionClientReferral?: number;
  commissionClientBrought?: number;
  commissionFullSale?: number;
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
    createdAt: '2024-01-01',
    photo: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=150&h=150&fit=crop&crop=face',
    commissionClientReferral: 100,
    commissionClientBrought: 250,
    commissionFullSale: 500
  },
  {
    id: '2',
    firstName: 'João',
    lastName: 'Silva',
    email: 'joao@revenshop.com',
    phone: '+55 11 88888-8888',
    facebook: 'https://facebook.com/joaosilva',
    role: 'seller',
    createdAt: '2024-01-02',
    photo: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=150&h=150&fit=crop&crop=face',
    commissionClientReferral: 75,
    commissionClientBrought: 200,
    commissionFullSale: 400
  },
  {
    id: '3',
    firstName: 'Maria',
    lastName: 'Santos',
    email: 'maria@revenshop.com',
    phone: '+55 11 77777-7777',
    facebook: 'https://facebook.com/mariasantos',
    role: 'manager',
    createdAt: '2024-01-03',
    photo: 'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=150&h=150&fit=crop&crop=face',
    commissionClientReferral: 80,
    commissionClientBrought: 220,
    commissionFullSale: 450
  }
];

const UserManagement = () => {
  const { t } = useLanguage();
  const { canManageUsers, user: currentUser, isAdmin } = useAuth();
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const canEditUser = (user: User) => {
    if (!currentUser) return false;
    
    // Admins can edit everyone except other admins (unless it's themselves)
    if (isAdmin) {
      if (user.role === 'admin' && user.id !== currentUser.id) return false;
      return true;
    }
    
    // Managers can edit sellers but not admins or other managers
    if (currentUser.role === 'manager') {
      return user.role === 'seller';
    }
    
    return false;
  };

  const canDeleteUser = (user: User) => {
    if (!currentUser) return false;
    
    // Can't delete yourself
    if (user.id === currentUser.id) return false;
    
    // Admins can delete managers and sellers
    if (isAdmin) {
      return user.role !== 'admin';
    }
    
    // Managers can delete sellers
    if (currentUser.role === 'manager') {
      return user.role === 'seller';
    }
    
    return false;
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin': return 'Administrador';
      case 'manager': return 'Gerente';
      case 'seller': return 'Vendedor';
      default: return role;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'manager': return 'bg-purple-100 text-purple-800';
      case 'seller': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

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
        facebook: userData.facebook || '',
        role: userData.role,
        photo: userData.photo || '',
        createdAt: new Date().toISOString().split('T')[0],
        commissionClientReferral: 0,
        commissionClientBrought: 0,
        commissionFullSale: 0
      };

      setUsers(prev => [...prev, newUser]);
      setIsCreateDialogOpen(false);

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

  const handleEditUser = async (userData: any) => {
    if (!editingUser) return;
    
    setIsLoading(true);
    
    try {
      const updatedUser: User = {
        ...editingUser,
        ...userData
      };

      setUsers(prev => prev.map(user => 
        user.id === editingUser.id ? updatedUser : user
      ));
      
      setIsEditDialogOpen(false);
      setEditingUser(null);

      toast({
        title: t('success'),
        description: 'Usuário atualizado com sucesso!',
      });
    } catch (error) {
      toast({
        title: t('error'),
        description: 'Erro ao atualizar usuário. Tente novamente.',
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

  const openEditDialog = (user: User) => {
    setEditingUser(user);
    setIsEditDialogOpen(true);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  if (!canManageUsers) {
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
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
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
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={user.photo} alt={`${user.firstName} ${user.lastName}`} />
                    <AvatarFallback className="text-lg">
                      {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {user.firstName} {user.lastName}
                    </h3>
                    <p className="text-gray-600">{user.email}</p>
                    <p className="text-sm text-gray-500">{user.phone}</p>
                    {user.facebook && (
                      <div className="flex items-center mt-1">
                        <Facebook className="h-3 w-3 mr-1 text-blue-600" />
                        <a 
                          href={user.facebook} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:underline flex items-center"
                        >
                          Facebook
                          <ExternalLink className="h-3 w-3 ml-1" />
                        </a>
                      </div>
                    )}
                    <div className="flex items-center mt-1">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                        {getRoleLabel(user.role)}
                      </span>
                      <span className="text-xs text-gray-400 ml-3">
                        Criado em: {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                    
                    {user.role === 'seller' && (
                      <div className="mt-2 flex items-center space-x-4 text-sm">
                        <div className="flex items-center">
                          <DollarSign className="h-3 w-3 mr-1 text-green-600" />
                          <span className="text-gray-600">Indicação: {formatCurrency(user.commissionClientReferral || 0)}</span>
                        </div>
                        <div className="flex items-center">
                          <DollarSign className="h-3 w-3 mr-1 text-blue-600" />
                          <span className="text-gray-600">Cliente: {formatCurrency(user.commissionClientBrought || 0)}</span>
                        </div>
                        <div className="flex items-center">
                          <DollarSign className="h-3 w-3 mr-1 text-purple-600" />
                          <span className="text-gray-600">Venda: {formatCurrency(user.commissionFullSale || 0)}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {canEditUser(user) && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditDialog(user)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  )}
                  
                  {canDeleteUser(user) && (
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

      {/* Dialog de Edição */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Usuário</DialogTitle>
          </DialogHeader>
          {editingUser && (
            <EditUserForm 
              user={editingUser} 
              onSubmit={handleEditUser} 
              isLoading={isLoading} 
            />
          )}
        </DialogContent>
      </Dialog>

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
