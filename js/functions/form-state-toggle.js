/* disable: domProcessor(false, 'pageDisable') */
/* enable: domProcessor(false, 'pageEnable') */

/* disable: domProcessor(false, 'mapFilterDisable') */
/* enable: domProcessor(false, 'mapFilterEnable') */

const FieldsToToggle = [
  'input',
  'select',
  'textarea',
  'button',
];

const formStateToggle = (toggle, formToToggle, classToToggle = '') => {
  /* toggle adForm/filterForm state */
  const formNode = document.querySelector(formToToggle.selectorValue);
  if (classToToggle) {
    formNode.classList.toggle(classToToggle, toggle);
  }
  FieldsToToggle.forEach((selectorValue) => {
    [...formNode.querySelectorAll(selectorValue)]
      .forEach((formChild) => {
        formChild.disabled = toggle;
      });
  });
};

export { formStateToggle };
