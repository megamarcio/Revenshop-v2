
import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LogOut, User, Car } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import QuickLinksMenu from './QuickLinksMenu';

const Header = () => {
  const { language, setLanguage, t } = useLanguage();
  const { user, signOut } = useAuth();

  return (
    <header className="bg-card shadow-sm border-b border-border px-2 sm:px-4 py-3 sticky top-0 z-40">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="bg-revenshop-primary p-1.5 sm:p-2 rounded-lg">
            <Car className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-xl sm:text-2xl font-bold text-revenshop-primary">REVENSHOP</h1>
            <p className="text-xs sm:text-sm text-muted-foreground">{t('subtitle')}</p>
          </div>
          <div className="sm:hidden">
            <h1 className="text-lg font-bold text-revenshop-primary">REVENSHOP</h1>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-1 sm:space-x-4">
          {/* Quick Links Menu */}
          <div className="z-50">
            <QuickLinksMenu />
          </div>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Language Selector */}
          <Select value={language} onValueChange={(value: 'pt' | 'es' | 'en') => setLanguage(value)}>
            <SelectTrigger className="w-16 sm:w-20 h-8 sm:h-9 text-xs sm:text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="z-50">
              <SelectItem value="pt">🇧🇷 PT</SelectItem>
              <SelectItem value="es">🇪🇸 ES</SelectItem>
              <SelectItem value="en">🇺🇸 EN</SelectItem>
            </SelectContent>
          </Select>

          {/* User Info */}
          {user && (
            <div className="flex items-center space-x-1 sm:space-x-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-foreground">
                  {user.first_name} {user.last_name}
                </p>
                <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={signOut}
                className="flex items-center space-x-1 h-8 sm:h-9 px-2 sm:px-3"
              >
                <LogOut className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline text-xs sm:text-sm">{t('logout')}</span>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
