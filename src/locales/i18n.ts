import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./en";
import cn from "./cn";
import de from "./de";
import fr from "./fr";
import it from "./it";
import ja from "./ja";
import ru from "./ru";
import ptBR from "./pt-BR";

const resources = {
  en: en,
  cn: cn,
	de: de,
	fr: fr,
	it: it,
	ja: ja,
	ru: ru,
	'pt-BR': ptBR
};

console.log('xxx')
void i18n
	.use(initReactI18next) // passes i18n down to react-i18next
	.init({
		resources,
		lng: 'en', // 默认中文
		fallbackLng: 'en', // 默认中文
		interpolation: {
			escapeValue: false, // 关闭转义 防止注入攻击
		},
	});

export default i18n;
