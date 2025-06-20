
import React, { useState } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import AppSidebar from '@/components/Layout/Sidebar';
import Header from '@/components/Layout/Header';
import { usePreventBackNavigation } from '@/hooks/usePreventBackNavigation';
import ExitConfirmationModal from '@/components/Mobile/ExitConfirmationModal';
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

  // Prevent back navigation on mobile with custom modal
  const { showExitModal, handleModalCancel, handleModalConfirm } = usePreventBackNavigation();

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
      case 'fixed-expenses':
      case 'bank-statements':
      case 'software':
      case 'financial-config':
        return <FinancialManagement activeSubTab={activeTab} />;
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
        <div className="flex-1 flex flex-col min-h-screen">
          <Header onNavigateToProfile={() => setActiveTab('profile')} />
          <main className="flex-1 bg-background p-2 sm:p-4 md:p-6 overflow-x-hidden">
            <div className="h-full overflow-y-auto -webkit-overflow-scrolling-touch">
              {renderContent()}
            </div>
          </main>
        </div>
        
        <ExitConfirmationModal
          isOpen={showExitModal}
          onConfirm={handleModalConfirm}
          onCancel={handleModalCancel}
        />
      </div>
    </SidebarProvider>
  );
}

export default App;
