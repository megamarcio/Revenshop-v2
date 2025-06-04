
import { useState } from "react";
import { AuthProvider } from "../contexts/AuthContext";
import { LanguageProvider } from "../contexts/LanguageContext";
import { BHPHProvider } from "../contexts/BHPHContext";
import ThemeProvider from "../components/Providers/ThemeProvider";
import AuthWrapper from "../components/Auth/AuthWrapper";
import Header from "../components/Layout/Header";
import Sidebar from "../components/Layout/Sidebar";
import Dashboard from "../components/Dashboard/Dashboard";
import VehicleList from "../components/Vehicles/VehicleList";
import CustomerManagement from "../components/Customers/CustomerManagement";
import UserManagement from "../components/Users/UserManagement";
import AdminPanel from "../components/Admin/AdminPanel";
import ProfilePage from "../components/Profile/ProfilePage";
import BuyHerePayHere from "../components/BHPH/BuyHerePayHere";

const Index = () => {
  const [activeTab, setActiveTab] = useState('vehicles');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'vehicles':
        return <VehicleList />;
      case 'customers':
        return <CustomerManagement />;
      case 'bhph':
        return <BuyHerePayHere />;
      case 'users':
        return <UserManagement />;
      case 'admin':
        return <AdminPanel onNavigateToUsers={() => setActiveTab('users')} />;
      case 'profile':
        return <ProfilePage />;
      default:
        return <VehicleList />;
    }
  };

  return (
    <ThemeProvider>
      <AuthProvider>
        <LanguageProvider>
          <BHPHProvider>
            <AuthWrapper>
              <div className="min-h-screen bg-background">
                <Header />
                <div className="flex">
                  <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
                  <main className="flex-1">
                    {renderContent()}
                  </main>
                </div>
              </div>
            </AuthWrapper>
          </BHPHProvider>
        </LanguageProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default Index;
