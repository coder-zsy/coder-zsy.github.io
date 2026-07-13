import { ReactNode, useState } from 'react';
import { useTranslation } from 'react-i18next';

import AppLogo from '@/assets/index/printerMateLogo.png';
import Left from '@/assets/index/left.png';
import OpenInBroswer from '@/assets/index/openInBroswer.png';
import Right from '@/assets/index/right.png';

type DownloadPageLayoutProps = {
  children: ReactNode;
};

/** 首页与 /printerMate/download 共用的页面骨架（描述、页脚、微信遮罩） */
const DownloadPageLayout = ({ children }: DownloadPageLayoutProps) => {
  const { t } = useTranslation();
  // 首屏同步读 UA，避免微信内先露出下载按钮
  const [isWeChat] = useState(
    () =>
      typeof navigator !== 'undefined' &&
      /MicroMessenger/i.test(navigator.userAgent),
  );

  return (
    <div className="container">
      <img src={Left} className="bg-left" alt="" aria-hidden="true" />
      <img src={Right} className="bg-right" alt="" aria-hidden="true" />
      <div className="content">
        <img className="app-logo" src={AppLogo} alt="" />
        <p className="baile-title">{t('AppTitle')}</p>
        <div className="app-description">
          <p className="description-text">{t('AppDescription')}</p>
        </div>
        {children}
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

export default DownloadPageLayout;
