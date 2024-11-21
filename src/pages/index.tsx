import React, { useEffect, useState } from "react";
import "./index.less";

import AppLogo from "@/assets/index/appLogo.png";
import Left from "@/assets/index/left.png";
import Right from "@/assets/index/right.png";
import OpenInBroswer from "@/assets/index/openInBroswer.png";

const App = () => {
  const [isWeChat, setIsWeChat] = useState(false);
  const [appName, setAppName] = useState("TOYS");
  const [downloadText, setDownloadText] = useState("下载安装");

  useEffect(() => {
    const ua = navigator.userAgent;
    setIsWeChat(ua.indexOf("MicroMessenger") > -1);
    console.log("==========", navigator);
    const language = (
      navigator.browserLanguage || navigator.language
    ).toLowerCase();
    if (language.indexOf("zh") > -1) {
      // zh-cn
    } else if (language.indexOf("en") > -1) {
      // 英文
      setAppName("TOYS");
      setDownloadText("Download and install");
    } else {
    }
  }, []);

  const downLoad = () => {
    const ua = navigator.userAgent;
    if (ua.indexOf("Android") > -1 || ua.indexOf("Adr") > -1) {
      window.location.href = "@/assets/app/Toys1.1.0.apk";
    } else if (!!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)) {
      // iOS 设备，通过AppStore下载
      window.location.href = "https://apps.apple.com/app/id1096966252";
    } else {
      // 其他平台的下载逻辑可以在这里添加
    }
  };

  return (
    <div className="container">
      <img src={Left} className="bg-left" />
      <img src={Right} className="bg-right" />
      <div className="content">
        <img className="app-logo" src={AppLogo} />
        <p className="baile-title">{appName}</p>
        <button onClick={downLoad} className="download">
          {downloadText}
        </button>
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
