import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, User, Shield, DollarSign, ExternalLink, Loader2 } from 'lucide-react';
import { Facebook } from 'lucide-react';
import UserForm from './UserForm';
import EditUserForm from './EditUserForm';

interface UserProfile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  facebook?: string;
  role: 'admin' | 'manager' | 'seller';
  created_at: string;
  photo?: string;
  commission_client_referral?: number;
  commission_client_brought?: number;
  commission_full_sale?: number;
}

const UserManagement = () => {
  const { t } = useLanguage();
  const { canManageUsers, user: currentUser, isAdmin, loading: authLoading } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchUsers = async () => {
    if (!canManageUsers || !currentUser) {
      console.log('Cannot fetch users - insufficient permissions or no current user');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log('Fetching users from database...');

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      console.log('Database query result:', { data, error });

      if (error) {
        console.error('Database error:', error);
        throw error;
      }
      
      console.log('Successfully fetched users:', data?.length || 0);
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: t('error'),
        description: 'Erro ao carregar usuários. Verifique as permissões.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Only fetch users when auth is ready and user has permissions
    if (!authLoading && canManageUsers && currentUser) {
      console.log('UserManagement: Auth ready, fetching users');
      fetchUsers();
    } else if (!authLoading) {
      console.log('UserManagement: Auth ready but no permissions or user');
      setLoading(false);
    }
  }, [authLoading, canManageUsers, currentUser]);

  const canEditUser = (user: UserProfile) => {
    if (!currentUser) return false;
    
    if (isAdmin) {
      if (user.role === 'admin' && user.id !== currentUser.id) return false;
      return true;
    }
    
    if (currentUser.role === 'manager') {
      return user.role === 'seller';
    }
    
    return false;
  };

  const canDeleteUser = (user: UserProfile) => {
    if (!currentUser) return false;
    if (user.id === currentUser.id) return false;
    
    if (isAdmin) {
      return user.role !== 'admin';
    }
    
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
    setIsSubmitting(true);
    
    try {
      console.log('Creating user with data:', userData);
      
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password || 'TempPass123!',
        options: {
          data: {
            first_name: userData.firstName,
            last_name: userData.lastName,
          },
        },
      });

      if (authError) {
        console.error('Auth error:', authError);
        throw authError;
      }

      console.log('Auth user created:', authData.user?.id);

      if (authData.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            phone: userData.phone,
            facebook: userData.facebook,
            role: userData.role,
            photo: userData.photo,
          })
          .eq('id', authData.user.id);

        if (profileError) {
          console.error('Profile update error:', profileError);
          throw profileError;
        }

        console.log('Profile updated successfully');
      }

      await fetchUsers();
      setIsCreateDialogOpen(false);

      toast({
        title: t('success'),
        description: 'Usuário criado com sucesso!',
      });
    } catch (error) {
      console.error('Error creating user:', error);
      toast({
        title: t('error'),
        description: 'Erro ao criar usuário. Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditUser = async (userData: any) => {
    if (!editingUser) return;
    
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: userData.firstName,
          last_name: userData.lastName,
          phone: userData.phone,
          facebook: userData.facebook,
          role: userData.role,
          photo: userData.photo,
          commission_client_referral: userData.commissionClientReferral,
          commission_client_brought: userData.commissionClientBrought,
          commission_full_sale: userData.commissionFullSale,
        })
        .eq('id', editingUser.id);

      if (error) throw error;

      await fetchUsers();
      setIsEditDialogOpen(false);
      setEditingUser(null);

      toast({
        title: t('success'),
        description: 'Usuário atualizado com sucesso!',
      });
    } catch (error) {
      console.error('Error updating user:', error);
      toast({
        title: t('error'),
        description: 'Erro ao atualizar usuário. Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (confirm('Tem certeza que deseja excluir este usuário?')) {
      try {
        const { error } = await supabase
          .from('profiles')
          .delete()
          .eq('id', userId);

        if (error) throw error;

        await fetchUsers();
        toast({
          title: t('success'),
          description: 'Usuário excluído com sucesso!',
        });
      } catch (error) {
        console.error('Error deleting user:', error);
        toast({
          title: t('error'),
          description: 'Erro ao excluir usuário.',
          variant: 'destructive',
        });
      }
    }
  };

  const openEditDialog = (user: UserProfile) => {
    setEditingUser(user);
    setIsEditDialogOpen(true);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  // Show loading while auth is still loading
  if (authLoading) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-12 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Verificando permissões...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

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

  if (loading) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-12 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Carregando usuários...</p>
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
          <p className="text-sm text-gray-500 mt-1">Total de usuários: {users.length}</p>
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
            <UserForm onSubmit={handleCreateUser} isLoading={isSubmitting} />
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
                    <AvatarImage src={user.photo} alt={`${user.first_name} ${user.last_name}`} />
                    <AvatarFallback className="text-lg">
                      {user.first_name.charAt(0)}{user.last_name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {user.first_name} {user.last_name}
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
                        Criado em: {new Date(user.created_at).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                    
                    {user.role === 'seller' && (
                      <div className="mt-2 flex items-center space-x-4 text-sm">
                        <div className="flex items-center">
                          <DollarSign className="h-3 w-3 mr-1 text-green-600" />
                          <span className="text-gray-600">Indicação: {formatCurrency(user.commission_client_referral || 0)}</span>
                        </div>
                        <div className="flex items-center">
                          <DollarSign className="h-3 w-3 mr-1 text-blue-600" />
                          <span className="text-gray-600">Cliente: {formatCurrency(user.commission_client_brought || 0)}</span>
                        </div>
                        <div className="flex items-center">
                          <DollarSign className="h-3 w-3 mr-1 text-purple-600" />
                          <span className="text-gray-600">Venda: {formatCurrency(user.commission_full_sale || 0)}</span>
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

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Usuário</DialogTitle>
          </DialogHeader>
          {editingUser && (
            <EditUserForm 
              user={editingUser} 
              onSubmit={handleEditUser} 
              isLoading={isSubmitting} 
            />
          )}
        </DialogContent>
      </Dialog>

      {users.length === 0 && !loading && (
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
