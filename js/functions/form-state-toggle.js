const fieldsToToggle = [
  'input',
  'select',
  'textarea',
  'button',
];

const formStateToggle = (toggle, formToToggle, classToToggle = '') => {
  /* toggle adForm/filterForm state */
  const formNode = document.querySelector(formToToggle.selector);
  if (classToToggle) {
    formNode.classList.toggle(classToToggle, toggle);
  }
  fieldsToToggle.forEach((selectorValue) => {
    [...formNode.querySelectorAll(selectorValue)]
      .forEach((formChild) => {
        formChild.disabled = toggle;
      });
  });
};

export { formStateToggle };
