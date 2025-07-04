// Sistema de versionamento do REVENSHOP
// A versão é incrementada automaticamente a cada alteração
// Desenvolvido por Marcio Cavs (@marcio_r3)

export const APP_VERSION = {
  major: 2,
  minor: 0,
  patch: 12, // Incrementar a cada alteração
  build: Date.now(), // Timestamp do build
  toString: function() {
    return `v${this.major}.${this.minor.toString().padStart(3, '0')}`;
  },
  getFullVersion: function() {
    return `v${this.major}.${this.minor.toString().padStart(3, '0')}.${this.patch.toString().padStart(3, '0')}`;
  }
};

// Informações do desenvolvedor
export const DEVELOPER_INFO = {
  name: 'Marcio Cavs',
  instagram: '@marcio_r3',
  instagramUrl: 'https://instagram.com/marcio_r3',
  copyright: `© ${new Date().getFullYear()} REVENSHOP - Todos os direitos reservados`
};

// Histórico de versões
export const VERSION_HISTORY = [
  {
    version: 'v2.012',
    date: '2024-07-07',
    description: 'Implementação completa do módulo Fluxo de Caixa com funcionalidades avançadas'
  },
  {
    version: 'v2.000',
    date: '2024-01-01',
    description: 'Versão inicial do REVENSHOP v2'
  },
  {
    version: 'v2.001',
    date: '2024-01-15',
    description: 'Correções no sistema de manutenção'
  },
  {
    version: 'v2.002',
    date: '2024-01-20',
    description: 'Melhorias de responsividade mobile'
  },
  {
    version: 'v2.004',
    date: '2025-06-22',
    description: 'Atualização automática - patch 4'
  },
  {
    version: 'v2.005',
    date: '2025-06-22',
    description: 'Atualização automática - patch 5'
  },
  {
    version: 'v2.006',
    date: '2025-06-28',
    description: 'Atualização automática - patch 6'
  },
  {
    version: 'v2.007',
    date: '2025-06-28',
    description: 'Atualização automática - patch 7'
  },
  {
    version: 'v2.008',
    date: '2025-06-28',
    description: 'Atualização automática - patch 8'
  },
  {
    version: 'v2.009',
    date: '2025-06-28',
    description: 'Atualização automática - patch 9'
  },
  {
    version: 'v2.010',
    date: '2025-06-28',
    description: 'Atualização automática - patch 10'
  },
  {
    version: 'v2.011',
    date: '2025-06-28',
    description: 'Atualização automática - patch 11'
  },
  {
    version: 'v2.003',
    date: '2024-01-25',
    description: 'Correção do scroll no formulário de manutenção'
  }
];

export default APP_VERSION; 