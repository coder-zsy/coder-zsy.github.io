import '@/locales/i18n';
import { useEffect, useState } from 'react';
import './index.less';

import Left from '@/assets/index/left.png';
import OpenInBroswer from '@/assets/index/openInBroswer.png';
import AppLogo from '@/assets/index/printerMateLogo.png';
import Right from '@/assets/index/right.png';
import { useTranslation } from 'react-i18next';

const App = () => {
  const { t } = useTranslation();
  const [isWeChat, setIsWeChat] = useState(false);

  useEffect(() => {
    const ua = navigator.userAgent;
    setIsWeChat(ua.indexOf('MicroMessenger') > -1);
    console.log('==========', navigator);
  }, []);

  const downLoad = () => {
    const ua = navigator.userAgent;
    if (ua.indexOf('Android') > -1 || ua.indexOf('Adr') > -1) {
      window.location.href = '@/assets/app/Toys1.1.0.apk';
    } else if (!!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)) {
      // iOS 设备，通过AppStore下载
      window.location.href =
        'https://apps.apple.com/us/app/printermate/id6738001101';
    } else {
      // 其他平台的下载逻辑可以在这里添加
      window.location.href =
        'https://play.google.com/store/apps/details?id=com.anonymous.bluetoothprinter';
    }
  };

  return (
    <div className="container">
      <img src={Left} className="bg-left" />
      <img src={Right} className="bg-right" />
      <div className="content">
        <img className="app-logo" src={AppLogo} />
        <p className="baile-title">{t('AppTitle')}</p>
        <button onClick={downLoad} className="download">
          {t('DownloadInstall')}
        </button>
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
