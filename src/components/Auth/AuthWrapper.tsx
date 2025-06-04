
import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import LoginForm from './LoginForm';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

interface AuthWrapperProps {
  children: React.ReactNode;
}

const AuthWrapper = ({ children }: AuthWrapperProps) => {
  const { isAuthenticated, loading, user } = useAuth();

  console.log('AuthWrapper render:', { 
    isAuthenticated, 
    loading, 
    userEmail: user?.email,
    userRole: user?.role 
  });

  if (loading) {
    console.log('AuthWrapper: Showing loading state');
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-96">
          <CardContent className="p-6 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Carregando...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log('AuthWrapper: User not authenticated, showing login form');
    return <LoginForm />;
  }

  console.log('AuthWrapper: User authenticated, showing main app');
  return <>{children}</>;
};

export default AuthWrapper;
