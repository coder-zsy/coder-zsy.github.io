import cn from '../locales/cn.json';

declare module 'i18next' {
	interface CustomTypeOptions {
		resources: typeof cn.translation;
	}
}

export type i18 = keyof typeof cn.translation;
