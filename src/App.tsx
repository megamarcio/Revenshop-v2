
import React, { useState, useEffect } from 'react';
import { useAuth } from './contexts/AuthContext';
import Sidebar from './components/Layout/Sidebar';
import Navbar from './components/Layout/Navbar';
import Dashboard from './components/Dashboard/Dashboard';
import VehicleList from './components/Vehicles/VehicleList';
import CustomerManagement from './components/Customers/CustomerManagement';
import UserManagement from './components/Users/UserManagement';
import AdminPanel from './components/Admin/AdminPanel';
import ProfilePage from './components/Profile/ProfilePage';
import BuyHerePayHere from './components/BHPH/BuyHerePayHere';
import AuctionManagement from './components/Auctions/AuctionManagement';
import TaskManagement from './components/Tasks/TaskManagement';
import FinancingSimulation from './components/FinancingSimulation/FinancingSimulation';
import { SidebarProvider } from '@/components/ui/sidebar';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { canAccessAdmin, canManageUsers } = useAuth();

  useEffect(() => {
    const storedTab = localStorage.getItem('activeTab');
    if (storedTab) {
      setActiveTab(storedTab);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('activeTab', activeTab);
  }, [activeTab]);

  return (
    <SidebarProvider>
      <div className="flex h-screen bg-background w-full">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        <div className="flex flex-col flex-1 min-w-0">
          <Navbar />

          <main className="flex-1 overflow-auto bg-background">
            {activeTab === 'dashboard' && canAccessAdmin && <Dashboard />}
            {activeTab === 'vehicles' && <VehicleList />}
            {activeTab === 'customers' && <CustomerManagement />}
            {activeTab === 'auctions' && <AuctionManagement />}
            {activeTab === 'tasks' && <TaskManagement />}
            {activeTab === 'bhph' && <BuyHerePayHere />}
            {activeTab === 'financing' && <FinancingSimulation />}
            {activeTab === 'users' && canManageUsers && <UserManagement />}
            {activeTab === 'admin' && canAccessAdmin && <AdminPanel onNavigateToUsers={() => setActiveTab('users')} />}
            {activeTab === 'profile' && <ProfilePage />}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default App;
