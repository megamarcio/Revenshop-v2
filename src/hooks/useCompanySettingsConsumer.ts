import { useState, useEffect } from 'react';
import { CompanySettings } from './useCompanySettings';

const defaultSettings: CompanySettings = {
  company_name: '',
  company_logo: '',
  trade_name: '',
  cnpj: '',
  address: '',
  city: '',
  phone: '',
  email: '',
};

export const useCompanySettingsConsumer = () => {
  const [settings, setSettings] = useState<CompanySettings>(defaultSettings);

  const loadSettings = () => {
    try {
      const stored = localStorage.getItem('company-settings');
      console.log('🏢 Loading company settings from localStorage:', stored);
      if (stored) {
        const parsedSettings = JSON.parse(stored);
        const newSettings = { ...defaultSettings, ...parsedSettings };
        console.log('🏢 Parsed company settings:', newSettings);
        setSettings(newSettings);
      } else {
        console.log('🏢 No company settings found in localStorage, using defaults');
      }
    } catch (error) {
      console.error('Error loading company settings:', error);
    }
  };

  useEffect(() => {
    // Carregar configurações iniciais
    loadSettings();

    // Escutar mudanças nas configurações
    const handleSettingsUpdate = () => {
      console.log('🏢 Company settings updated event received');
      loadSettings();
    };

    window.addEventListener('companySettingsUpdated', handleSettingsUpdate);
    
    // Cleanup
    return () => {
      window.removeEventListener('companySettingsUpdated', handleSettingsUpdate);
    };
  }, []);

  return {
    settings,
  };
}; 