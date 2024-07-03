import I18n from 'react-native-i18n';
import it from './locales/it';
import en from './locales/en';

I18n.fallbacks = true;

I18n.defaultLocale = 'it';

I18n.translations = {
  it,
  en,
};

export function strings(name, params = {}) {
  return I18n.t(name, params);
}

export default I18n;
