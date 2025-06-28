import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { 
  ExternalLink, 
  ChevronDown, 
  Search, 
  Server,
  Settings
} from 'lucide-react';
import { useExternalAPIs } from '@/hooks/useExternalAPIs';
import { ExternalAPI } from '@/types/externalApi';

interface APISelectorProps {
  selectedAPI?: string;
  onSelectAPI: (apiId: string) => void;
  placeholder?: string;
  showMCPServers?: boolean;
  showAllAPIs?: boolean;
  className?: string;
}

const APISelector: React.FC<APISelectorProps> = ({
  selectedAPI,
  onSelectAPI,
  placeholder = "Selecione uma API",
  showMCPServers = false,
  showAllAPIs = true,
  className = ""
}) => {
  const { apis, getActiveAPIs, getMCPServers } = useExternalAPIs();
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const availableAPIs = showMCPServers 
    ? getMCPServers()
    : showAllAPIs 
      ? getActiveAPIs()
      : getActiveAPIs().filter(api => !api.is_mcp_server);

  const filteredAPIs = availableAPIs.filter(api =>
    api.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    api.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedAPIData = apis.find(api => api.id === selectedAPI);

  const handleSelect = (apiId: string) => {
    onSelectAPI(apiId);
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={isOpen}
          className={`justify-between ${className}`}
        >
          <div className="flex items-center gap-2">
            {selectedAPIData ? (
              <>
                <ExternalLink className="h-4 w-4" />
                <span className="truncate">{selectedAPIData.name}</span>
                {selectedAPIData.is_mcp_server && (
                  <Badge variant="secondary" className="text-xs">
                    MCP
                  </Badge>
                )}
              </>
            ) : (
              <>
                <ExternalLink className="h-4 w-4" />
                <span>{placeholder}</span>
              </>
            )}
          </div>
          <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0" align="start">
        <div className="p-3 border-b">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar APIs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
        
        <div className="max-h-[300px] overflow-y-auto">
          {filteredAPIs.length > 0 ? (
            <div className="p-1">
              {filteredAPIs.map((api) => (
                <div
                  key={api.id}
                  className={`relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground ${
                    selectedAPI === api.id ? 'bg-accent text-accent-foreground' : ''
                  }`}
                  onClick={() => handleSelect(api.id)}
                >
                  <div className="flex items-center gap-2 flex-1">
                    <ExternalLink className="h-4 w-4" />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{api.name}</div>
                      {api.description && (
                        <div className="text-xs text-muted-foreground truncate">
                          {api.description}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {api.is_mcp_server && (
                      <Badge variant="secondary" className="text-xs">
                        MCP
                      </Badge>
                    )}
                    <Badge variant="outline" className="text-xs">
                      {api.auth_type !== 'none' ? api.auth_type : 'Sem auth'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-sm text-muted-foreground">
              {searchTerm ? 'Nenhuma API encontrada' : 'Nenhuma API disponível'}
            </div>
          )}
        </div>

        {showAllAPIs && (
          <div className="p-3 border-t">
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => {
                // Aqui você pode abrir o modal de configuração de APIs
                window.location.hash = '#admin?tab=external-api';
              }}
            >
              <Settings className="h-4 w-4 mr-2" />
              Gerenciar APIs
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default APISelector; 