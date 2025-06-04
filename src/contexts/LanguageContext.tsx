
import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'pt' | 'es' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  pt: {
    // Navigation
    'dashboard': 'Dashboard',
    'vehicles': 'Veículos',
    'users': 'Usuários',
    'admin': 'Administração',
    'profile': 'Perfil',
    'logout': 'Sair',
    
    // Dashboard
    'totalToSell': 'Valor Total a Vender',
    'totalSold': 'Valor Total Vendido',
    'carsForSale': 'Carros à Venda',
    'carsSold': 'Carros Vendidos',
    'totalSellers': 'Vendedores Cadastrados',
    'welcome': 'Bem-vindo ao REVENSHOP',
    'subtitle': 'Gerencie seu estoque de veículos com facilidade',
    
    // Vehicles
    'addVehicle': 'Adicionar Veículo',
    'vehicleName': 'Nome do Veículo',
    'vin': 'Número VIN',
    'year': 'Ano',
    'model': 'Modelo',
    'plate': 'Placa',
    'internalCode': 'Código Interno',
    'color': 'Cor',
    'caNote': 'Nota CA (0-50)',
    'purchasePrice': 'Valor de Compra',
    'salePrice': 'Valor de Venda',
    'profitMargin': 'Margem de Lucro',
    'minNegotiable': 'Valor Mínimo Negociável',
    'carfaxPrice': 'Valor Carfax',
    'mmrValue': 'Valor MMR',
    'description': 'Descrição',
    'category': 'Categoria',
    'forSale': 'À Venda (Anunciado)',
    'sold': 'Vendido',
    'seller': 'Vendedor',
    'finalSalePrice': 'Valor Final de Venda',
    'actions': 'Ações',
    'edit': 'Editar',
    'duplicate': 'Duplicar',
    'delete': 'Excluir',
    'save': 'Salvar',
    'cancel': 'Cancelar',
    
    // Users
    'addUser': 'Adicionar Usuário',
    'firstName': 'Nome',
    'lastName': 'Sobrenome',
    'email': 'E-mail',
    'phone': 'Telefone',
    'password': 'Senha',
    'confirmPassword': 'Confirmar Senha',
    
    // Login
    'login': 'Entrar',
    'loginTitle': 'Acesso ao Sistema',
    'loginSubtitle': 'Entre com suas credenciais',
    'forgotPassword': 'Esqueceu a senha?',
    'noAccount': 'Não tem conta?',
    'register': 'Cadastre-se',
    
    // Common
    'search': 'Pesquisar',
    'filter': 'Filtrar',
    'loading': 'Carregando...',
    'noData': 'Nenhum dado encontrado',
    'confirm': 'Confirmar',
    'close': 'Fechar',
    'yes': 'Sim',
    'no': 'Não',
    'success': 'Sucesso!',
    'error': 'Erro!',
    'warning': 'Atenção!',
    'info': 'Informação',
  },
  es: {
    // Navigation
    'dashboard': 'Panel',
    'vehicles': 'Vehículos',
    'users': 'Usuarios',
    'admin': 'Administración',
    'profile': 'Perfil',
    'logout': 'Salir',
    
    // Dashboard
    'totalToSell': 'Valor Total a Vender',
    'totalSold': 'Valor Total Vendido',
    'carsForSale': 'Autos en Venta',
    'carsSold': 'Autos Vendidos',
    'totalSellers': 'Vendedores Registrados',
    'welcome': 'Bienvenido a REVENSHOP',
    'subtitle': 'Gestiona tu inventario de vehículos con facilidad',
    
    // Vehicles
    'addVehicle': 'Agregar Vehículo',
    'vehicleName': 'Nombre del Vehículo',
    'vin': 'Número VIN',
    'year': 'Año',
    'model': 'Modelo',
    'plate': 'Placa',
    'internalCode': 'Código Interno',
    'color': 'Color',
    'caNote': 'Nota CA (0-50)',
    'purchasePrice': 'Precio de Compra',
    'salePrice': 'Precio de Venta',
    'profitMargin': 'Margen de Ganancia',
    'minNegotiable': 'Precio Mínimo Negociable',
    'carfaxPrice': 'Precio Carfax',
    'mmrValue': 'Valor MMR',
    'description': 'Descripción',
    'category': 'Categoría',
    'forSale': 'En Venta (Anunciado)',
    'sold': 'Vendido',
    'seller': 'Vendedor',
    'finalSalePrice': 'Precio Final de Venta',
    'actions': 'Acciones',
    'edit': 'Editar',
    'duplicate': 'Duplicar',
    'delete': 'Eliminar',
    'save': 'Guardar',
    'cancel': 'Cancelar',
    
    // Users
    'addUser': 'Agregar Usuario',
    'firstName': 'Nombre',
    'lastName': 'Apellido',
    'email': 'Correo',
    'phone': 'Teléfono',
    'password': 'Contraseña',
    'confirmPassword': 'Confirmar Contraseña',
    
    // Login
    'login': 'Iniciar Sesión',
    'loginTitle': 'Acceso al Sistema',
    'loginSubtitle': 'Ingresa con tus credenciales',
    'forgotPassword': '¿Olvidaste tu contraseña?',
    'noAccount': '¿No tienes cuenta?',
    'register': 'Regístrate',
    
    // Common
    'search': 'Buscar',
    'filter': 'Filtrar',
    'loading': 'Cargando...',
    'noData': 'No se encontraron datos',
    'confirm': 'Confirmar',
    'close': 'Cerrar',
    'yes': 'Sí',
    'no': 'No',
    'success': '¡Éxito!',
    'error': '¡Error!',
    'warning': '¡Atención!',
    'info': 'Información',
  },
  en: {
    // Navigation
    'dashboard': 'Dashboard',
    'vehicles': 'Vehicles',
    'users': 'Users',
    'admin': 'Administration',
    'profile': 'Profile',
    'logout': 'Logout',
    
    // Dashboard
    'totalToSell': 'Total Value to Sell',
    'totalSold': 'Total Value Sold',
    'carsForSale': 'Cars for Sale',
    'carsSold': 'Cars Sold',
    'totalSellers': 'Registered Sellers',
    'welcome': 'Welcome to REVENSHOP',
    'subtitle': 'Manage your vehicle inventory with ease',
    
    // Vehicles
    'addVehicle': 'Add Vehicle',
    'vehicleName': 'Vehicle Name',
    'vin': 'VIN Number',
    'year': 'Year',
    'model': 'Model',
    'plate': 'Plate',
    'internalCode': 'Internal Code',
    'color': 'Color',
    'caNote': 'CA Note (0-50)',
    'purchasePrice': 'Purchase Price',
    'salePrice': 'Sale Price',
    'profitMargin': 'Profit Margin',
    'minNegotiable': 'Minimum Negotiable',
    'carfaxPrice': 'Carfax Price',
    'mmrValue': 'MMR Value',
    'description': 'Description',
    'category': 'Category',
    'forSale': 'For Sale (Listed)',
    'sold': 'Sold',
    'seller': 'Seller',
    'finalSalePrice': 'Final Sale Price',
    'actions': 'Actions',
    'edit': 'Edit',
    'duplicate': 'Duplicate',
    'delete': 'Delete',
    'save': 'Save',
    'cancel': 'Cancel',
    
    // Users
    'addUser': 'Add User',
    'firstName': 'First Name',
    'lastName': 'Last Name',
    'email': 'Email',
    'phone': 'Phone',
    'password': 'Password',
    'confirmPassword': 'Confirm Password',
    
    // Login
    'login': 'Login',
    'loginTitle': 'System Access',
    'loginSubtitle': 'Enter your credentials',
    'forgotPassword': 'Forgot password?',
    'noAccount': "Don't have an account?",
    'register': 'Register',
    
    // Common
    'search': 'Search',
    'filter': 'Filter',
    'loading': 'Loading...',
    'noData': 'No data found',
    'confirm': 'Confirm',
    'close': 'Close',
    'yes': 'Yes',
    'no': 'No',
    'success': 'Success!',
    'error': 'Error!',
    'warning': 'Warning!',
    'info': 'Information',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('pt');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
