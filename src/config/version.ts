// Sistema de versionamento do REVENSHOP
// A versão é incrementada automaticamente a cada alteração

export const APP_VERSION = {
  major: 2,
  minor: 0,
  patch: 5, // Incrementar a cada alteração
  build: Date.now(), // Timestamp do build
  toString: function() {
    return `v${this.major}.${this.minor.toString().padStart(3, '0')}`;
  },
  getFullVersion: function() {
    return `v${this.major}.${this.minor.toString().padStart(3, '0')}.${this.patch.toString().padStart(3, '0')}`;
  }
};

// Histórico de versões
export const VERSION_HISTORY = [
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
    version: 'v2.003',
    date: '2024-01-25',
    description: 'Correção do scroll no formulário de manutenção'
  }
];

export default APP_VERSION; 