/** 各平台应用市场 / 直链，首页与 download 页共用 */
export const DOWNLOAD_LINKS = {
  appStore: 'https://apps.apple.com/us/app/printermate/id6738001101',
  googlePlay:
    'https://play.google.com/store/apps/details?id=com.anonymous.bluetoothprinter',
  androidApk: 'https://oss.toyslove.cn/printer-mate-1.0.9.apk',
} as const;

/** 按 UA 识别 iOS / Android，返回对应应用市场链接 */
export function getStoreUrlByUserAgent(
  ua: string = typeof navigator !== 'undefined' ? navigator.userAgent : '',
): string {
  if (/Android|Adr/i.test(ua)) {
    return DOWNLOAD_LINKS.googlePlay;
  }
  if (/\(i[^;]+;( U;)? CPU.+Mac OS X/i.test(ua)) {
    return DOWNLOAD_LINKS.appStore;
  }
  return DOWNLOAD_LINKS.googlePlay;
}
