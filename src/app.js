import * as yup from 'yup';
import i18n from 'i18next';

import resources from './locales/resources.js';
import watch from './view.js';

export default () => {
  const initialState = {
    form: {
      valid: true,
      error: {},
      fields: {
        url: '',
      },
    },
    feeds: [],
    language: '',
  };

  const elements = {
    form: document.querySelector('.rss-form '),
    fields: {
      url: document.querySelector('#url-input'),
    },
    submitButton: document.querySelector('button[type="submit"]'),
    feedback: document.querySelector('.feedback'),
  };

  const i18nInstance = i18n.createInstance();

  i18nInstance.init({
    lng: 'ru',
    debug: true,
    resources,
  }).then(() => {
    const watchedState = watch(initialState, elements, i18nInstance);

    yup.setLocale({
      string: {
        url: { key: 'errors.invalidUrl' },
      },
      mixed: {
        required: () => ({ key: 'errros.requiredField' }),
        notOneOf: () => ({ key: 'errors.linkAlreadyAdded' }),
      },
    });

    // Результат промис
    const validateURL = (url) => {
      const schema = yup.string().required().url().notOneOf(watchedState.feeds);
      return schema.validate(url);
    };

    elements.form.addEventListener('submit', (e) => {
      e.preventDefault();

      const formData = new FormData(e.target);
      const url = formData.get('url');
      // watchedState.form.fields.url = value;

      // Валидация
      validateURL(url)
        .then(() => {
          watchedState.form = {
            valid: true,
            error: null,
          };
          // watchedState.feeds.push(watchedState.form.fields.url);
          elements.form.reset();
          elements.fields.url.focus();
        })
        .catch((err) => {
          watchedState.form = {
            valid: false,
            error: i18nInstance.t(err.message.key),
          };
        });
    });
  });
};
