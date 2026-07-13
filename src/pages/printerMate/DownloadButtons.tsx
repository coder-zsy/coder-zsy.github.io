import { useTranslation } from 'react-i18next';

import AndroidIcon from '@/assets/index/android-icon.svg';
import { getLocalizedStoreBadges } from '@/assets/index/badges/storeBadges';

import { DOWNLOAD_LINKS, getStoreUrlByUserAgent } from './downloadLinks';
import { isMainlandChina } from './regionDetect';

const DownloadButtons = () => {
  const { t, i18n } = useTranslation();
  const localizedBadges = getLocalizedStoreBadges(i18n.language);
  const showMainlandButtons = isMainlandChina();

  const openDownloadLink = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleSmartDownload = () => {
    window.location.href = getStoreUrlByUserAgent();
  };

  if (showMainlandButtons) {
    return (
      <div className="download-buttons">
        <button
          onClick={() => openDownloadLink(DOWNLOAD_LINKS.appStore)}
          className="download-badge"
        >
          <img
            src={localizedBadges.appStore}
            alt={t('DownloadAppStore')}
            className="download-badge-image"
          />
        </button>
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
    );
  }

  return (
    <div className="download-buttons">
      <button onClick={handleSmartDownload} className="download-smart">
        {t('DownloadInstall')}
      </button>
    </div>
  );
};

export default DownloadButtons;
