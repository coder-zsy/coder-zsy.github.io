import { useEffect, useState } from 'react';
import './index.less';

// import AppLogo from '@/assets/index/appLogo.png';
import AppLogo from '@/assets/index/printerMateLogo.png';

import Left from '@/assets/index/left.png';
import OpenInBroswer from '@/assets/index/openInBroswer.png';
import Right from '@/assets/index/right.png';

const App = () => {
  const [isWeChat, setIsWeChat] = useState(false);
  const [appName, setAppName] = useState('PrinterMate');
  const [downloadText, setDownloadText] = useState('下载安装');

  useEffect(() => {
    const ua = navigator.userAgent;
    setIsWeChat(ua.indexOf('MicroMessenger') > -1);
    console.log('==========', navigator);
    const language = (
      navigator.browserLanguage || navigator.language
    ).toLowerCase();
    if (language.indexOf('zh') > -1) {
      // zh-cn
    } else if (language.indexOf('en') > -1) {
      // 英文
      setAppName('TOYS');
      setDownloadText('Download and install');
    } else {
    }
  }, []);

  const downLoad = () => {
    const ua = navigator.userAgent;
    if (ua.indexOf('Android') > -1 || ua.indexOf('Adr') > -1) {
      window.location.href =
        'https://play.google.com/store/apps/details?id=com.anonymous.bluetoothprinter';
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
        <p className="baile-title">{appName}</p>
        <div className="app-description">
          <p className="description-text">
            这是一个个人开发的移动应用程序，用于提供便捷的工具和服务。
          </p>
          <p className="description-text">
            本应用为个人作品，仅供学习和交流使用。
          </p>
        </div>
        <button onClick={downLoad} className="download">
          {downloadText}
        </button>
      </div>
      <div className="bottom">
        <div className="footer-info">
          <a
            className="icp-record"
            href="https://beian.miit.gov.cn/#/Integrated/index"
            target="_blank"
            rel="noopener noreferrer"
          >
            豫ICP备2021019481号
          </a>
          <p className="copyright">© 2025 个人开发者. All rights reserved.</p>
        </div>
      </div>
      {isWeChat && (
        <div className="open-safari">
          <img
            className="guide img-responsive"
            src={OpenInBroswer}
            alt="Open in Browser"
          />
        </div>
      )}
    </div>
  );
};

export default App;
