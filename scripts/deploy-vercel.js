#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Iniciando deploy no Vercel...');

// Verificar se está logado no Vercel
try {
  const whoami = execSync('npx vercel whoami', { encoding: 'utf8' });
  console.log(`✅ Logado como: ${whoami.trim()}`);
} catch (error) {
  console.error('❌ Não está logado no Vercel. Execute: npx vercel login');
  process.exit(1);
}

// Fazer build do projeto
console.log('📦 Fazendo build do projeto...');
try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Build concluído com sucesso!');
} catch (error) {
  console.error('❌ Erro no build:', error.message);
  process.exit(1);
}

// Verificar se dist existe
if (!fs.existsSync('dist')) {
  console.error('❌ Pasta dist não encontrada. Build falhou.');
  process.exit(1);
}

// Deploy no Vercel
console.log('🌐 Fazendo deploy no Vercel...');
try {
  const deployResult = execSync('npx vercel --prod', { encoding: 'utf8' });
  console.log('✅ Deploy concluído com sucesso!');
  console.log('🔗 URL:', deployResult.trim());
  
  // Extrair URL do resultado
  const lines = deployResult.split('\n');
  const urlLine = lines.find(line => line.includes('https://'));
  if (urlLine) {
    const url = urlLine.trim();
    console.log(`\n🎉 Aplicação disponível em: ${url}`);
    
    // Salvar URL em arquivo para referência
    fs.writeFileSync('deployment-url.txt', url);
    console.log('📝 URL salva em deployment-url.txt');
  }
  
} catch (error) {
  console.error('❌ Erro no deploy:', error.message);
  process.exit(1);
}

console.log('\n🎯 Deploy concluído com sucesso!');
console.log('📋 Próximos passos:');
console.log('1. Testar a aplicação na URL fornecida');
console.log('2. Configurar variáveis de ambiente se necessário');
console.log('3. Configurar domínio personalizado se desejado'); 