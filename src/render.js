/* eslint-disable no-param-reassign, no-console  */

// Функция возвращает функцию
export default (elements) => (path, value) => {
  switch (path) {
    case 'form.errors':
      elements.feedback.innerHTML = value;
      break;
    case 'form.valid':
      elements.fields.url.classList.add('is-invalid');
      break;
    default:
      break;
  }
};
