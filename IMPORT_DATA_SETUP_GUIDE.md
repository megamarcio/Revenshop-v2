# Guia de Configuração - Sistema de Importação de Dados

## Problemas Identificados

Durante a verificação do sistema de importação, foram identificados os seguintes problemas:

### ❌ Problemas Encontrados:
1. **Tabela `import_data` não existe** (Erro 42P01)
2. **Campo `summary_instructions` não existe na tabela `ai_settings`**
3. **Menu de navegação não redireciona corretamente**
4. **Descrições sendo truncadas na interface**

### ✅ Problemas Corrigidos:
- ✅ **Descrições não truncadas**: Adicionado `break-words` para quebra de linha adequada
- ✅ **Interface responsiva**: Cards e layouts otimizados
- ✅ **Modo simplificado**: Sistema funciona mesmo sem as migrações

## Soluções

### 1. Aplicar Migração do Banco de Dados

Para resolver os problemas de banco de dados, execute o seguinte:

1. **Acesse o painel do Supabase**
   - Vá para [supabase.com](https://supabase.com)
   - Entre no seu projeto

2. **Execute a migração manual**
   - Vá em `Database` > `SQL Editor`
   - Copie e execute o conteúdo do arquivo: `scripts/manual-import-data-migration.sql`

3. **Verifique se funcionou**
   - A tabela `import_data` deve aparecer em `Database` > `Tables`
   - A coluna `summary_instructions` deve aparecer na tabela `ai_settings`

### 2. Funcionalidades Disponíveis

#### Modo Atual (Simplificado):
- ✅ **Upload de CSV**: Funciona normalmente
- ✅ **Classificação automática**: Receitas/Despesas baseado no valor
- ✅ **Edição manual**: Modal de edição para cada registro
- ✅ **Importação**: Criação de receitas, despesas e previsões
- ❌ **Persistência**: Salvar registros pendentes (desabilitado)
- ❌ **IA para resumos**: Funcionalidade de IA (desabilitada)

#### Modo Completo (Após Migração):
- ✅ **Todas as funcionalidades do modo simplificado**
- ✅ **Persistência**: Salvar e gerenciar registros pendentes
- ✅ **IA para resumos**: Resumo automático de descrições
- ✅ **Configurações de IA**: Instruções personalizáveis
- ✅ **Histórico**: Controle de importações realizadas

### 3. Navegação do Menu

O menu lateral está configurado corretamente:
- **Financeiro** > **Importação** leva para a página de importação
- A aba `import-data` é renderizada corretamente no `FinancialManagement`

### 4. Formato de Dados CSV

Exemplo de formato suportado:
```csv
Date,Amount,Business,Category,TransactionID,Account,Status
2025-06-02,(3.99),PAYPAL DES:INST XFER ID:GOOGLE MARCELLO,Software,v9EYEeZVRZHKAjnNpq1yuNjN3OE4L7I0KM6xO,Marcio R3 Account,Fixa
2025-06-02,2311.00,Receita de Vendas Janeiro,Vendas,0JkKkPNDZNUPde984DmNiB8BPy3EAnFvOeQZg,Marcio R3 Account,Variavel
```

**Regras de Classificação:**
- Valores negativos ou entre parênteses = **Despesas**
- Valores positivos = **Receitas**
- Status "Fixa" = **Previsões** (recorrentes)
- Status "Variavel" = **Pontuais** (únicos)

### 5. Próximos Passos

1. **Execute a migração** para habilitar todas as funcionalidades
2. **Configure a chave OpenAI** em Admin > Configurações IA
3. **Teste a importação** com dados reais
4. **Configure instruções de IA** personalizadas se necessário

## Estrutura Técnica

### Arquivos Modificados:
- `src/components/Financial/DataImportPage.tsx` - Interface principal
- `src/hooks/useImportData.ts` - Hook para persistência
- `src/hooks/useAISummary.ts` - Hook para IA
- `supabase/migrations/20240101000037_create_import_data_table.sql` - Migração
- `scripts/manual-import-data-migration.sql` - Script manual

### Funcionalidades Implementadas:
- Parser CSV robusto com suporte a vírgulas em campos
- Classificação automática inteligente
- Interface compacta e responsiva
- Sistema de edição individual e em lote
- Integração com IA para resumos
- Persistência de dados não importados
- Controle de registros pendentes

## Status Atual

✅ **Sistema Funcional**: O sistema de importação está funcionando em modo simplificado
⚠️ **Migração Pendente**: Execute a migração para funcionalidades completas
📋 **Próxima Ação**: Aplicar migração do banco de dados 

## 🔍 **O que é essa migração?**

A migração cria a infraestrutura de banco de dados necessária para o sistema de importação financeira funcionar completamente. Sem ela, o sistema funciona apenas em "modo simplificado".

## 📋 **O que a migração faz:**

### 1. **Cria a tabela `import_data`**
Esta tabela armazena dados de importação pendentes para processamento posterior:

```sql
CREATE TABLE import_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  original_date DATE NOT NULL,
  original_amount DECIMAL(12,2) NOT NULL,
  original_business TEXT NOT NULL,
  -- ... outros campos para classificação e controle
);
```

### 2. **Adiciona campo `summary_instructions` na tabela `ai_settings`**
Para personalizar as instruções de resumo da IA:

```sql
ALTER TABLE ai_settings 
ADD COLUMN summary_instructions TEXT DEFAULT 'Resuma esta descrição...';
```

### 3. **Cria funções, índices e políticas de segurança**
- Funções para buscar e salvar configurações de IA
- Índices para performance
- Políticas RLS (Row Level Security)

## 🚀 **Como executar a migração:**

### **Opção 1: Via Painel do Supabase (Recomendado)**

1. **Acesse seu projeto no Supabase**
   - Vá para [supabase.com](https://supabase.com)
   - Entre no seu projeto: `ctdajbfmgmkhqueskjvk`

2. **Abra o SQL Editor**
   - No painel lateral, clique em **"Database"**
   - Clique em **"SQL Editor"**

3. **Execute o script**
   - Copie todo o conteúdo do arquivo `scripts/manual-import-data-migration.sql`
   - Cole no editor SQL
   - Clique em **"Run"** ou **"Execute"**

### **Opção 2: Via Supabase CLI (Se disponível)**

```bash
npx supabase db push
```

## 📊 **Antes vs Depois da Migração:**

### **ANTES (Modo Atual - Simplificado):**
- ✅ Upload e processamento de CSV
- ✅ Classificação automática 
- ✅ Importação básica
- ❌ Salvar registros pendentes
- ❌ IA para resumos
- ❌ Configurações personalizáveis

### **DEPOIS (Modo Completo):**
- ✅ **Todas as funcionalidades acima +**
- ✅ **Persistência**: Salvar dados não importados
- ✅ **IA Inteligente**: Resumo automático de descrições
- ✅ **Configurações**: Instruções personalizáveis para IA
- ✅ **Histórico**: Controle de importações realizadas
- ✅ **Gestão**: Marcar como importado, deletar registros

## 🔧 **Verificação:**

Após executar a migração, você pode verificar se funcionou:

1. **No painel do Supabase:**
   - Vá em **Database > Tables**
   - Deve aparecer a tabela **`import_data`**
   - Na tabela **`ai_settings`** deve ter a coluna **`summary_instructions`**

2. **Na aplicação:**
   - O aviso de "Modo Simplificado" deve desaparecer
   - O botão "Salvar Pendentes" deve ficar habilitado
   - As funcionalidades de IA devem funcionar (se configurada a chave OpenAI)

## ⚠️ **Importante:**

Esta migração é **segura** e **não afeta dados existentes**. Ela apenas:
- **Adiciona** novas tabelas e campos
- **Não modifica** ou **deleta** dados existentes
- **Usa** `CREATE TABLE IF NOT EXISTS` e `ADD COLUMN IF NOT EXISTS`

Quer que eu te ajude a executar a migração ou tem alguma dúvida específica sobre ela? 