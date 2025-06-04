
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LanguageProvider } from '../contexts/LanguageContext';
import { AuthProvider } from '../contexts/AuthContext';
import LoginForm from '../components/Auth/LoginForm';
import Header from '../components/Layout/Header';
import Sidebar from '../components/Layout/Sidebar';
import Dashboard from '../components/Dashboard/Dashboard';
import VehicleList from '../components/Vehicles/VehicleList';

const AppContent = () => {
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'vehicles':
        return <VehicleList />;
      case 'users':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold">Usuários</h1>
            <p className="text-gray-600 mt-2">Funcionalidade em desenvolvimento</p>
          </div>
        );
      case 'admin':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold">Administração</h1>
            <p className="text-gray-600 mt-2">Funcionalidade em desenvolvimento</p>
          </div>
        );
      case 'profile':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold">Perfil</h1>
            <p className="text-gray-600 mt-2">Funcionalidade em desenvolvimento</p>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="flex-1 overflow-hidden">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

const Index = () => {
  return (
    <LanguageProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </LanguageProvider>
  );
};

export default Index;
