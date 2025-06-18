
import React from 'react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sun, Moon } from 'lucide-react';

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  const getThemeIcon = (currentTheme: string | undefined) => {
    switch (currentTheme) {
      case 'light':
        return <Sun className="h-3 w-3 sm:h-4 sm:w-4" />;
      case 'dark':
        return <Moon className="h-3 w-3 sm:h-4 sm:w-4" />;
      default:
        return <Sun className="h-3 w-3 sm:h-4 sm:w-4" />;
    }
  };

  return (
    <Select value={theme} onValueChange={setTheme}>
      <SelectTrigger className="w-7 h-7 sm:w-20 sm:h-8 border-0 bg-transparent">
        <div className="flex items-center space-x-1">
          {getThemeIcon(theme)}
          <span className="hidden sm:inline text-xs">
            <SelectValue />
          </span>
        </div>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="light">
          <div className="flex items-center space-x-2">
            <Sun className="h-3 w-3" />
            <span className="text-xs">Claro</span>
          </div>
        </SelectItem>
        <SelectItem value="dark">
          <div className="flex items-center space-x-2">
            <Moon className="h-3 w-3" />
            <span className="text-xs">Escuro</span>
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  );
};

export default ThemeToggle;
