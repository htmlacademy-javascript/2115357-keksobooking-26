/* functions */
import   {getPristine}    from './functions.js';

/* dom processor */
import   { domProcessor }        from './dom-processor.js';

const normalizeNode = (node, CMD) => {
  const nodeCMDParams = CMD[1];
  const nodeCMD = domProcessor(false, 'getCMD', CMD[0]);
  nodeCMDParams.forEach((value0Attribute1) => {
    nodeCMD(node, value0Attribute1[0], value0Attribute1[1]);
  });
};
/* ads validation to the real DOM elements */
const validateProcessor = () => {
  /* normalize and add validation to the adForm START */
  const adFormName = 'adForm';
  const adForm = domProcessor(false, 'getContainer', adFormName);
  const adFormNode = document.querySelector(`${adForm.selector}${adForm.value}`);
  if (typeof adFormNode !=='undefined') {
    /* normalize DOM container adFormNode */
    normalizeNode(adFormNode, adForm.cmd);
    /* pristine the form*/
    const pristineAdFormClass = domProcessor(false, 'getClass', 'pristineAdFormClass');
    const pristinedForm = getPristine(adFormNode, pristineAdFormClass);
    /* children nodes */
    for (const index in adForm.children.adForm) {
      const childNode = document.querySelector(`${adForm.children.adForm[index].selector[0]}${adForm.children.adForm[index].value}`);
      /* normalize children DOM nodes */
      if (adForm.children.adForm[index].cmd) {
        normalizeNode(childNode, adForm.children.adForm[index].cmd);
      }
      /* validation / dependencies for children DOM nodes START */
      if (typeof adForm.children.adForm[index].optionsToValidate !== 'undefined') {
        switch (index) {
          case 'type': {
            /* Validate and set dependencies for Type/Price fields */
            const subjectToValidate = domProcessor(false, 'getChild', adFormName, adForm.children.adForm[index].subjectToValidate.subjectName);
            const subjectToValidateNode = document.querySelector(`${subjectToValidate.selector[0]}${subjectToValidate.value}`);
            const cmd = domProcessor(false, 'getCMD', adForm.children.adForm[index].subjectToValidate.cmd[0]);
            const cmdParam = adForm.children.adForm[index].subjectToValidate.cmd[1];
            /* pristine the filed */
            const validatePrice = (price) => {
              const isValid = price >= Number(subjectToValidateNode.getAttribute('min'));
              subjectToValidateNode.classList.toggle('error-input-placeholder', isValid === false);
              return isValid;
            };
            pristinedForm.addValidator(subjectToValidateNode, validatePrice);
            /* Type part */
            const typeSelectFieldChangeHandler = (ev) => {
              const validatedValue = adForm.children.adForm[index].optionsToValidate[ev.currentTarget.value].minPrice;
              /* set placeholder */
              subjectToValidateNode.placeholder = validatedValue;
              /* set validated attribute */
              cmd(subjectToValidateNode, validatedValue, cmdParam[1]);
              pristinedForm.validate();
            };
            childNode.addEventListener('change', typeSelectFieldChangeHandler);
            /* Price part */
            const priceNumberFieldChangeHandler = () => {
              pristinedForm.validate();
            };
            subjectToValidateNode.addEventListener('input', priceNumberFieldChangeHandler);
            /* initial validation */
            const initialFormValidation = () => {
              cmd(subjectToValidateNode, childNode.value, cmdParam[1]);
              pristinedForm.validate();
            };
            initialFormValidation();
            break;
          }
        }
      }
      /* validation / dependencies for children DOM nodes END */
    }
    /* type */
    //«Тип жилья» влияет на минимальное значение поля «Цена за ночь»:
    /*
    вместе с минимальным значением цены нужно изменять и плейсхолдер.
    Под ограничением подразумевается валидация минимального значения, которое можно ввести в поле с ценой.
    Изменять само значение поля не нужно, это приведёт к плохому UX (опыту взаимодействия).
    Даже если уже указанное значение не попадает под новые ограничения, не стоит без ведома пользователя изменять значение поля.
*/
    /* submit event validation START */
    const submitButton = document.querySelector(`${adForm.children.adForm.submit.selector[0]}${adForm.children.adForm.submit.value}`);
    const submitButtonClickHandler = (ev) => {
      ev.preventDefault();
      const isFormValid = pristinedForm.validate();
      console.log(isFormValid);
    };
    submitButton.addEventListener('click', submitButtonClickHandler);
    /* submit event validation END */
  }
  /* normalize and add validation to the adForm END */

console.log(adForm);
};

export { validateProcessor };
