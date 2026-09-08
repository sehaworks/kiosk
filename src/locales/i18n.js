import { initReactI18next } from 'react-i18next';

import i18n from 'i18next';

import zh_common from './zh/common.json';
import zh_main from './zh/main.json';
import zh_product from './zh/product.json';
import en_common from './en/common.json';
import en_main from './en/main.json';
import en_product from './en/product.json';
import ja_common from './ja/common.json';
import ja_main from './ja/main.json';
import ja_product from './ja/product.json';
import ko_common from './ko/common.json';
import ko_main from './ko/main.json';
import ko_product from './ko/product.json';
import ko_mobileTicket from './ko/mobileTicket.json';
import en_mobileTicket from './en/mobileTicket.json';
import ja_mobileTicket from './ja/mobileTicket.json';
import zh_mobileTicket from './zh/mobileTicket.json';
import ko_header from './ko/header.json';
import en_header from './en/header.json';
import ja_header from './ja/header.json';
import zh_header from './zh/header.json';

i18n.use(initReactI18next).init({
  resources: {
    ko: {
      common: ko_common,
      main: ko_main,
      product: ko_product,
      mobileTicket: ko_mobileTicket,
      header: ko_header,
    },
    en: {
      common: en_common,
      main: en_main,
      product: en_product,
      mobileTicket: en_mobileTicket,
      header: en_header,
    },
    ja: {
      common: ja_common,
      main: ja_main,
      product: ja_product,
      mobileTicket: ja_mobileTicket,
      header: ja_header,
    },
    zh: {
      common: zh_common,
      main: zh_main,
      product: zh_product,
      mobileTicket: zh_mobileTicket,
      header: zh_header,
    },
  },
  lng: 'ko',
  fallbackLng: 'ko',
  ns: ['common', 'main', 'product', 'header', 'mobileTicket'],
  defaultNS: 'main',
  interpolation: {
    escapeValue: false,
  },
});

// html lang 동기화 (일본어, 중국어 변경 시 폰트 변경을 위해)
const applyHtmlLang = (lng) => {
  const html = document.documentElement;
  if (!html) return;
  html.setAttribute('lang', lng);
  // ar/he 같은 RTL 언어 지원 시
  html.setAttribute(
    'dir',
    ['ar', 'he', 'fa', 'ur'].includes(lng) ? 'rtl' : 'ltr'
  );
};

// 초기 1회
applyHtmlLang(i18n.language);

// 변경 시 반영
i18n.on('languageChanged', (lng) => applyHtmlLang(lng));

export default i18n;
