/* eslint-disable no-param-reassign, no-console  */
import onChange from 'on-change';

// Отделная функция на обработку изменений формы
const handleForm = (state, elements, i18n) => {
  const currentElements = { ...elements };

  if (state.form.error) {
    currentElements.feedback.classList.add('text-danger');
    currentElements.feedback.classList.remove('text-success');
    currentElements.feedback.textContent = i18n.t(state.form.error);
  }
  if (state.form.valid) {
    currentElements.fields.url.classList.remove('is-invalid');
  } else {
    currentElements.fields.url.classList.add('is-invalid');
  }

  return currentElements;
};

export default (state, elements, i18n) => {
  const watchedState = onChange(state, (path) => {
    switch (path) {
      case 'form':
        // Если изменилось что-то в состоянии формы, то запускаем обработчик формы
        handleForm(state, elements, i18n);
        break;
      default:
        console.log(path);
        throw new Error('Что-то пошло не так');
    }
  });

  return watchedState;
};
