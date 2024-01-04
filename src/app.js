import * as yup from 'yup';
import i18next from 'i18next';
import onChange from 'on-change';

import resourses from './locales/ru.js';
import render from './render.js';

export default () => {
  // Состояния при запуске приложения (Инициирующее состояние)
  const initialState = {
    form: {
      valid: true,
      errors: {},
      fields: {
        url: '',
      },
    },
    feeds: [],
    language: '',
  };

  // объект с DOM элементами
  const elements = {
    form: document.querySelector('.rss-form '),
    fields: {
      url: document.querySelector('#url-input'),
    },
    submitButton: document.querySelector('button[type="submit"]'),
    feedback: document.querySelector('.feedback'),
  };

  // i18next
  const i18nextInstance = i18next.createInstance();

  i18nextInstance.init({
    lng: 'ru',
    debug: true,
    resourses,
  }).then(() => {
    const state = onChange(initialState, render(elements));

    yup.setLocale({
      string: {
        url: { key: 'errors.invalidUrl' },
      },
      mixed: {
        required: () => ({ key: 'errros.requiredField' }),
        notOneOf: () => ({ key: 'errors.rssAlreadyAdded' }),
      },
    });

    // Результат промис
    const validateURL = (url) => {
      const schema = yup.string().required().url().notOneOf(state.feeds, 'Ссылка уже имеется в списке фидов');
      return schema.validate(url);
    };

    // Слушатель на форму
    elements.form.addEventListener('submit', (e) => {
      e.preventDefault();

      const formData = new FormData(e.target);
      const value = formData.get('url');
      state.form.fields.url = value;

      // Валидация
      validateURL(state.form.fields.url)
        .then(() => {
          state.form.errors = '';
          state.form.valid = true;
          state.feeds.push(state.form.fields.url);
          elements.form.reset();
          elements.fields.url.focus();
        })
        // Обработка ошибок
        .catch((err) => {
          // console.log(JSON.stringify(err, null, 2));
          // console.log(`err.errors: ${err.errors.key}`);
          console.log(i18nextInstance.t('errors.incorrectUrl'));
          state.form.errors = i18nextInstance.t(err.message.key);
          state.form.valid = false;
        });
    });
  });
};
