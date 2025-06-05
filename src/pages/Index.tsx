
import React from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Sidebar from '../components/Layout/Sidebar';
import Header from '../components/Layout/Header';
import Dashboard from '../components/Dashboard/Dashboard';
import SellerDashboard from '../components/Dashboard/SellerDashboard';
import VehicleList from '../components/Vehicles/VehicleList';
import CustomerManagement from '../components/Customers/CustomerManagement';
import TaskManagement from '../components/Tasks/TaskManagement';
import AuctionManagement from '../components/Auctions/AuctionManagement';
import UserManagement from '../components/Users/UserManagement';
import ProfilePage from '../components/Profile/ProfilePage';
import AdminPanel from '../components/Admin/AdminPanel';
import BuyHerePayHere from '../components/BHPH/BuyHerePayHere';

const Index = () => {
  const { isAdmin, isManager } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get active tab from current route
  const getActiveTabFromPath = (pathname: string) => {
    if (pathname === '/') return 'dashboard';
    return pathname.substring(1); // Remove leading slash
  };

  const activeTab = getActiveTabFromPath(location.pathname);

  const handleTabChange = (tab: string) => {
    if (tab === 'dashboard') {
      navigate('/');
    } else {
      navigate(`/${tab}`);
    }
  };

  const handleNavigateToUsers = () => {
    navigate('/users');
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeTab={activeTab} setActiveTab={handleTabChange} />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 overflow-auto">
          <Routes>
            <Route path="/" element={isAdmin || isManager ? <Dashboard /> : <SellerDashboard />} />
            <Route path="/vehicles" element={<VehicleList />} />
            <Route path="/customers" element={<CustomerManagement />} />
            <Route path="/tasks" element={<TaskManagement />} />
            {(isAdmin || isManager) && (
              <>
                <Route path="/auctions" element={<AuctionManagement />} />
                <Route path="/users" element={<UserManagement />} />
                <Route path="/admin" element={<AdminPanel onNavigateToUsers={handleNavigateToUsers} />} />
              </>
            )}
            <Route path="/bhph" element={<BuyHerePayHere />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default Index;
