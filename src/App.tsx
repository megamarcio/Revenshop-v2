
import React, { useState, useEffect, lazy, Suspense } from 'react';
import { useAuth } from './contexts/AuthContext';
import Sidebar from './components/Layout/Sidebar';
import Navbar from './components/Layout/Navbar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Loader2 } from 'lucide-react';
import VehicleListContainer from './components/Vehicles/VehicleListContainer';
// Adicionando import do novo componente de logística:
import ConsultaReservas from './components/Logistica/ConsultaReservas';

// Lazy loading dos componentes para melhor performance
const Dashboard = lazy(() => import('./components/Dashboard/Dashboard'));
const CustomerManagement = lazy(() => import('./components/Customers/CustomerManagement'));
const UserManagement = lazy(() => import('./components/Users/UserManagement'));
const AdminPanel = lazy(() => import('./components/Admin/AdminPanel'));
const ProfilePage = lazy(() => import('./components/Profile/ProfilePage'));
const BuyHerePayHere = lazy(() => import('./components/BHPH/BuyHerePayHere'));
const AuctionManagement = lazy(() => import('./components/Auctions/AuctionManagement'));
const TaskManagement = lazy(() => import('./components/Tasks/TaskManagement'));
const FinancingSimulation = lazy(() => import('./components/FinancingSimulation/FinancingSimulation'));
const MaintenanceManagement = lazy(() => import('./components/Maintenance/MaintenanceManagement'));
const AIBeta = lazy(() => import('./components/AI/AIBeta'));

// Componente de loading
const LoadingFallback = () => (
  <div className="flex items-center justify-center h-64">
    <Loader2 className="h-8 w-8 animate-spin" />
  </div>
);

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [navigationHistory, setNavigationHistory] = useState<string[]>(['dashboard']);
  const { canAccessAdmin, canManageUsers, canAccessDashboard, isAdmin, isInternalSeller } = useAuth();

  useEffect(() => {
    const storedTab = localStorage.getItem('activeTab');
    if (storedTab) {
      setActiveTab(storedTab);
      setNavigationHistory([storedTab]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('activeTab', activeTab);
  }, [activeTab]);

  // Controle de navegação do browser
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      event.preventDefault();
      
      setNavigationHistory(currentHistory => {
        if (currentHistory.length > 1) {
          // Se há histórico, voltar para a tela anterior
          const newHistory = [...currentHistory];
          newHistory.pop(); // Remove a tela atual
          const previousTab = newHistory[newHistory.length - 1];
          
          setActiveTab(previousTab);
          return newHistory;
        } else {
          // Se está na primeira tela, bloquear a navegação
          window.history.pushState(null, '', window.location.href);
          return currentHistory;
        }
      });
    };

    // Adicionar estado inicial ao histórico do browser
    window.history.pushState(null, '', window.location.href);
    
    // Escutar evento de volta do browser
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []); // Removendo navigationHistory das dependências para evitar loops

  // Função modificada para gerenciar mudanças de tab
  const handleTabChange = (newTab: string) => {
    if (newTab !== activeTab) {
      setNavigationHistory(prev => [...prev, newTab]);
      setActiveTab(newTab);
      
      // Adicionar novo estado ao histórico do browser
      window.history.pushState(null, '', window.location.href);
    }
  };

  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'dashboard':
        return canAccessDashboard ? <Dashboard /> : null;
      case 'vehicles':
        return <VehicleListContainer />;
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
      case 'maintenance':
        return (isAdmin || isInternalSeller) ? <MaintenanceManagement /> : null;
      case 'ai-beta':
        return <AIBeta />;
      case 'users':
        return canManageUsers ? <UserManagement /> : null;
      case 'admin':
        return canAccessAdmin ? <AdminPanel onNavigateToUsers={() => handleTabChange('users')} /> : null;
      case 'profile':
        return <ProfilePage />;
      case 'logistica':
        // Renderiza o componente de consulta de reservas ao clicar no menu Logística
        return <ConsultaReservas />;
      default:
        return null;
    }
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen bg-background w-full overflow-hidden">
        <Sidebar activeTab={activeTab} setActiveTab={handleTabChange} />

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
