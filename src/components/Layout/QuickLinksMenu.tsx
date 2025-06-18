
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
        <Button variant="outline" size="sm" className="h-7 w-7 p-0 sm:h-8 sm:w-8 sm:px-2 border-0 bg-transparent">
          <Globe className="h-3 w-3 sm:h-4 sm:w-4" />
          <span className="hidden sm:inline text-xs ml-1">Links</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-48 sm:w-56 z-[9999] bg-popover border shadow-lg"
        sideOffset={5}
      >
        {quickLinks.map((link, index) => (
          <React.Fragment key={link.name}>
            <DropdownMenuItem
              className="flex items-start space-x-2 p-2 cursor-pointer hover:bg-accent focus:bg-accent"
              onClick={() => handleLinkClick(link.url)}
            >
              <link.icon className="h-3 w-3 mt-0.5 text-primary flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-1">
                  <span className="font-medium text-xs text-foreground">{link.name}</span>
                  <ExternalLink className="h-2 w-2 text-muted-foreground" />
                </div>
                <p className="text-xs text-muted-foreground mt-0.5 hidden sm:block">{link.description}</p>
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
