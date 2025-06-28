import { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export interface WebsiteSettings {
  id: string;
  name: string;
  url: string;
  category: 'government' | 'commercial' | 'tools' | 'other';
  description?: string;
  icon?: string;
  is_active: boolean;
  sort_order: number;
}

export interface WebsiteSettingsInsert {
  name: string;
  url: string;
  category: 'government' | 'commercial' | 'tools' | 'other';
  description?: string;
  icon?: string;
}

const defaultWebsites: WebsiteSettings[] = [
  {
    id: '1',
    name: 'DETRAN SP',
    url: 'https://www.detran.sp.gov.br/',
    category: 'government',
    description: 'Departamento de Trânsito de São Paulo',
    icon: 'Building2',
    is_active: true,
    sort_order: 1,
  },
  {
    id: '2',
    name: 'DENATRAN',
    url: 'https://www.gov.br/infraestrutura/pt-br/assuntos/transito',
    category: 'government',
    description: 'Departamento Nacional de Trânsito',
    icon: 'Shield',
    is_active: true,
    sort_order: 2,
  },
  {
    id: '3',
    name: 'Tabela FIPE',
    url: 'https://veiculos.fipe.org.br/',
    category: 'tools',
    description: 'Consulta de preços de veículos',
    icon: 'Calculator',
    is_active: true,
    sort_order: 3,
  },
  {
    id: '4',
    name: 'SINTEGRA',
    url: 'http://www.sintegra.gov.br/',
    category: 'government',
    description: 'Sistema Integrado de Informações sobre Operações Interestaduais',
    icon: 'FileText',
    is_active: true,
    sort_order: 4,
  },
  {
    id: '5',
    name: 'Receita Federal',
    url: 'https://www.gov.br/receitafederal/pt-br',
    category: 'government',
    description: 'Portal da Receita Federal do Brasil',
    icon: 'Building',
    is_active: true,
    sort_order: 5,
  },
  {
    id: '6',
    name: 'WebMotors',
    url: 'https://www.webmotors.com.br/',
    category: 'commercial',
    description: 'Portal de veículos usados e novos',
    icon: 'Car',
    is_active: true,
    sort_order: 6,
  },
  {
    id: '7',
    name: 'MercadoLivre Veículos',
    url: 'https://carros.mercadolivre.com.br/',
    category: 'commercial',
    description: 'Marketplace de veículos',
    icon: 'ShoppingCart',
    is_active: true,
    sort_order: 7,
  },
];

// Função para disparar evento de atualização
const dispatchWebsiteSettingsUpdate = () => {
  const event = new CustomEvent('websiteSettingsUpdated', {
    detail: { timestamp: Date.now() }
  });
  window.dispatchEvent(event);
  console.log('🔄 Evento websiteSettingsUpdated disparado');
};

export const useWebsiteSettings = () => {
  const [websites, setWebsites] = useState<WebsiteSettings[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(true); // Para saber se estamos usando banco ou localStorage

  useEffect(() => {
    loadWebsites();
  }, []);

  const loadWebsites = async () => {
    try {
      console.log('🌐 Carregando sites úteis...');
      
      // Tentar carregar do banco primeiro
      const { data, error } = await supabase
        .from('website_settings')
        .select('*')
        .order('sort_order', { ascending: true });

      if (!error && data) {
        console.log('✅ Sites carregados do banco:', data.length);
        setWebsites(data);
        setIsOnline(true);
        
        // Sincronizar com localStorage
        localStorage.setItem('website-settings', JSON.stringify(data));
      } else {
        throw error;
      }
    } catch (error) {
      console.warn('⚠️ Erro ao carregar do banco, usando localStorage:', error);
      setIsOnline(false);
      
      // Fallback para localStorage
      try {
        const stored = localStorage.getItem('website-settings');
        if (stored) {
          const parsed = JSON.parse(stored);
          console.log('📦 Sites carregados do localStorage:', parsed.length);
          setWebsites(parsed);
        } else {
          // Inicializar com sites padrão
          console.log('🏗️ Inicializando com sites padrão');
          setWebsites(defaultWebsites);
          localStorage.setItem('website-settings', JSON.stringify(defaultWebsites));
        }
      } catch (localError) {
        console.error('❌ Erro no localStorage, usando padrões:', localError);
        setWebsites(defaultWebsites);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const saveWebsites = async (newWebsites: WebsiteSettings[]) => {
    try {
      if (isOnline) {
        console.log('💾 Salvando no banco...');
        // Tentar salvar no banco primeiro
        await Promise.all(
          newWebsites.map(async (website) => {
            const { error } = await supabase
              .from('website_settings')
              .upsert({
                id: website.id,
                name: website.name,
                url: website.url,
                category: website.category,
                description: website.description || null,
                icon: website.icon || null,
                is_active: website.is_active,
                sort_order: website.sort_order,
              });
              
            if (error) throw error;
          })
        );
        console.log('✅ Sites salvos no banco');
      } else {
        console.log('📦 Salvando no localStorage (modo offline)');
      }
      
      // Sempre salvar no localStorage como backup
      localStorage.setItem('website-settings', JSON.stringify(newWebsites));
      setWebsites(newWebsites);
      
      // Disparar evento para notificar outros componentes
      dispatchWebsiteSettingsUpdate();
      
    } catch (error) {
      console.error('❌ Erro ao salvar no banco, usando localStorage:', error);
      setIsOnline(false);
      
      // Fallback para localStorage
      localStorage.setItem('website-settings', JSON.stringify(newWebsites));
      setWebsites(newWebsites);
      
      // Disparar evento mesmo em caso de erro
      dispatchWebsiteSettingsUpdate();
      
      toast({
        title: 'Aviso',
        description: 'Sites salvos localmente. Será sincronizado quando o banco estiver disponível.',
        variant: 'default',
      });
    }
  };

  const createWebsite = async (websiteData: WebsiteSettingsInsert) => {
    const newWebsite: WebsiteSettings = {
      id: crypto.randomUUID(), // Usar UUID ao invés de timestamp
      ...websiteData,
      is_active: true,
      sort_order: websites.length + 1,
    };

    const updatedWebsites = [...websites, newWebsite];
    await saveWebsites(updatedWebsites);
    
    toast({
      title: 'Sucesso!',
      description: `Site "${websiteData.name}" adicionado com sucesso.`,
    });
  };

  const updateWebsite = async (id: string, updates: Partial<WebsiteSettings>) => {
    const updatedWebsites = websites.map(website =>
      website.id === id ? { ...website, ...updates } : website
    );
    
    await saveWebsites(updatedWebsites);
    
    toast({
      title: 'Sucesso!',
      description: 'Site atualizado com sucesso.',
    });
  };

  const deleteWebsite = async (id: string) => {
    try {
      if (isOnline) {
        console.log('🗑️ Removendo do banco...');
        const { error } = await supabase
          .from('website_settings')
          .delete()
          .eq('id', id);
          
        if (error) throw error;
        console.log('✅ Site removido do banco');
      }
      
      const updatedWebsites = websites.filter(website => website.id !== id);
      localStorage.setItem('website-settings', JSON.stringify(updatedWebsites));
      setWebsites(updatedWebsites);
      
      // Disparar evento para notificar outros componentes
      dispatchWebsiteSettingsUpdate();
      
      toast({
        title: 'Sucesso!',
        description: 'Site removido com sucesso.',
      });
    } catch (error) {
      console.error('❌ Erro ao remover do banco:', error);
      setIsOnline(false);
      
      // Fallback para localStorage
      const updatedWebsites = websites.filter(website => website.id !== id);
      localStorage.setItem('website-settings', JSON.stringify(updatedWebsites));
      setWebsites(updatedWebsites);
      
      // Disparar evento mesmo em caso de erro
      dispatchWebsiteSettingsUpdate();
      
      toast({
        title: 'Aviso',
        description: 'Site removido localmente. Será sincronizado quando o banco estiver disponível.',
      });
    }
  };

  const activeWebsites = websites.filter(w => w.is_active);

  return {
    websites: activeWebsites,
    allWebsites: websites,
    isLoading,
    isOnline,
    error: null,
    createWebsite,
    updateWebsite,
    deleteWebsite,
    loadWebsites, // Expor para permitir recarregar manualmente
  };
};

// Hook otimizado para componentes que só precisam ler os dados
export const useWebsiteSettingsConsumer = () => {
  const [websites, setWebsites] = useState<WebsiteSettings[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadWebsitesFromStorage = () => {
    try {
      const stored = localStorage.getItem('website-settings');
      if (stored) {
        const parsed = JSON.parse(stored);
        const activeWebsites = parsed.filter((w: WebsiteSettings) => w.is_active);
        setWebsites(activeWebsites);
        console.log('🌐 Consumer - Sites carregados:', activeWebsites.length);
      } else {
        // Usar sites padrão
        const activeDefaults = defaultWebsites.filter(w => w.is_active);
        setWebsites(activeDefaults);
        console.log('🌐 Consumer - Usando sites padrão:', activeDefaults.length);
      }
    } catch (error) {
      console.error('❌ Consumer - Erro ao carregar sites:', error);
      const activeDefaults = defaultWebsites.filter(w => w.is_active);
      setWebsites(activeDefaults);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Carregar inicialmente
    loadWebsitesFromStorage();

    // Escutar mudanças
    const handleWebsiteSettingsUpdate = () => {
      console.log('🔄 Consumer - Recarregando sites após atualização');
      loadWebsitesFromStorage();
    };

    window.addEventListener('websiteSettingsUpdated', handleWebsiteSettingsUpdate);

    return () => {
      window.removeEventListener('websiteSettingsUpdated', handleWebsiteSettingsUpdate);
    };
  }, []);

  return {
    websites,
    isLoading,
  };
}; 