
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LanguageProvider } from '../contexts/LanguageContext';
import { AuthProvider } from '../contexts/AuthContext';
import LoginForm from '../components/Auth/LoginForm';
import Header from '../components/Layout/Header';
import Sidebar from '../components/Layout/Sidebar';
import Dashboard from '../components/Dashboard/Dashboard';
import VehicleList from '../components/Vehicles/VehicleList';
import UserManagement from '../components/Users/UserManagement';
import AdminPanel from '../components/Admin/AdminPanel';
import ProfilePage from '../components/Profile/ProfilePage';

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
        return <UserManagement />;
      case 'admin':
        return <AdminPanel />;
      case 'profile':
        return <ProfilePage />;
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
