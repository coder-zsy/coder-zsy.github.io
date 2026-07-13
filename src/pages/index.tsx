import '@/locales/i18n';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import './index.less';

import AppLogo from '@/assets/index/printerMateLogo.png';
import { getLocalizedStoreBadges } from '@/assets/index/badges/storeBadges';
import AndroidIcon from '@/assets/index/android-icon.svg';

import Left from '@/assets/index/left.png';
import OpenInBroswer from '@/assets/index/openInBroswer.png';
import Right from '@/assets/index/right.png';

const DOWNLOAD_LINKS = {
  appStore: 'https://apps.apple.com/us/app/printermate/id6738001101',
  googlePlay:
    'https://play.google.com/store/apps/details?id=com.anonymous.bluetoothprinter',
  androidApk: 'https://oss.toyslove.cn/printer-mate-1.0.9.apk',
};

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
  const [isWeChat, setIsWeChat] = useState(false);

  useEffect(() => {
    const ua = navigator.userAgent;
    setIsWeChat(ua.indexOf('MicroMessenger') > -1);
  }, []);

  const openDownloadLink = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="container">
      <img src={Left} className="bg-left" />
      <img src={Right} className="bg-right" />
      <div className="content">
        <img className="app-logo" src={AppLogo} />
        <p className="baile-title">{t('AppTitle')}</p>
        <div className="app-description">
          <p className="description-text">{t('AppDescription')}</p>
        </div>
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
      </div>
      <div className="bottom">
        <div className="footer-info">
          <a
            className="icp-record"
            href="https://beian.miit.gov.cn/#/Integrated/index"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t('IcpRecord')}
          </a>
          <p className="copyright">{t('Copyright')}</p>
        </div>
      </div>
      {isWeChat && (
        <div className="open-safari">
          <img
            className="guide img-responsive"
            src={OpenInBroswer}
            alt={t('OpenInBrowser')}
          />
        </div>
      )}
    </div>
  );
};

export default App;
