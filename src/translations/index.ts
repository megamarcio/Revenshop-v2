
import { ptTranslations } from './pt';
import { esTranslations } from './es';
import { enTranslations } from './en';
import { Language, Translations } from '../types/language';

export const translations: Record<Language, Translations> = {
  pt: ptTranslations,
  es: esTranslations,
  en: enTranslations,
};

export { ptTranslations, esTranslations, enTranslations };
