/** 中国大陆常用 IANA 时区，用于首屏同步推断 */
const MAINLAND_CHINA_TIMEZONES = new Set([
  'Asia/Shanghai',
  'Asia/Urumqi',
  'Asia/Chongqing',
  'Asia/Harbin',
]);

export type RegionOverride = 'cn' | 'global';

/** 测试或运营可通过 ?region=cn|global 强制覆盖地区策略 */
export function getRegionOverrideFromUrl(): RegionOverride | null {
  if (typeof window === 'undefined') {
    return null;
  }
  const value = new URLSearchParams(window.location.search)
    .get('region')
    ?.toLowerCase();
  if (value === 'cn') {
    return 'cn';
  }
  if (value === 'global') {
    return 'global';
  }
  return null;
}

/** 首屏同步推断是否在中国大陆（时区 + 语言），避免下载区闪烁 */
export function isLikelyMainlandChina(): boolean {
  const override = getRegionOverrideFromUrl();
  if (override === 'cn') {
    return true;
  }
  if (override === 'global') {
    return false;
  }

  if (typeof navigator === 'undefined') {
    return false;
  }

  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  if (MAINLAND_CHINA_TIMEZONES.has(timeZone)) {
    return true;
  }

  const languages = navigator.languages?.length
    ? navigator.languages
    : [navigator.language];

  return languages.some((language) => /^zh(-cn|-hans)?$/i.test(language));
}

/** 挂载后尝试 GeoIP 校正；失败时保留同步推断结果 */
export async function detectMainlandChina(): Promise<boolean> {
  const override = getRegionOverrideFromUrl();
  if (override === 'cn') {
    return true;
  }
  if (override === 'global') {
    return false;
  }

  try {
    const response = await fetch('https://ipapi.co/country_code/', {
      signal: AbortSignal.timeout(3000),
    });
    if (!response.ok) {
      return isLikelyMainlandChina();
    }
    const countryCode = (await response.text()).trim().toUpperCase();
    return countryCode === 'CN';
  } catch {
    return isLikelyMainlandChina();
  }
}
