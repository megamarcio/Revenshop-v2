// Script para testar configurações de sites úteis
// Execute no console do navegador: copy(testWebsiteSettings) e cole no console

window.testWebsiteSettings = async function() {
  console.log('🧪 === TESTE DE SITES ÚTEIS ===');
  
  try {
    // 1. Verificar localStorage
    console.log('\n📦 1. Verificando localStorage...');
    const localData = localStorage.getItem('website-settings');
    if (localData) {
      const parsed = JSON.parse(localData);
      console.log('✅ Sites no localStorage:', parsed.length);
      console.table(parsed.slice(0, 3));
    } else {
      console.log('❌ Nenhum site no localStorage');
    }

    // 2. Testar sistema de eventos
    console.log('\n🔄 2. Testando sistema reativo...');
    let eventReceived = false;
    
    const handleTestEvent = (event) => {
      eventReceived = true;
      console.log('✅ Evento websiteSettingsUpdated recebido:', event.detail);
    };
    
    window.addEventListener('websiteSettingsUpdated', handleTestEvent);
    
    // Disparar evento de teste
    const testEvent = new CustomEvent('websiteSettingsUpdated', {
      detail: { timestamp: Date.now(), test: true }
    });
    window.dispatchEvent(testEvent);
    
    setTimeout(() => {
      if (eventReceived) {
        console.log('✅ Sistema de eventos funcionando');
      } else {
        console.log('❌ Sistema de eventos não funcionou');
      }
      window.removeEventListener('websiteSettingsUpdated', handleTestEvent);
    }, 100);

    // 3. Verificar se o Supabase está disponível
    console.log('\n🗄️ 3. Verificando conexão Supabase...');
    if (window.supabase) {
      try {
        const { data, error } = await window.supabase
          .from('website_settings')
          .select('*')
          .limit(1);
          
        if (error) {
          console.log('❌ Erro no Supabase:', error.message);
          console.log('💡 Usando modo offline (localStorage)');
        } else {
          console.log('✅ Supabase conectado');
          console.log('📊 Dados do banco:', data ? data.length : 0, 'registros');
        }
      } catch (err) {
        console.log('❌ Erro de conexão:', err.message);
      }
    } else {
      console.log('❌ Supabase não disponível');
    }

    // 4. Simular criação e atualização de site
    console.log('\n➕ 4. Teste de CRUD de sites...');
    const testSite = {
      id: 'test-' + Date.now(),
      name: 'Site Teste Reativo',
      url: 'https://teste-reativo.com',
      category: 'other',
      description: 'Teste do sistema reativo',
      is_active: true,
      sort_order: 999
    };

    const currentSites = localData ? JSON.parse(localData) : [];
    
    // Teste de criação
    const updatedSites = [...currentSites, testSite];
    localStorage.setItem('website-settings', JSON.stringify(updatedSites));
    
    // Disparar evento de atualização
    const updateEvent = new CustomEvent('websiteSettingsUpdated', {
      detail: { timestamp: Date.now(), action: 'create', site: testSite }
    });
    window.dispatchEvent(updateEvent);
    console.log('✅ Site de teste criado e evento disparado');
    
    // Aguardar um pouco e remover
    setTimeout(() => {
      const cleanedSites = updatedSites.filter(s => s.id !== testSite.id);
      localStorage.setItem('website-settings', JSON.stringify(cleanedSites));
      
      const deleteEvent = new CustomEvent('websiteSettingsUpdated', {
        detail: { timestamp: Date.now(), action: 'delete', siteId: testSite.id }
      });
      window.dispatchEvent(deleteEvent);
      console.log('🧹 Site de teste removido e evento disparado');
    }, 1000);

    // 5. Verificar componente no DOM
    console.log('\n🎨 5. Verificando interface...');
    const websiteSettingsCard = document.querySelector('[data-testid="website-settings"]') || 
                               Array.from(document.querySelectorAll('h2, h3')).find(el => 
                                 el.textContent?.includes('Sites Úteis'));
    
    if (websiteSettingsCard) {
      console.log('✅ Componente de sites úteis encontrado no DOM');
    } else {
      console.log('❌ Componente não encontrado. Está na página de configurações?');
    }

    // 6. Verificar menu no header
    console.log('\n🌐 6. Verificando menu no header...');
    const globeIcon = document.querySelector('[data-lucide="globe"]');
    if (globeIcon) {
      console.log('✅ Ícone do menu de sites encontrado');
      
      // Tentar clicar para ver o dropdown
      const dropdownTrigger = globeIcon.closest('button');
      if (dropdownTrigger) {
        console.log('🔍 Testando abertura do dropdown...');
        dropdownTrigger.click();
        setTimeout(() => {
          const dropdown = document.querySelector('[role="menu"], .dropdown-content');
          if (dropdown) {
            console.log('✅ Dropdown de sites aberto com sucesso');
            // Fechar dropdown
            document.body.click();
          } else {
            console.log('⚠️ Dropdown não encontrado após clique');
          }
        }, 200);
      }
    } else {
      console.log('❌ Menu de sites não encontrado no header');
    }

    // 7. Verificar logs do console
    console.log('\n📊 7. Monitorando logs do Header...');
    console.log('ℹ️ Verifique se aparecem logs do tipo:');
    console.log('   - "🌐 Header - Configured websites: X [...]"');
    console.log('   - "🔄 Consumer - Recarregando sites após atualização"');

    console.log('\n✅ === TESTE CONCLUÍDO ===');
    console.log('\n📋 RESUMO:');
    console.log('- localStorage:', localData ? 'OK' : 'VAZIO');
    console.log('- Sistema Reativo:', eventReceived ? 'OK' : 'FALHOU');
    console.log('- Interface:', websiteSettingsCard ? 'OK' : 'NÃO ENCONTRADA');
    console.log('- Menu Header:', globeIcon ? 'OK' : 'NÃO ENCONTRADO');
    
    console.log('\n🔧 PRÓXIMOS PASSOS:');
    console.log('1. Vá para Configurações → Sites');
    console.log('2. Clique no botão "🧪 Testar" para testar o sistema reativo');
    console.log('3. Adicione/edite/remova um site e observe os logs do console');
    console.log('4. Verifique se o menu no header atualiza automaticamente');
    
  } catch (error) {
    console.error('❌ Erro no teste:', error);
  }
};

