
export type Language = 'pt' | 'es' | 'en';

export interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

export type TranslationKey = 
  // Navigation
  | 'dashboard' | 'vehicles' | 'users' | 'admin' | 'profile' | 'logout'
  // Dashboard
  | 'totalToSell' | 'totalSold' | 'carsForSale' | 'carsSold' | 'totalSellers' | 'welcome' | 'subtitle'
  // Vehicles
  | 'addVehicle' | 'editVehicle' | 'vehicleName' | 'vin' | 'year' | 'model' | 'plate' | 'miles' | 'internalCode' | 'color' | 'caNote' | 'purchasePrice' | 'salePrice' | 'profitMargin' | 'minNegotiable' | 'carfaxPrice' | 'mmrValue' | 'description' | 'category' | 'forSale' | 'sold' | 'seller' | 'finalSalePrice' | 'actions' | 'edit' | 'duplicate' | 'delete' | 'save' | 'cancel' | 'update' | 'updating' | 'saving' | 'titleInfo' | 'cleanTitle' | 'rebuiltTitle' | 'inHands' | 'inTransit'
  // Users
  | 'addUser' | 'editUser' | 'firstName' | 'lastName' | 'email' | 'phone' | 'password' | 'confirmPassword' | 'role' | 'facebook' | 'photo' | 'commissions' | 'clientReferral' | 'clientBrought' | 'fullSale' | 'manageUsers'
  // Login
  | 'login' | 'loginTitle' | 'loginSubtitle' | 'forgotPassword' | 'noAccount' | 'register'
  // Common
  | 'search' | 'filter' | 'loading' | 'noData' | 'confirm' | 'close' | 'yes' | 'no' | 'success' | 'error' | 'warning' | 'info' | 'name' | 'date' | 'time' | 'status' | 'active' | 'inactive' | 'processing'
  // Validations
  | 'nameRequired' | 'vinRequired' | 'yearRequired' | 'modelRequired' | 'milesRequired' | 'internalCodeRequired' | 'colorRequired' | 'purchasePriceRequired' | 'salePriceRequired' | 'customerNameRequired' | 'customerPhoneRequired' | 'saleDateRequired' | 'milesValidation' | 'caNoteValidation' | 'fixRequiredFields' | 'photoWarning' | 'savingPhotos' | 'processingPhotos' | 'dontCloseWindow' | 'descriptionGenerated' | 'vehicleSaved'
  // Customers
  | 'customers' | 'addCustomer' | 'editCustomer' | 'customerName' | 'customerAddress' | 'customerPhone' | 'customerEmail' | 'socialSecurityType' | 'socialSecurityNumber' | 'documentPhoto' | 'reference1' | 'reference2' | 'referenceName' | 'referenceEmail' | 'referenceAddress' | 'referencePhone' | 'responsibleSeller' | 'interestedVehicle' | 'dealStatus' | 'paymentType' | 'paymentDetails' | 'completedSale' | 'quote' | 'ssn' | 'passport' | 'bhph' | 'financing' | 'cash' | 'generateQuote' | 'generateContract' | 'printQuote' | 'exportDeal' | 'customerDetails' | 'vehicleDetails' | 'dealDetails' | 'signature' | 'signatureDate' | 'selectSeller' | 'selectVehicle' | 'uploadDocument' | 'totalAmount' | 'downPayment' | 'monthlyPayment' | 'termMonths' | 'interestRate' | 'managingCustomers';

export type Translations = Record<TranslationKey, string>;
