import i18n from 'i18next';
import ru from './locales/ru.js';

const i18nInstance = i18n.createInstance();
i18nInstance.init({
  lng: 'ru',
  debug: false,
  ru,
});

export default i18nInstance;
