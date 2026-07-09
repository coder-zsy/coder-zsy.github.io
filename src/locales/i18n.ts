import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import cn from './cn';
import de from './de';
import en from './en';
import fr from './fr';
import it from './it';
import ja from './ja';
import ptBR from './pt-BR';
import ru from './ru';

const resources = {
  en,
  cn,
  de,
  fr,
  it,
  ja,
  ru,
  'pt-BR': ptBR,
};

const SUPPORTED_LANGUAGES = ['cn', 'de', 'en', 'fr', 'it', 'ja', 'ru', 'pt-BR'] as const;

const getBrowserLanguage = (): (typeof SUPPORTED_LANGUAGES)[number] => {
  if (typeof navigator === 'undefined') {
    return 'en';
  }

  const language = (
    (navigator as Navigator & { browserLanguage?: string }).browserLanguage ||
    navigator.language
  ).toLowerCase();

  if (language.startsWith('zh')) return 'cn';
  if (language.startsWith('de')) return 'de';
  if (language.startsWith('fr')) return 'fr';
  if (language.startsWith('it')) return 'it';
  if (language.startsWith('ja')) return 'ja';
  if (language.startsWith('ru')) return 'ru';
  if (language.startsWith('pt')) return 'pt-BR';

  return 'en';
};

void i18n.use(initReactI18next).init({
  resources,
  lng: getBrowserLanguage(),
  fallbackLng: 'en',
  supportedLngs: [...SUPPORTED_LANGUAGES],
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
