#!/usr/bin/env node

/**
 * Script para testar integração com N8N
 * 
 * Uso:
 * node scripts/test-n8n-integration.js
 */

const https = require('https');
const http = require('http');

// Configurações
const config = {
  webhookUrl: process.env.N8N_WEBHOOK_URL || 'http://localhost:5678/webhook/revenshop-webhook',
  webhookSecret: process.env.N8N_WEBHOOK_SECRET || 'test-secret',
  timeout: 10000
};

// Dados de teste
const testData = {
  vehicleShare: {
    type: 'vehicle_share',
    sendType: 'group',
    recipient: {
      groupId: 'test-group-1',
      groupName: 'Grupo de Teste',
      groupPhone: '5511999999999'
    },
    vehicle: {
      id: 'test-vehicle-1',
      name: 'Honda Civic',
      year: 2020,
      model: 'EXL',
      color: 'Prata',
      miles: 45000,
      vin: '1HGBH41JXMN109186',
      salePrice: 85000,
      description: 'Veículo em excelente estado, único dono, revisões em dia. Equipado com ar condicionado, direção hidráulica, vidros elétricos e alarme.',
      photos: [
        'https://example.com/photo1.jpg',
        'https://example.com/photo2.jpg'
      ],
      video: 'https://example.com/video.mp4'
    },
    timestamp: new Date().toISOString()
  },
  
  reservationShare: {
    type: 'reservation_share',
    recipient: {
      groupId: 'test-group-2',
      groupName: 'Grupo Reservas',
      groupPhone: '5511888888888'
    },
    reservation: {
      reservation_id: 'test-reservation-1',
      customer_first_name: 'João',
      customer_last_name: 'Silva',
      pickup_date: '2024-01-15',
      return_date: '2024-01-20',
      plate: 'ABC-1234',
      phone_number: '5511777777777',
      customer_full_name: 'João Silva'
    },
    timestamp: new Date().toISOString()
  },
  
  customMessage: {
    type: 'custom_message',
    recipient: {
      phone: '5511666666666'
    },
    message: 'Esta é uma mensagem de teste da integração Revenshop-N8N! 🚗',
    timestamp: new Date().toISOString()
  }
};

/**
 * Função para fazer requisição HTTP
 */
function makeRequest(url, data, headers = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const isHttps = urlObj.protocol === 'https:';
    const client = isHttps ? https : http;
    
    const postData = JSON.stringify(data);
    
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || (isHttps ? 443 : 80),
      path: urlObj.pathname + urlObj.search,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
        'X-Webhook-Secret': config.webhookSecret,
        ...headers
      },
      timeout: config.timeout
    };

    const req = client.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        try {
          const parsedData = JSON.parse(responseData);
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: parsedData
          });
        } catch (error) {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: responseData
          });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    req.write(postData);
    req.end();
  });
}

/**
 * Função para testar um tipo de mensagem
 */
async function testMessageType(type, data) {
  console.log(`\n🧪 Testando: ${type}`);
  console.log('─'.repeat(50));
  
  try {
    console.log('📤 Enviando dados...');
    console.log(JSON.stringify(data, null, 2));
    
    const response = await makeRequest(config.webhookUrl, data);
    
    console.log('\n✅ Resposta recebida:');
    console.log(`Status: ${response.status}`);
    console.log('Dados:', JSON.stringify(response.data, null, 2));
    
    if (response.status >= 200 && response.status < 300) {
      console.log('🎉 Teste bem-sucedido!');
    } else {
      console.log('⚠️  Teste com status inesperado');
    }
    
  } catch (error) {
    console.log('\n❌ Erro no teste:');
    console.log(error.message);
  }
}

/**
 * Função principal
 */
async function main() {
  console.log('🚀 Iniciando testes de integração N8N');
  console.log('='.repeat(60));
  console.log(`Webhook URL: ${config.webhookUrl}`);
  console.log(`Secret: ${config.webhookSecret ? '***' : 'não configurado'}`);
  console.log('='.repeat(60));

  // Testar cada tipo de mensagem
  await testMessageType('Vehicle Share', testData.vehicleShare);
  await testMessageType('Reservation Share', testData.reservationShare);
  await testMessageType('Custom Message', testData.customMessage);

  console.log('\n🏁 Testes concluídos!');
  console.log('\n📋 Próximos passos:');
  console.log('1. Verifique se o N8N recebeu as mensagens');
  console.log('2. Confirme se o WhatsApp foi enviado');
  console.log('3. Verifique os logs do N8N para detalhes');
}

// Executar se chamado diretamente
if (require.main === module) {
  main().catch(console.error);
}

module.exports = {
  testMessageType,
  makeRequest,
  testData
}; 