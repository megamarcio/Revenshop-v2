# 🔗 Integração Revenshop + N8N

## 📋 Resumo

Este projeto implementa uma integração completa entre o sistema Revenshop e N8N para automações de WhatsApp, busca de informações e outras funcionalidades.

## 🎯 Resposta à Pergunta Original

**Você NÃO precisa usar MCP do N8N!** 

Seu sistema já possui integração via **webhooks** que é mais simples e eficiente para a maioria dos casos de uso.

## 🚀 O que foi Implementado

### 1. **Sistema de Webhooks (Já Existente)**
- ✅ Configuração de webhook URL
- ✅ Chave secreta para autenticação
- ✅ Envio de dados estruturados
- ✅ Suporte a diferentes tipos de mensagem

### 2. **API REST Completa (Nova)**
- ✅ Endpoints para veículos, clientes, reservas
- ✅ Sistema de autenticação
- ✅ Testador integrado
- ✅ Documentação completa

### 3. **Componentes de Interface**
- ✅ Testador de API REST
- ✅ Configurações de webhook
- ✅ Exemplos de integração

## 📁 Arquivos Criados/Modificados

```
src/
├── api/
│   └── rest-api.ts                 # API REST completa
├── components/Admin/
│   ├── APITester.tsx              # Testador de API
│   └── ConfigurationsPanel.tsx    # Adicionada aba API REST
├── examples/
│   └── n8n-workflow-example.json  # Exemplo de workflow N8N
├── scripts/
│   └── test-n8n-integration.js    # Script de teste
├── N8N_INTEGRATION_GUIDE.md       # Guia completo
└── README_N8N_INTEGRATION.md      # Este arquivo
```

## 🔧 Como Usar

### 1. **Configurar Webhook no Revenshop**
1. Acesse **Configurações > WhatsApp**
2. Configure a URL do webhook do N8N
3. Opcionalmente, configure uma chave secreta

### 2. **Criar Workflow no N8N**
1. Crie um novo workflow
2. Adicione um node "Webhook"
3. Configure o path (ex: `/revenshop-webhook`)
4. Adicione nodes para processar os dados
5. Configure o envio para WhatsApp

### 3. **Testar a Integração**
```bash
# Usar o testador integrado
# Acesse: Configurações > API REST

# Ou usar o script de teste
node scripts/test-n8n-integration.js
```

## 📊 Dados Enviados pelo Webhook

### Veículos
```json
{
  "type": "vehicle_share",
  "sendType": "group",
  "recipient": {
    "groupId": "group-id",
    "groupName": "Nome do Grupo",
    "groupPhone": "5511999999999"
  },
  "vehicle": {
    "id": "vehicle-id",
    "name": "Nome do Veículo",
    "year": 2020,
    "model": "Modelo",
    "color": "Cor",
    "miles": 50000,
    "vin": "VIN123",
    "salePrice": 50000,
    "description": "Descrição",
    "photos": ["url1", "url2"],
    "video": "video-url"
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Reservas
```json
{
  "type": "reservation_share",
  "recipient": {
    "groupId": "group-id",
    "groupName": "Nome do Grupo",
    "groupPhone": "5511999999999"
  },
  "reservation": {
    "reservation_id": "reservation-id",
    "customer_full_name": "Nome do Cliente",
    "phone_number": "5511777777777",
    "pickup_date": "2024-01-15",
    "return_date": "2024-01-20",
    "plate": "ABC-1234"
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## 🎨 Exemplos de Automações

### 1. **Notificação de Novos Veículos**
- **Trigger**: Novo veículo cadastrado
- **Ação**: Enviar para grupos WhatsApp
- **Frequência**: Imediata

### 2. **Lembrete de Manutenção**
- **Trigger**: Data de manutenção próxima
- **Ação**: Enviar notificação para equipe
- **Frequência**: Diária

### 3. **Relatório de Vendas**
- **Trigger**: Venda finalizada
- **Ação**: Enviar relatório para gerência
- **Frequência**: Imediata

## 🔒 Segurança

- ✅ HTTPS obrigatório
- ✅ Chave secreta para webhooks
- ✅ Validação de dados
- ✅ Headers de autenticação
- ✅ Logs de monitoramento

## 🧪 Testando

### 1. **Testador Integrado**
- Acesse: **Configurações > API REST**
- Teste todos os endpoints
- Veja exemplos de configuração N8N

### 2. **Script de Teste**
```bash
# Configurar variáveis de ambiente
export N8N_WEBHOOK_URL="http://localhost:5678/webhook/revenshop-webhook"
export N8N_WEBHOOK_SECRET="sua-chave-secreta"

# Executar teste
node scripts/test-n8n-integration.js
```

### 3. **Workflow de Exemplo**
- Importe o arquivo `examples/n8n-workflow-example.json` no N8N
- Configure as credenciais do WhatsApp
- Teste com dados reais

## 📈 Vantagens desta Abordagem

### ✅ **Simplicidade**
- Não requer MCP
- Configuração rápida
- Fácil manutenção

### ✅ **Escalabilidade**
- Suporte a múltiplos webhooks
- Rate limiting configurável
- Cache de dados

### ✅ **Flexibilidade**
- Dados estruturados
- Múltiplos tipos de mensagem
- Headers customizáveis

### ✅ **Confiabilidade**
- Retry automático
- Logs detalhados
- Monitoramento

## 🆘 Solução de Problemas

### Problema: Webhook não recebe dados
**Solução:**
1. Verifique se a URL está correta
2. Confirme se o N8N está rodando
3. Verifique logs do Revenshop

### Problema: Erro 401/403
**Solução:**
1. Verifique a chave secreta
2. Confirme permissões da API
3. Valide headers de autenticação

### Problema: Dados incompletos
**Solução:**
1. Verifique estrutura do JSON
2. Confirme campos obrigatórios
3. Valide encoding UTF-8

## 📞 Suporte

Para dúvidas sobre integração:
1. Consulte o `N8N_INTEGRATION_GUIDE.md`
2. Use o testador de API integrado
3. Verifique os logs do sistema
4. Entre em contato com o suporte

## 🎉 Conclusão

Esta implementação oferece uma solução completa e escalável para integração com N8N, **sem necessidade de MCP**. O sistema de webhooks é mais simples, eficiente e adequado para a maioria dos casos de uso.

A API REST adicional oferece flexibilidade para integrações mais complexas quando necessário.

---

**Status**: ✅ Implementado e Testado  
**Compatibilidade**: N8N 1.0+  
**Última Atualização**: Janeiro 2024 