// Função para testar especificamente o sistema reativo
window.testWebsiteReactivity = function() {
  console.log('🔄 === TESTE DE REATIVIDADE ===');
  
  let updateCount = 0;
  const handleUpdate = (event) => {
    updateCount++;
    console.log(`✅ Atualização ${updateCount} recebida:`, event.detail);
  };
  
  window.addEventListener('websiteSettingsUpdated', handleUpdate);
  
  // Disparar alguns eventos de teste
  for (let i = 1; i <= 3; i++) {
    setTimeout(() => {
      const event = new CustomEvent('websiteSettingsUpdated', {
        detail: { timestamp: Date.now(), testNumber: i }
      });
      window.dispatchEvent(event);
      console.log(`🚀 Evento ${i} disparado`);
    }, i * 500);
  }
  
  // Verificar resultado após 2 segundos
  setTimeout(() => {
    console.log(`📊 Total de eventos recebidos: ${updateCount}/3`);
    if (updateCount === 3) {
      console.log('✅ Sistema reativo funcionando perfeitamente!');
    } else {
      console.log('❌ Sistema reativo com problemas');
    }
    window.removeEventListener('websiteSettingsUpdated', handleUpdate);
  }, 2000);
};

// Executar automaticamente se for rodado diretamente
if (typeof window !== 'undefined') {
  console.log('🔧 Scripts de teste carregados!');
  console.log('📋 Comandos disponíveis:');
  console.log('  - testWebsiteSettings() - Teste completo');
  console.log('  - testWebsiteReactivity() - Teste específico de reatividade');
} 