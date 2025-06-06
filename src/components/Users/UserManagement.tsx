import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, User, Shield, DollarSign, ExternalLink, Loader2, AlertTriangle } from 'lucide-react';
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
  const [error, setError] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);

  const fetchUsers = async () => {
    if (!canManageUsers || !currentUser) {
      console.log('Cannot fetch users - insufficient permissions or no current user');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      console.log('Fetching users from database...');

      // Check if user has proper permissions before querying
      const { data: currentUserProfile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', currentUser.id)
        .single();

      if (profileError) {
        console.error('Error fetching current user profile:', profileError);
        throw new Error('Erro ao verificar permissões do usuário');
      }

      if (!currentUserProfile || (currentUserProfile.role !== 'admin' && currentUserProfile.role !== 'manager')) {
        throw new Error('Usuário não tem permissão para acessar esta área');
      }

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
    } catch (error: any) {
      console.error('Error fetching users:', error);
      const errorMessage = error.message || 'Erro ao carregar usuários. Verifique as permissões.';
      setError(errorMessage);
      toast({
        title: t('error'),
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Only fetch users when auth is ready and user has permissions
    if (!authLoading && currentUser) {
      if (canManageUsers) {
        console.log('UserManagement: Auth ready, fetching users');
        fetchUsers();
      } else {
        console.log('UserManagement: Auth ready but no permissions');
        setLoading(false);
        setError('Você não tem permissão para acessar esta área');
      }
    } else if (!authLoading && !currentUser) {
      console.log('UserManagement: Auth ready but no user');
      setLoading(false);
      setError('Usuário não autenticado');
    }
  }, [authLoading, currentUser, canManageUsers]);

  const checkUserDependencies = async (userId: string) => {
    try {
      console.log('Checking dependencies for user:', userId);
      
      // Check if user has any BHPH customers
      const { data: bhphCustomers, error: bhphError } = await supabase
        .from('bhph_customers')
        .select('id')
        .eq('responsible_seller_id', userId)
        .limit(1);

      if (bhphError) {
        console.error('Error checking BHPH customers:', bhphError);
        throw bhphError;
      }

      // Check if user has any vehicles
      const { data: vehicles, error: vehiclesError } = await supabase
        .from('vehicles')
        .select('id')
        .eq('created_by', userId)
        .limit(1);

      if (vehiclesError) {
        console.error('Error checking vehicles:', vehiclesError);
        throw vehiclesError;
      }

      // Check if user has any tasks
      const { data: tasks, error: tasksError } = await supabase
        .from('tasks')
        .select('id')
        .eq('assigned_to', userId)
        .limit(1);

      if (tasksError) {
        console.error('Error checking tasks:', tasksError);
        throw tasksError;
      }

      const dependencies = [];
      if (bhphCustomers && bhphCustomers.length > 0) {
        dependencies.push('clientes BHPH');
      }
      if (vehicles && vehicles.length > 0) {
        dependencies.push('veículos');
      }
      if (tasks && tasks.length > 0) {
        dependencies.push('tarefas');
      }

      return dependencies;
    } catch (error) {
      console.error('Error checking user dependencies:', error);
      throw error;
    }
  };

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
      
      // Generate a temporary password if none provided
      const tempPassword = userData.password || `TempPass${Math.random().toString(36).slice(-8)}!`;
      
      console.log('Attempting to create auth user...');
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: tempPassword,
        options: {
          data: {
            first_name: userData.firstName,
            last_name: userData.lastName,
          },
          emailRedirectTo: undefined, // Prevent email confirmation for admin-created users
        },
      });

      if (authError) {
        console.error('Auth error:', authError);
        // Check if it's an email already exists error
        if (authError.message.includes('already registered') || authError.message.includes('already exists')) {
          // Try to find existing user and update their profile
          console.log('User already exists, trying to update profile...');
          
          // Get existing user by email
          const { data: existingUsers, error: fetchError } = await supabase
            .from('profiles')
            .select('*')
            .eq('email', userData.email);
          
          if (fetchError) {
            console.error('Error fetching existing user:', fetchError);
            throw new Error('Usuário já existe mas não foi possível atualizar o perfil');
          }
          
          if (existingUsers && existingUsers.length > 0) {
            // Update existing user's profile
            const { error: updateError } = await supabase
              .from('profiles')
              .update({
                first_name: userData.firstName,
                last_name: userData.lastName,
                phone: userData.phone,
                facebook: userData.facebook,
                role: userData.role,
                photo: userData.photo,
              })
              .eq('id', existingUsers[0].id);
            
            if (updateError) {
              console.error('Error updating existing user:', updateError);
              throw updateError;
            }
            
            console.log('Existing user profile updated successfully');
          } else {
            throw new Error('Usuário já existe mas não foi encontrado na base de dados');
          }
        } else {
          throw authError;
        }
      } else {
        console.log('Auth user created:', authData.user?.id);

        // If new user was created, update their profile
        if (authData.user) {
          console.log('Updating new user profile...');
          const { error: profileError } = await supabase
            .from('profiles')
            .update({
              first_name: userData.firstName,
              last_name: userData.lastName,
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

          console.log('New user profile updated successfully');
        }
      }

      await fetchUsers();
      setIsCreateDialogOpen(false);

      toast({
        title: t('success'),
        description: 'Usuário criado/atualizado com sucesso!',
      });
    } catch (error: any) {
      console.error('Error creating user:', error);
      let errorMessage = 'Erro ao criar usuário. Tente novamente.';
      
      if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: t('error'),
        description: errorMessage,
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
    try {
      setDeletingUserId(userId);
      
      // First check if the user has any dependencies
      const dependencies = await checkUserDependencies(userId);
      
      if (dependencies.length > 0) {
        toast({
          title: 'Não é possível excluir o usuário',
          description: `Este usuário possui ${dependencies.join(', ')} associados. Remova essas associações antes de excluir o usuário.`,
          variant: 'destructive',
        });
        return;
      }

      // If no dependencies, proceed with deletion
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

      if (error) {
        console.error('Error deleting user:', error);
        
        // Handle specific foreign key constraint errors
        if (error.code === '23503') {
          toast({
            title: 'Não é possível excluir o usuário',
            description: 'Este usuário possui dados associados no sistema. Remova todas as associações antes de excluir.',
            variant: 'destructive',
          });
        } else {
          throw error;
        }
        return;
      }

      await fetchUsers();
      toast({
        title: t('success'),
        description: 'Usuário excluído com sucesso!',
      });
    } catch (error: any) {
      console.error('Error deleting user:', error);
      toast({
        title: t('error'),
        description: 'Erro ao excluir usuário. Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setDeletingUserId(null);
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

  // Show error state
  if (error) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold text-red-600">Erro</h2>
            <p className="text-gray-500 mt-2">{error}</p>
            <Button 
              onClick={() => {
                setError(null);
                fetchUsers();
              }} 
              className="mt-4"
              variant="outline"
            >
              Tentar novamente
            </Button>
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
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          disabled={deletingUserId === user.id}
                        >
                          {deletingUserId === user.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle className="flex items-center space-x-2">
                            <AlertTriangle className="h-5 w-5 text-red-600" />
                            <span>Confirmar Exclusão</span>
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            Tem certeza que deseja excluir o usuário <strong>{user.first_name} {user.last_name}</strong>?
                            <br />
                            <br />
                            Esta ação não pode ser desfeita. Se o usuário tiver dados associados (veículos, clientes, tarefas), 
                            a exclusão será bloqueada para manter a integridade dos dados.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteUser(user.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Excluir Usuário
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
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
