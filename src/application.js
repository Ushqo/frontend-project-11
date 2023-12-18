// import keyBy from 'lodash/keyBy.js';
// import isEmpty from 'lodash/isEmpty.js';
import * as yup from 'yup';
import onChange from 'on-change';
import render from './render.js';

export default () => {
  // объект с DOM элементами
  const elements = {
    form: document.querySelector('.rss-form '),
    fields: {
      url: document.querySelector('#url-input'),
    },
    submitButton: document.querySelector('button[type="submit"]'),
    feedback: document.querySelector('.feedback'),
  };

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
  };

  // Состояние при изменении
  const state = onChange(initialState, render(elements));

  const schema = yup.string().required().url('Ссылка должна быть валидным URL').notOneOf(state.feeds, 'Ссылка уже имеется в списке фидов');

  // Слушатель на форму
  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const value = formData.get('url');
    state.form.fields.url = value;

    schema.validate(state.form.fields.url)
      .then(() => {
        state.form.errors = '';
        state.form.valid = true;
        state.feeds.push(state.form.fields.url);
        elements.form.reset();
        elements.fields.url.focus();
      })
      // Обработка ошибок
      .catch((err) => {
        state.form.errors = err.message;
        state.form.valid = false;
        console.log(err);
      });
  });
};
