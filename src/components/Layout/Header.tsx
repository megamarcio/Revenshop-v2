
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
    <header className="bg-card shadow-sm border-b border-border px-4 py-3">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <div className="bg-revenshop-primary p-2 rounded-lg">
            <Car className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-revenshop-primary">REVENSHOP</h1>
            <p className="text-sm text-muted-foreground">{t('subtitle')}</p>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          {/* Quick Links Menu */}
          <QuickLinksMenu />

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Language Selector */}
          <Select value={language} onValueChange={(value: 'pt' | 'es' | 'en') => setLanguage(value)}>
            <SelectTrigger className="w-20 h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pt">🇧🇷 PT</SelectItem>
              <SelectItem value="es">🇪🇸 ES</SelectItem>
              <SelectItem value="en">🇺🇸 EN</SelectItem>
            </SelectContent>
          </Select>

          {/* User Info */}
          {user && (
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm font-medium text-foreground">
                  {user.first_name} {user.last_name}
                </p>
                <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={signOut}
                className="flex items-center space-x-1"
              >
                <LogOut className="h-4 w-4" />
                <span>{t('logout')}</span>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
