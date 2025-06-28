import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  History, 
  Edit, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  ExternalLink,
  Brain,
  Eye,
  EyeOff
} from 'lucide-react';
import { ExternalAPI } from '@/types/externalApi';

interface APIListViewProps {
  apis: ExternalAPI[];
  onTest: (api: ExternalAPI) => void;
  onViewHistory: (api: ExternalAPI) => void;
  onEdit: (api: ExternalAPI) => void;
  onDelete: (api: ExternalAPI) => void;
}

const APIListView: React.FC<APIListViewProps> = ({
  apis,
  onTest,
  onViewHistory,
  onEdit,
  onDelete
}) => {
  const getStatusIcon = (api: ExternalAPI) => {
    if (api.is_active) {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    } else {
      return <XCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getStatusBadge = (api: ExternalAPI) => {
    if (api.is_active) {
      return <Badge variant="default" className="bg-green-500">Ativa</Badge>;
    } else {
      return <Badge variant="secondary">Inativa</Badge>;
    }
  };

  const getAuthBadge = (api: ExternalAPI) => {
    const authTypes = {
      none: { label: 'Nenhuma', variant: 'secondary' as const },
      api_key: { label: 'API Key', variant: 'default' as const },
      bearer: { label: 'Bearer', variant: 'default' as const },
      basic: { label: 'Basic', variant: 'default' as const }
    };
    
    const auth = authTypes[api.auth_type] || authTypes.none;
    return <Badge variant={auth.variant}>{auth.label}</Badge>;
  };

  const truncateUrl = (url: string, maxLength: number = 50) => {
    if (url.length <= maxLength) return url;
    return url.substring(0, maxLength) + '...';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  if (apis.length === 0) {
    return (
      <div className="text-center py-12">
        <ExternalLink className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-lg font-medium mb-2">Nenhuma API encontrada</h3>
        <p className="text-muted-foreground">
          Tente ajustar os filtros de busca.
        </p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">Status</TableHead>
            <TableHead>Nome</TableHead>
            <TableHead>URL Base</TableHead>
            <TableHead>Autenticação</TableHead>
            <TableHead>Criada em</TableHead>
            <TableHead className="w-32">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {apis.map((api) => (
            <TableRow key={api.id} className="hover:bg-muted/50">
              <TableCell>
                <div className="flex items-center justify-center">
                  {getStatusIcon(api)}
                </div>
              </TableCell>
              
              <TableCell>
                <div className="space-y-1">
                  <div className="font-medium">{api.name}</div>
                  {api.observations && (
                    <div className="text-xs text-muted-foreground">
                      {api.observations.length > 60 
                        ? api.observations.substring(0, 60) + '...'
                        : api.observations
                      }
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    {getStatusBadge(api)}
                    {/* Informação de IA desabilitada */}
                    <div className="flex items-center gap-1 text-xs text-blue-600 opacity-50 pointer-events-none">
                      <Brain className="h-3 w-3" />
                      <span>IA</span>
                    </div>
                  </div>
                </div>
              </TableCell>
              
              <TableCell>
                <div className="font-mono text-sm">
                  <a 
                    href={api.base_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 hover:underline"
                    title={api.base_url}
                  >
                    {truncateUrl(api.base_url)}
                  </a>
                </div>
              </TableCell>
              
              <TableCell>
                {getAuthBadge(api)}
              </TableCell>
              
              <TableCell className="text-sm text-muted-foreground">
                {formatDate(api.created_at)}
              </TableCell>
              
              <TableCell>
                <div className="flex items-center gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onTest(api)}
                    title="Testar API"
                  >
                    <Play className="h-4 w-4" />
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onViewHistory(api)}
                    title="Ver histórico"
                  >
                    <History className="h-4 w-4" />
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onEdit(api)}
                    title="Editar API"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onDelete(api)}
                    title="Excluir API"
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default APIListView; 