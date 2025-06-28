# Guia de Teste - Sites Úteis Reativos

## Problema Resolvido
O menu de "Sites Úteis" no cabeçalho não atualizava automaticamente quando alterações eram feitas na página de configurações.

## Solução Implementada
Sistema reativo com eventos customizados que sincroniza mudanças em tempo real entre a página de configurações e o menu do cabeçalho.

## Como Testar

### 1. Teste Básico de Funcionamento

1. **Abra o sistema** no navegador
2. **Vá para Configurações → Sites**
3. **Abra o Console do Navegador** (F12)
4. **Execute o teste completo:**
   ```javascript
   testWebsiteSettings()
   ```

### 2. Teste do Sistema Reativo

1. **Na página de configurações de sites**, clique no botão **"🧪 Testar"**
2. **Observe os logs no console** - deve aparecer:
   ```
   🧪 Evento de teste disparado para Header
   🔄 Consumer - Recarregando sites após atualização
   🌐 Header - Configured websites: X [...]
   ```

### 3. Teste Manual de Sincronização

1. **Abra duas abas:**
   - Aba 1: Configurações → Sites
   - Aba 2: Qualquer página (para ver o header)

2. **Na Aba 1**, adicione um novo site:
   - Nome: "Teste Reativo"
   - URL: "https://exemplo.com"
   - Categoria: "Outros"

3. **Na Aba 2**, clique no ícone 🌐 no header
4. **Verifique se o novo site aparece** no dropdown

### 4. Teste de Edição

1. **Edite um site existente** na página de configurações
2. **Clique no menu 🌐 no header**
3. **Verifique se as alterações apareceram**

### 5. Teste de Remoção

1. **Remova um site** na página de configurações
2. **Verifique se ele desapareceu** do menu no header

## Scripts de Teste Disponíveis

### Teste Completo
```javascript
testWebsiteSettings()
```

### Teste Específico de Reatividade
```javascript
testWebsiteReactivity()
```

## Logs Esperados

### No Console (quando funcionando corretamente):
```
🌐 Carregando sites úteis...
✅ Sites carregados do banco: 7
🌐 Consumer - Sites carregados: 7
🌐 Header - Configured websites: 7 [...]
```

### Quando uma alteração é feita:
```
💾 Salvando no banco...
✅ Sites salvos no banco
🔄 Evento websiteSettingsUpdated disparado
🔄 Consumer - Recarregando sites após atualização
🌐 Consumer - Sites carregados: 8
🌐 Header - Configured websites: 8 [...]
```

## Indicadores Visuais

### Na Página de Configurações:
- **Badge "Online"** 🟢 = Conectado ao banco
- **Badge "Offline"** 🔴 = Usando localStorage
- **Botão "🧪 Testar"** = Dispara evento de teste

### No Header:
- **Ícone 🌐** = Menu de sites úteis
- **Contador** = Mostra quantidade de sites: "Sites Úteis (7)"

## Solução de Problemas

### Se o menu não atualizar:
1. Verifique os logs no console
2. Execute `testWebsiteReactivity()`
3. Clique no botão "🧪 Testar" na página de configurações

### Se aparecer "Offline":
- O sistema está usando localStorage
- Funciona normalmente, mas não sincroniza com banco
- Dados serão mantidos localmente

### Se não aparecerem sites:
1. Execute `testWebsiteSettings()`
2. Verifique se há dados no localStorage
3. Clique em "Atualizar" na página de configurações

## Arquivos Modificados

- `src/hooks/useWebsiteSettings.ts` - Sistema reativo
- `src/hooks/useWebsiteSettingsConsumer.ts` - Hook otimizado para leitura
- `src/components/Layout/Header.tsx` - Uso do hook reativo
- `src/components/Admin/WebsiteSettings.tsx` - Botão de teste
- `scripts/test-website-settings.js` - Scripts de diagnóstico

## Status Final

✅ **Sistema Reativo Implementado**
✅ **Sincronização Automática**
✅ **Fallback para localStorage**
✅ **Logs de Debug**
✅ **Ferramentas de Teste**

O menu de sites úteis agora atualiza automaticamente quando alterações são feitas na página de configurações! 