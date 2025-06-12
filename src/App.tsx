
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { BHPHProvider } from './contexts/BHPHContext';
import ThemeProvider from './components/Providers/ThemeProvider';
import { Toaster } from '@/components/ui/toaster';
import { SidebarProvider } from '@/components/ui/sidebar';
import AuthWrapper from './components/Auth/AuthWrapper';
import Header from './components/Layout/Header';
import AppSidebar from './components/Layout/Sidebar';
import Index from './pages/Index';
import NotFound from './pages/NotFound';
import './App.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  const [activeSection, setActiveSection] = useState('vehicles');

  const handleNavigateToSection = (section: string) => {
    setActiveSection(section);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <LanguageProvider>
          <BHPHProvider>
            <AuthProvider>
              <Router>
                <AuthWrapper>
                  <SidebarProvider>
                    <div className="flex h-screen bg-background">
                      <AppSidebar 
                        onNavigate={handleNavigateToSection}
                        activeSection={activeSection}
                      />
                      <div className="flex-1 flex flex-col overflow-hidden">
                        <Header />
                        <main className="flex-1 overflow-auto">
                          <Routes>
                            <Route 
                              path="/" 
                              element={
                                <Index 
                                  activeSection={activeSection}
                                  setActiveSection={setActiveSection}
                                />
                              } 
                            />
                            <Route path="*" element={<NotFound />} />
                          </Routes>
                        </main>
                      </div>
                    </div>
                  </SidebarProvider>
                </AuthWrapper>
              </Router>
            </AuthProvider>
          </BHPHProvider>
        </LanguageProvider>
      </ThemeProvider>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
