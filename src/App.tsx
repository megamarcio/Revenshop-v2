import React, { useState } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import AppSidebar from '@/components/Layout/Sidebar';
import Header from '@/components/Layout/Header';
import { usePreventBackNavigation } from '@/hooks/usePreventBackNavigation';
import Dashboard from '@/components/Dashboard/Dashboard';
import VehicleListContainer from '@/components/Vehicles/VehicleListContainer';
import CustomerManagement from '@/components/Customers/CustomerManagement';
import AuctionManagement from '@/components/Auctions/AuctionManagement';
import TaskManagement from '@/components/Tasks/TaskManagement';
import MaintenanceManagement from '@/components/Maintenance/MaintenanceManagement';
import AIBeta from '@/components/AI/AIBeta';
import FinancingSimulation from '@/components/FinancingSimulation/FinancingSimulation';
import BuyHerePayHere from '@/components/BHPH/BuyHerePayHere';
import ConsultaReservas from '@/components/Logistica/ConsultaReservas';
import UserManagement from '@/components/Users/UserManagement';
import AdminPanel from '@/components/Admin/AdminPanel';
import ProfilePage from '@/components/Profile/ProfilePage';
import FinancialManagement from '@/components/Financial/FinancialManagement';
import AcompanharReservas from '@/components/Reservas/AcompanharReservas';
import ListaReservas from '@/components/Reservas/ListaReservas';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  // Prevent back navigation on mobile
  usePreventBackNavigation();

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'vehicles':
        return <VehicleListContainer onNavigateToCustomers={() => setActiveTab('customers')} />;
      case 'customers':
        return <CustomerManagement />;
      case 'auctions':
        return <AuctionManagement />;
      case 'tasks':
        return <TaskManagement />;
      case 'maintenance':
        return <MaintenanceManagement />;
      case 'acompanhar-reservas':
        return <AcompanharReservas />;
      case 'lista-reservas':
        return <ListaReservas />;
      case 'ai-beta':
        return <AIBeta />;
      case 'financing':
        return <FinancingSimulation />;
      case 'bhph':
        return <BuyHerePayHere />;
      case 'logistica':
        return <ConsultaReservas />;
      case 'financial':
      case 'revenues':
      case 'expenses':
      case 'bank-statements':
      case 'software':
      case 'financial-config':
        return <FinancialManagement initialTab={activeTab} />;
      case 'users':
        return <UserManagement />;
      case 'admin':
        return <AdminPanel onNavigateToUsers={() => setActiveTab('users')} />;
      case 'profile':
        return <ProfilePage />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <SidebarProvider defaultOpen>
      <div className="min-h-screen flex w-full">
        <AppSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="flex-1 flex flex-col">
          <Header onNavigateToProfile={() => setActiveTab('profile')} />
          <main className="flex-1 overflow-auto bg-background">
            {renderContent()}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

export default App;
