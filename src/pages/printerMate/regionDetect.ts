/** 浏览器语言 tag 是否为简体中文（排除繁体 zh-TW / zh-HK / zh-Hant 等） */
function isSimplifiedChineseLanguage(language: string): boolean {
  const tag = language.toLowerCase();
  if (/^zh-(tw|hk|mo|hant)/.test(tag)) {
    return false;
  }
  return /^zh-(cn|sg|hans)/.test(tag);
}

/** 取浏览器首选语言：languages[0] 与 navigator.language 通常一致 */
function getPrimaryBrowserLanguage(): string {
  if (typeof navigator === 'undefined') {
    return '';
  }
  return navigator.languages?.[0] ?? navigator.language ?? '';
}

/** 首选语言为简体中文则视为大陆，否则视为海外 */
export function isMainlandChina(): boolean {
  const primaryLanguage = getPrimaryBrowserLanguage();
  if (!primaryLanguage) {
    return false;
  }
  return isSimplifiedChineseLanguage(primaryLanguage);
}
