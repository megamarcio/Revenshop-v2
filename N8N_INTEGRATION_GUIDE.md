# Guia de Integração com N8N - Revenshop

## 📋 Visão Geral

Este guia explica como integrar o sistema Revenshop com N8N para automações de WhatsApp, busca de informações e outras funcionalidades.

## 🎯 Opções de Integração

### 1. **Webhooks (Recomendado - Já Implementado)**

Seu sistema já possui integração via webhooks. **NÃO é necessário usar MCP do N8N**.

#### Como Funciona:
- O Revenshop envia dados estruturados para um webhook configurado
- N8N recebe esses dados e processa conforme necessário
- N8N pode enviar para WhatsApp, email, ou outros sistemas

#### Dados Enviados pelo Webhook:
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

### 2. **API REST (Nova Funcionalidade)**

Sistema completo de API REST para integração bidirecional.

#### Endpoints Disponíveis:
- `GET /vehicles` - Listar veículos
- `GET /vehicles/:id` - Buscar veículo por ID
- `GET /customers` - Listar clientes
- `GET /reservations` - Listar reservas
- `GET /maintenance` - Listar manutenções
- `POST /whatsapp/send` - Enviar mensagem WhatsApp

## 🚀 Configuração no N8N

### Passo 1: Configurar Webhook no Revenshop

1. Acesse **Configurações > WhatsApp**
2. Configure a URL do webhook do N8N
3. Opcionalmente, configure uma chave secreta

### Passo 2: Criar Workflow no N8N

#### Exemplo 1: Envio Automático de Veículos

```javascript
// N8N Webhook Node Configuration
{
  "httpMethod": "POST",
  "path": "revenshop-vehicles",
  "responseMode": "responseNode"
}

// N8N WhatsApp Node Configuration
{
  "authentication": "whatsAppBusinessApi",
  "operation": "sendMessage",
  "to": "{{ $json.recipient.groupPhone }}",
  "message": "🚗 Novo veículo disponível!\n\n{{ $json.vehicle.name }} {{ $json.vehicle.year }}\nModelo: {{ $json.vehicle.model }}\nCor: {{ $json.vehicle.color }}\nPreço: R$ {{ $json.vehicle.salePrice }}\n\n{{ $json.vehicle.description }}"
}
```

#### Exemplo 2: Notificação de Reservas

```javascript
// N8N Webhook Node Configuration
{
  "httpMethod": "POST",
  "path": "revenshop-reservations",
  "responseMode": "responseNode"
}

// N8N WhatsApp Node Configuration
{
  "authentication": "whatsAppBusinessApi",
  "operation": "sendMessage",
  "to": "{{ $json.recipient.groupPhone }}",
  "message": "📅 Nova reserva confirmada!\n\nCliente: {{ $json.reservation.customer_full_name }}\nTelefone: {{ $json.reservation.phone_number }}\nRetirada: {{ $json.reservation.pickup_date }}\nDevolução: {{ $json.reservation.return_date }}\nPlaca: {{ $json.reservation.plate }}"
}
```

### Passo 3: Configurar Autenticação

#### Para Webhooks:
```javascript
// Headers do webhook
{
  "Content-Type": "application/json",
  "X-Webhook-Secret": "sua-chave-secreta"
}
```

#### Para API REST:
```javascript
// Headers da API
{
  "Authorization": "Bearer YOUR_API_KEY",
  "Content-Type": "application/json"
}
```

## 📱 Exemplos de Automações

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

### 4. **Sincronização de Clientes**
- **Trigger**: Novo cliente cadastrado
- **Ação**: Adicionar ao CRM externo
- **Frequência**: Imediata

## 🔧 Configuração Avançada

### Variáveis de Ambiente no N8N:
```bash
REVENSHOP_WEBHOOK_URL=https://seu-dominio.com/webhook
REVENSHOP_API_KEY=sua-api-key
WHATSAPP_BUSINESS_TOKEN=seu-token-whatsapp
```

### Headers Customizados:
```javascript
{
  "X-Source": "revenshop",
  "X-Version": "3.1",
  "X-Environment": "production"
}
```

## 🧪 Testando a Integração

### 1. Use o Testador de API
- Acesse **Configurações > API REST**
- Teste os endpoints disponíveis
- Verifique os dados retornados

### 2. Teste o Webhook
- Configure um webhook de teste
- Envie dados de teste
- Verifique se N8N recebe corretamente

### 3. Validação de Dados
```javascript
// Exemplo de validação no N8N
if ($json.type === 'vehicle_share' && $json.vehicle) {
  // Processar dados do veículo
  return $json;
} else {
  throw new Error('Dados inválidos recebidos');
}
```

## 📊 Monitoramento

### Logs Importantes:
- Status das requisições webhook
- Erros de autenticação
- Dados enviados/recebidos
- Performance da API

### Métricas Recomendadas:
- Taxa de sucesso dos webhooks
- Tempo de resposta da API
- Volume de dados processados
- Erros por tipo

## 🔒 Segurança

### Boas Práticas:
1. **Use HTTPS** para todas as comunicações
2. **Configure chaves secretas** para webhooks
3. **Valide dados** recebidos
4. **Limite acesso** por IP se necessário
5. **Monitore logs** regularmente

### Autenticação:
```javascript
// Verificação de chave secreta
const webhookSecret = req.headers['x-webhook-secret'];
if (webhookSecret !== process.env.WEBHOOK_SECRET) {
  return res.status(401).json({ error: 'Unauthorized' });
}
```

## 🆘 Solução de Problemas

### Problemas Comuns:

#### 1. Webhook não recebe dados
- Verifique se a URL está correta
- Confirme se o N8N está rodando
- Verifique logs do Revenshop

#### 2. Erro 401/403
- Verifique a chave secreta
- Confirme permissões da API
- Valide headers de autenticação

#### 3. Dados incompletos
- Verifique estrutura do JSON
- Confirme campos obrigatórios
- Valide encoding UTF-8

### Debug:
```javascript
// Log detalhado no N8N
console.log('Dados recebidos:', JSON.stringify($json, null, 2));
console.log('Headers:', JSON.stringify($headers, null, 2));
```

## 📞 Suporte

Para dúvidas sobre integração:
1. Verifique este guia
2. Use o testador de API
3. Consulte logs do sistema
4. Entre em contato com o suporte

---

**Nota**: Este sistema foi projetado para ser escalável e fácil de manter. A integração via webhooks é a abordagem recomendada para a maioria dos casos de uso. 