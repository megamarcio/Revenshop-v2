// Script para testar configurações da empresa
// Execute no console do navegador para testar

console.log('🧪 Testando configurações da empresa...');

// Verificar o que está no localStorage
const stored = localStorage.getItem('company-settings');
console.log('📋 Configurações atuais no localStorage:', stored);

if (stored) {
  const parsed = JSON.parse(stored);
  console.log('📋 Configurações parseadas:', parsed);
} else {
  console.log('⚠️ Nenhuma configuração encontrada no localStorage');
}

// Testar salvamento
const testSettings = {
  company_name: 'Minha Empresa Teste',
  company_logo: 'https://via.placeholder.com/32x32',
  trade_name: 'Empresa Teste Ltda',
  cnpj: '12.345.678/0001-90',
  address: 'Rua Teste, 123',
  city: 'São Paulo',
  phone: '(11) 99999-9999',
  email: 'contato@empresateste.com'
};

// Função para salvar configurações de teste
function salvarConfiguracoesTeste() {
  console.log('💾 Salvando configurações de teste...');
  localStorage.setItem('company-settings', JSON.stringify(testSettings));
  
  // Disparar evento de atualização
  window.dispatchEvent(new CustomEvent('companySettingsUpdated'));
  
  console.log('✅ Configurações de teste salvas!');
  console.log('📋 Dados salvos:', testSettings);
}

// Função para limpar configurações
function limparConfiguracoes() {
  console.log('🗑️ Limpando configurações...');
  localStorage.removeItem('company-settings');
  
  // Disparar evento de atualização
  window.dispatchEvent(new CustomEvent('companySettingsUpdated'));
  
  console.log('✅ Configurações limpas!');
}

console.log('🎯 Funções disponíveis:');
console.log('- salvarConfiguracoesTeste() - Salva configurações de teste');
console.log('- limparConfiguracoes() - Remove todas as configurações');

// Disponibilizar funções globalmente
window.salvarConfiguracoesTeste = salvarConfiguracoesTeste;
window.limparConfiguracoes = limparConfiguracoes; 