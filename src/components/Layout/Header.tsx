
import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LogOut, Settings, Menu } from 'lucide-react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useSidebar } from '@/components/ui/sidebar';
import ThemeToggle from './ThemeToggle';
import QuickLinksMenu from './QuickLinksMenu';

interface HeaderProps {
  onNavigateToProfile?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onNavigateToProfile }) => {
  const { language, setLanguage, t } = useLanguage();
  const { user, signOut } = useAuth();
  const { toggleSidebar } = useSidebar();

  const handleProfileClick = () => {
    if (onNavigateToProfile) {
      onNavigateToProfile();
    }
  };

  return (
    <header className="bg-card shadow-sm border-b border-border px-2 sm:px-4 py-3 sticky top-0 z-40">
      <div className="flex items-center justify-between w-full">
        {/* Left side - Sidebar triggers */}
        <div className="flex items-center space-x-2">
          {/* Mobile trigger */}
          <SidebarTrigger className="md:hidden" />
          
          {/* Desktop toggle button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSidebar}
            className="hidden md:flex h-8 w-8 p-0"
            title="Toggle Sidebar"
          >
            <Menu className="h-4 w-4" />
          </Button>
        </div>

        {/* Center section - Hidden on mobile, shown on larger screens */}
        <div className="hidden md:flex flex-1 justify-center">
          {/* Center content can be added here if needed */}
        </div>

        {/* Right side controls */}
        <div className="flex items-center justify-end space-x-1 sm:space-x-2">
          {/* Quick Links Menu */}
          <QuickLinksMenu />

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Language Selector */}
          <Select value={language} onValueChange={(value: 'pt' | 'es' | 'en') => setLanguage(value)}>
            <SelectTrigger className="w-10 h-7 sm:w-12 sm:h-8 text-xs border-0 bg-transparent p-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="z-[9999] min-w-[60px] bg-popover border shadow-lg">
              <SelectItem value="pt">🇧🇷</SelectItem>
              <SelectItem value="es">🇪🇸</SelectItem>
              <SelectItem value="en">🇺🇸</SelectItem>
            </SelectContent>
          </Select>

          {/* User Info with Profile Button */}
          {user && (
            <div className="flex items-center space-x-1 sm:space-x-2 border-l pl-2 sm:pl-3 ml-1 sm:ml-2">
              {/* User name - hidden on mobile */}
              <div className="text-right hidden lg:block">
                <p className="text-sm font-medium text-foreground">
                  {user.first_name} {user.last_name}
                </p>
                <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
              </div>
              
              {/* Profile Settings Button */}
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleProfileClick} 
                className="h-7 w-7 p-0 sm:h-8 sm:w-8" 
                title="Configurações de Perfil"
              >
                <Settings className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
              
              {/* Logout Button */}
              <Button 
                variant="outline" 
                size="sm" 
                onClick={signOut} 
                className="h-7 px-2 sm:h-8 sm:px-3"
              >
                <LogOut className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline text-xs ml-1">{t('logout')}</span>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
