
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface BHPHSettings {
  downPaymentPercentage: number; // Percentage of vehicle price (e.g., 60 for 60%)
  monthlyInterestRate: number; // Monthly interest rate (e.g., 3 for 3%)
}

interface BHPHContextType {
  settings: BHPHSettings;
  updateSettings: (settings: BHPHSettings) => void;
}

const BHPHContext = createContext<BHPHContextType | undefined>(undefined);

export const useBHPH = () => {
  const context = useContext(BHPHContext);
  if (!context) {
    throw new Error('useBHPH must be used within a BHPHProvider');
  }
  return context;
};

const defaultSettings: BHPHSettings = {
  downPaymentPercentage: 60, // 60% do valor do veículo
  monthlyInterestRate: 3 // 3% ao mês
};

export const BHPHProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<BHPHSettings>(() => {
    // Tenta carregar do localStorage
    const stored = localStorage.getItem('bhph_settings');
    return stored ? JSON.parse(stored) : defaultSettings;
  });

  const updateSettings = (newSettings: BHPHSettings) => {
    setSettings(newSettings);
    localStorage.setItem('bhph_settings', JSON.stringify(newSettings));
  };

  return (
    <BHPHContext.Provider value={{ settings, updateSettings }}>
      {children}
    </BHPHContext.Provider>
  );
};
