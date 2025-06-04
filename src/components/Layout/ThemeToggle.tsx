
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
        return <Sun className="h-4 w-4" />;
      case 'dark':
        return <Moon className="h-4 w-4" />;
      default:
        return <Sun className="h-4 w-4" />;
    }
  };

  return (
    <Select value={theme} onValueChange={setTheme}>
      <SelectTrigger className="w-32 h-9">
        <div className="flex items-center space-x-2">
          {getThemeIcon(theme)}
          <SelectValue />
        </div>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="light">
          <div className="flex items-center space-x-2">
            <Sun className="h-4 w-4" />
            <span>Claro</span>
          </div>
        </SelectItem>
        <SelectItem value="dark">
          <div className="flex items-center space-x-2">
            <Moon className="h-4 w-4" />
            <span>Escuro</span>
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  );
};

export default ThemeToggle;
