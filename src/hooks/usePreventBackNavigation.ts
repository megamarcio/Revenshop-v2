import { useEffect, useState } from 'react';
import { useIsMobile } from './use-mobile';

export const usePreventBackNavigation = () => {
  const isMobile = useIsMobile();
  const [showExitModal, setShowExitModal] = useState(false);
  const [exitAttempts, setExitAttempts] = useState(0);

  useEffect(() => {
    if (!isMobile) return;

    let isModalOpen = false;

    const handleBackButton = (event: PopStateEvent) => {
      event.preventDefault();
      
      // Sempre adiciona uma nova entrada no histórico para capturar o próximo back
      window.history.pushState(null, '', window.location.href);
      
      if (isModalOpen) return;
      
      setExitAttempts(prev => prev + 1);
      
      // Primeira tentativa - mostra modal customizado
      if (exitAttempts === 0) {
        isModalOpen = true;
        setShowExitModal(true);
        return;
      }
      
      // Segunda tentativa - confirmação final
      if (exitAttempts === 1) {
        const confirmExit = window.confirm(
          'ÚLTIMA CONFIRMAÇÃO: Tem certeza que deseja sair do REVENSHOP?\n\nEsta é sua última chance antes de sair do sistema.'
        );
        
        if (confirmExit) {
          // Permite a saída removendo os listeners e indo para trás
          window.removeEventListener('popstate', handleBackButton);
          window.removeEventListener('beforeunload', handleBeforeUnload);
          
          // Limpa o histórico artificial e sai
          window.history.go(-3);
          return;
        } else {
          setExitAttempts(0);
          isModalOpen = false;
        }
      }
    };

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = 'Tem certeza que deseja sair do REVENSHOP?';
      return 'Tem certeza que deseja sair do REVENSHOP?';
    };

    // Adiciona múltiplas entradas no histórico para criar "buffer"
    window.history.pushState(null, '', window.location.href);
    window.history.pushState(null, '', window.location.href);
    window.history.pushState(null, '', window.location.href);
    
    // Adiciona os listeners
    window.addEventListener('popstate', handleBackButton);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('popstate', handleBackButton);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      setShowExitModal(false);
      setExitAttempts(0);
    };
  }, [isMobile, exitAttempts]);

  const handleModalCancel = () => {
    setShowExitModal(false);
    setExitAttempts(0);
  };

  const handleModalConfirm = () => {
    setShowExitModal(false);
    setExitAttempts(1);
    // Simula um back para ativar a segunda confirmação
    setTimeout(() => window.history.back(), 100);
  };

  return {
    showExitModal,
    handleModalCancel,
    handleModalConfirm
  };
};
