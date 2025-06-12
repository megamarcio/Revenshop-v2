
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import Dashboard from '../components/Dashboard/Dashboard';
import VehicleListContainer from '../components/Vehicles/VehicleListContainer';
import CustomerManagement from '../components/Customers/CustomerManagement';
import MaintenanceManagement from '../components/Maintenance/MaintenanceManagement';
import AuctionManagement from '../components/Auctions/AuctionManagement';
import BuyHerePayHere from '../components/BHPH/BuyHerePayHere';
import FinancingSimulation from '../components/FinancingSimulation/FinancingSimulation';
import TaskManagement from '../components/Tasks/TaskManagement';
import UserManagement from '../components/Users/UserManagement';
import AdminPanel from '../components/Admin/AdminPanel';
import ProfilePage from '../components/Profile/ProfilePage';

const Index = () => {
  const { canAccessDashboard } = useAuth();
  const { t } = useLanguage();
  const [activeSection, setActiveSection] = useState('vehicles');

  const renderMainContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return canAccessDashboard ? <Dashboard /> : <VehicleListContainer />;
      case 'vehicles':
        return <VehicleListContainer />;
      case 'customers':
        return <CustomerManagement />;
      case 'maintenance':
        return <MaintenanceManagement />;
      case 'auctions':
        return <AuctionManagement />;
      case 'bhph':
        return <BuyHerePayHere />;
      case 'financing':
        return <FinancingSimulation />;
      case 'tasks':
        return <TaskManagement />;
      case 'users':
        return <UserManagement />;
      case 'admin':
        return <AdminPanel />;
      case 'profile':
        return <ProfilePage />;
      default:
        return <VehicleListContainer />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {renderMainContent()}
    </div>
  );
};

export default Index;
