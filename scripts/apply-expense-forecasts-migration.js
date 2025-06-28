#!/usr/bin/env node

/**
 * Script para aplicar a migration de Expense Forecasts no Supabase
 * Uso: node scripts/apply-expense-forecasts-migration.js
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

console.log('🚀 Aplicando Migration: Expense Forecasts');
console.log('📅 Data:', new Date().toISOString());

// Verificar variáveis de ambiente
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Erro: Variáveis de ambiente não configuradas');
  console.log('📋 Configure as seguintes variáveis:');
  console.log('   - VITE_SUPABASE_URL');
  console.log('   - SUPABASE_SERVICE_ROLE_KEY (ou VITE_SUPABASE_ANON_KEY)');
  console.log('');
  console.log('💡 Alternativamente, copie o SQL abaixo e execute no dashboard do Supabase:');
  console.log('');
  
  // Mostrar o SQL da migration
  const migrationPath = path.join(__dirname, '../supabase/migrations/20240101000032_create_expense_forecasts_table.sql');
  try {
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    console.log('📄 SQL da Migration:');
    console.log('─'.repeat(50));
    console.log(migrationSQL);
    console.log('─'.repeat(50));
  } catch (error) {
    console.error('❌ Erro ao ler arquivo de migration:', error.message);
  }
  
  process.exit(1);
}

// Inicializar cliente Supabase
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function applyMigration() {
  try {
    console.log('🔍 Verificando conexão com Supabase...');
    
    // Testar conexão
    const { data: testData, error: testError } = await supabase
      .from('profiles')
      .select('count')
      .limit(1);
    
    if (testError) {
      throw new Error(`Falha na conexão: ${testError.message}`);
    }
    
    console.log('✅ Conexão com Supabase estabelecida');
    
    // Verificar se tabela já existe
    console.log('🔍 Verificando se tabela expense_forecasts já existe...');
    
    const { data: tableExists, error: checkError } = await supabase
      .from('expense_forecasts')
      .select('count')
      .limit(1);
    
    if (!checkError) {
      console.log('⚠️  Tabela expense_forecasts já existe');
      console.log('ℹ️  Migration já foi aplicada anteriormente');
      return;
    }
    
    // Ler migration SQL
    const migrationPath = path.join(__dirname, '../supabase/migrations/20240101000032_create_expense_forecasts_table.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    console.log('📄 Aplicando migration SQL...');
    
    // Executar migration usando RPC (se disponível) ou mostrar instruções
    console.log('⚠️  Não é possível executar SQL diretamente via cliente JavaScript');
    console.log('📋 Por favor, execute o SQL abaixo no dashboard do Supabase:');
    console.log('');
    console.log('🔗 URL do Dashboard:', supabaseUrl.replace('https://', 'https://app.supabase.com/project/'));
    console.log('📍 Navegue para: SQL Editor → New Query');
    console.log('');
    console.log('📄 SQL para executar:');
    console.log('─'.repeat(50));
    console.log(migrationSQL);
    console.log('─'.repeat(50));
    
    console.log('');
    console.log('✅ Após executar o SQL, o sistema estará pronto para produção');
    
  } catch (error) {
    console.error('❌ Erro durante aplicação da migration:', error.message);
    process.exit(1);
  }
}

// Executar
applyMigration(); 