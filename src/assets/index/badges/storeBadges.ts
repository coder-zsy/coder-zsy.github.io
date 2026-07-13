import appStoreCn from './app-store/cn.svg';
import appStoreDe from './app-store/de.svg';
import appStoreEn from './app-store/en.svg';
import appStoreFr from './app-store/fr.svg';
import appStoreIt from './app-store/it.svg';
import appStoreJa from './app-store/ja.svg';
import appStorePtBr from './app-store/pt-BR.svg';
import appStoreRu from './app-store/ru.svg';

import googlePlayCn from './google-play/cn.svg';
import googlePlayDe from './google-play/de.svg';
import googlePlayEn from './google-play/en.svg';
import googlePlayFr from './google-play/fr.svg';
import googlePlayIt from './google-play/it.svg';
import googlePlayJa from './google-play/ja.svg';
import googlePlayPtBr from './google-play/pt-BR.svg';
import googlePlayRu from './google-play/ru.svg';

export type StoreBadgeLanguage =
  | 'cn'
  | 'de'
  | 'en'
  | 'fr'
  | 'it'
  | 'ja'
  | 'ru'
  | 'pt-BR';

const SUPPORTED_LANGUAGES: StoreBadgeLanguage[] = [
  'cn',
  'de',
  'en',
  'fr',
  'it',
  'ja',
  'ru',
  'pt-BR',
];

const APP_STORE_BADGES: Record<StoreBadgeLanguage, string> = {
  cn: appStoreCn,
  de: appStoreDe,
  en: appStoreEn,
  fr: appStoreFr,
  it: appStoreIt,
  ja: appStoreJa,
  ru: appStoreRu,
  'pt-BR': appStorePtBr,
};

const GOOGLE_PLAY_BADGES: Record<StoreBadgeLanguage, string> = {
  cn: googlePlayCn,
  de: googlePlayDe,
  en: googlePlayEn,
  fr: googlePlayFr,
  it: googlePlayIt,
  ja: googlePlayJa,
  ru: googlePlayRu,
  'pt-BR': googlePlayPtBr,
};

export const normalizeBadgeLanguage = (
  language: string,
): StoreBadgeLanguage => {
  if (SUPPORTED_LANGUAGES.includes(language as StoreBadgeLanguage)) {
    return language as StoreBadgeLanguage;
  }

  return 'en';
};

export const getLocalizedStoreBadges = (language: string) => {
  const lang = normalizeBadgeLanguage(language);

  return {
    appStore: APP_STORE_BADGES[lang],
    googlePlay: GOOGLE_PLAY_BADGES[lang],
  };
};
