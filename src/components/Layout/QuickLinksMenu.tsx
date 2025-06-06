
import React from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { ExternalLink, Globe, Search, Car, DollarSign, FileText } from 'lucide-react';

const QuickLinksMenu = () => {
  const quickLinks = [
    {
      name: 'Carfax Online',
      url: 'https://www.carfax.com/',
      icon: Car,
      description: 'Relatórios de histórico de veículos'
    },
    {
      name: 'KBB (Kelley Blue Book)',
      url: 'https://www.kbb.com/',
      icon: DollarSign,
      description: 'Valores de mercado de veículos'
    },
    {
      name: 'Autotrader',
      url: 'https://www.autotrader.com/',
      icon: Search,
      description: 'Busca de veículos e preços'
    },
    {
      name: 'Cars.com',
      url: 'https://www.cars.com/',
      icon: Car,
      description: 'Portal de veículos usados'
    },
    {
      name: 'Manheim',
      url: 'https://www.manheim.com/',
      icon: Globe,
      description: 'Leilões de veículos'
    },
    {
      name: 'AutoCheck',
      url: 'https://www.autocheck.com/',
      icon: FileText,
      description: 'Relatórios de histórico alternativo'
    }
  ];

  const handleLinkClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center space-x-2">
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline">Links Úteis</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-64 z-50"
      >
        {quickLinks.map((link, index) => (
          <React.Fragment key={link.name}>
            <DropdownMenuItem
              className="flex items-start space-x-3 p-3 cursor-pointer"
              onClick={() => handleLinkClick(link.url)}
            >
              <link.icon className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-1">
                  <span className="font-medium text-sm">{link.name}</span>
                  <ExternalLink className="h-3 w-3 text-muted-foreground" />
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{link.description}</p>
              </div>
            </DropdownMenuItem>
            {index < quickLinks.length - 1 && <DropdownMenuSeparator />}
          </React.Fragment>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default QuickLinksMenu;
