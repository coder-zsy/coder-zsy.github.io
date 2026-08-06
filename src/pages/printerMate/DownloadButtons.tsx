import { useTranslation } from 'react-i18next';

import AndroidIcon from '@/assets/index/android-icon.svg';
import AppleIcon from '@/assets/index/apple-icon.svg';

import { DOWNLOAD_LINKS, getStoreUrlByUserAgent } from './downloadLinks';
import { isMainlandChina } from './regionDetect';

const DownloadButtons = () => {
  const { t } = useTranslation();
  const showMainlandButtons = isMainlandChina();

  const openDownloadLink = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleSmartDownload = () => {
    window.location.href = getStoreUrlByUserAgent();
  };

  if (showMainlandButtons) {
    // 两个平台按钮共用同一套布局/尺寸，避免官方 badge 拉宽后高低不一
    return (
      <div className="download-buttons">
        <button
          onClick={() => openDownloadLink(DOWNLOAD_LINKS.appStore)}
          className="download-direct"
        >
          <img
            src={AppleIcon}
            alt=""
            className="download-direct-icon"
            aria-hidden="true"
          />
          <span className="download-direct-text">
            <span className="download-direct-label">
              {t('DownloadAppStore')}
            </span>
            <span className="download-direct-title">App Store</span>
          </span>
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
            <span className="download-direct-title">Android</span>
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
