import React, { useState, useEffect, lazy, Suspense } from 'react';
import { useAuth } from './contexts/AuthContext';
import Sidebar from './components/Layout/Sidebar';
import Navbar from './components/Layout/Navbar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Loader2 } from 'lucide-react';

// Lazy loading dos componentes para melhor performance
const Dashboard = lazy(() => import('./components/Dashboard/Dashboard'));
const VehicleList = lazy(() => import('./components/Vehicles/VehicleList'));
const CustomerManagement = lazy(() => import('./components/Customers/CustomerManagement'));
const UserManagement = lazy(() => import('./components/Users/UserManagement'));
const AdminPanel = lazy(() => import('./components/Admin/AdminPanel'));
const ProfilePage = lazy(() => import('./components/Profile/ProfilePage'));
const BuyHerePayHere = lazy(() => import('./components/BHPH/BuyHerePayHere'));
const AuctionManagement = lazy(() => import('./components/Auctions/AuctionManagement'));
const TaskManagement = lazy(() => import('./components/Tasks/TaskManagement'));
const FinancingSimulation = lazy(() => import('./components/FinancingSimulation/FinancingSimulation'));

// Componente de loading
const LoadingFallback = () => (
  <div className="flex items-center justify-center h-64">
    <Loader2 className="h-8 w-8 animate-spin" />
  </div>
);

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { canAccessAdmin, canManageUsers, canAccessDashboard } = useAuth();

  useEffect(() => {
    const storedTab = localStorage.getItem('activeTab');
    if (storedTab) {
      setActiveTab(storedTab);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('activeTab', activeTab);
  }, [activeTab]);

  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'dashboard':
        return canAccessDashboard ? <Dashboard /> : null;
      case 'vehicles':
        return <VehicleList />;
      case 'customers':
        return <CustomerManagement />;
      case 'auctions':
        return <AuctionManagement />;
      case 'tasks':
        return <TaskManagement />;
      case 'bhph':
        return <BuyHerePayHere />;
      case 'financing':
        return <FinancingSimulation />;
      case 'users':
        return canManageUsers ? <UserManagement /> : null;
      case 'admin':
        return canAccessAdmin ? <AdminPanel onNavigateToUsers={() => setActiveTab('users')} /> : null;
      case 'profile':
        return <ProfilePage />;
      default:
        return null;
    }
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen bg-background w-full overflow-hidden">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
          <Navbar />

          <main className="flex-1 overflow-auto bg-background">
            <Suspense fallback={<LoadingFallback />}>
              {renderActiveComponent()}
            </Suspense>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default App;
