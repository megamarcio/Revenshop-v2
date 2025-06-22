#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Caminho para o arquivo de versão
const versionFile = path.join(__dirname, '../src/config/version.ts');

// Função para ler o arquivo de versão atual
function readVersionFile() {
  try {
    const content = fs.readFileSync(versionFile, 'utf8');
    return content;
  } catch (error) {
    console.error('Erro ao ler arquivo de versão:', error);
    process.exit(1);
  }
}

// Função para extrair a versão atual
function getCurrentVersion(content) {
  const match = content.match(/patch:\s*(\d+)/);
  return match ? parseInt(match[1]) : 0;
}

// Função para atualizar a versão
function updateVersion(newPatch) {
  const content = readVersionFile();
  const currentPatch = getCurrentVersion(content);
  
  // Atualizar o patch
  const updatedContent = content.replace(
    /patch:\s*\d+/,
    `patch: ${newPatch}`
  );
  
  // Adicionar nova entrada no histórico
  const today = new Date().toISOString().split('T')[0];
  const newHistoryEntry = `  {
    version: 'v2.${newPatch.toString().padStart(3, '0')}',
    date: '${today}',
    description: 'Atualização automática - patch ${newPatch}'
  },`;
  
  // Inserir nova entrada no histórico (após a última entrada)
  const historyMatch = updatedContent.match(/(\s*\];\s*)/);
  if (historyMatch) {
    const beforeHistory = updatedContent.substring(0, updatedContent.lastIndexOf('  {'));
    const afterHistory = updatedContent.substring(updatedContent.lastIndexOf('  },') + 4);
    
    const finalContent = beforeHistory + newHistoryEntry + afterHistory;
    
    // Escrever o arquivo atualizado
    fs.writeFileSync(versionFile, finalContent, 'utf8');
    
    console.log(`✅ Versão atualizada de v2.${currentPatch.toString().padStart(3, '0')} para v2.${newPatch.toString().padStart(3, '0')}`);
    console.log(`📅 Data: ${today}`);
  } else {
    console.error('❌ Não foi possível encontrar o histórico de versões');
    process.exit(1);
  }
}

// Função para mostrar a versão atual
function showCurrentVersion() {
  const content = readVersionFile();
  const currentPatch = getCurrentVersion(content);
  console.log(`📋 Versão atual: v2.${currentPatch.toString().padStart(3, '0')}`);
}

// Função para mostrar o histórico
function showHistory() {
  const content = readVersionFile();
  const historyMatch = content.match(/export const VERSION_HISTORY = \[([\s\S]*?)\];/);
  
  if (historyMatch) {
    console.log('📚 Histórico de versões:');
    console.log(historyMatch[1].trim());
  } else {
    console.log('❌ Histórico não encontrado');
  }
}

// Processar argumentos da linha de comando
const args = process.argv.slice(2);

if (args.length === 0) {
  console.log('🔄 Script de atualização de versão do REVENSHOP');
  console.log('');
  console.log('Uso:');
  console.log('  node update-version.js current    - Mostra a versão atual');
  console.log('  node update-version.js history    - Mostra o histórico de versões');
  console.log('  node update-version.js bump       - Incrementa a versão automaticamente');
  console.log('  node update-version.js <number>   - Define a versão para o número especificado');
  console.log('');
  showCurrentVersion();
} else {
  const command = args[0];
  
  switch (command) {
    case 'current':
      showCurrentVersion();
      break;
      
    case 'history':
      showHistory();
      break;
      
    case 'bump':
      const content = readVersionFile();
      const currentPatch = getCurrentVersion(content);
      updateVersion(currentPatch + 1);
      break;
      
    default:
      const newPatch = parseInt(command);
      if (isNaN(newPatch) || newPatch < 0) {
        console.error('❌ Número de versão inválido. Use um número positivo.');
        process.exit(1);
      }
      updateVersion(newPatch);
      break;
  }
} 