import '@/locales/i18n';
import { useTranslation } from 'react-i18next';
import './index.less';

import { getLocalizedStoreBadges } from '@/assets/index/badges/storeBadges';
import AndroidIcon from '@/assets/index/android-icon.svg';

import DownloadPageLayout from './printerMate/DownloadPageLayout';
import { DOWNLOAD_LINKS } from './printerMate/downloadLinks';

const STORE_BADGE_CONFIG = [
  {
    key: 'appStore',
    url: DOWNLOAD_LINKS.appStore,
    badgeKey: 'appStore' as const,
    labelKey: 'DownloadAppStore',
  },
  {
    key: 'googlePlay',
    url: DOWNLOAD_LINKS.googlePlay,
    badgeKey: 'googlePlay' as const,
    labelKey: 'DownloadGooglePlay',
  },
] as const;

const App = () => {
  const { t, i18n } = useTranslation();
  const localizedBadges = getLocalizedStoreBadges(i18n.language);

  const openDownloadLink = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <DownloadPageLayout>
      <div className="download-buttons">
        {STORE_BADGE_CONFIG.map(({ key, url, badgeKey, labelKey }) => (
          <button
            key={key}
            onClick={() => openDownloadLink(url)}
            className="download-badge"
          >
            <img
              src={localizedBadges[badgeKey]}
              alt={t(labelKey)}
              className="download-badge-image"
            />
          </button>
        ))}
        <button
          onClick={() => openDownloadLink(DOWNLOAD_LINKS.androidApk)}
          className="download-direct"
        >
          <img
            src={AndroidIcon}
            alt=""
            className="download-direct-icon"
            aria-hidden="true"
          />
          <span className="download-direct-text">
            <span className="download-direct-label">{t('DirectDownload')}</span>
            <span className="download-direct-title">Android APK</span>
          </span>
        </button>
      </div>
    </DownloadPageLayout>
  );
};

export default App;
