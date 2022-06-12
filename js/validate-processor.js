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
    const pristineErrorClass = pristinedForm.config.errorTextClass;
    /* children nodes */
    for (const index in adForm.children.adForm) {
      const childData = adForm.children.adForm[index];
      const childNode = document.querySelector(`${childData.selector[0]}${childData.value}`);
      /* normalize children DOM nodes */
      if (childData.cmd) {
        normalizeNode(childNode, childData.cmd);
      }
      /* validation / dependencies for children DOM nodes START */
      if (typeof childData.optionsToValidate !== 'undefined') {
        switch (index) {
          case 'type': {
            /* Validate and set dependencies for Type/Price fields */
            const subjectToValidate = domProcessor(false, 'getChild', adFormName, childData.subjectToValidate.subjectName);
            const subjectToValidateNode = document.querySelector(`${subjectToValidate.selector[0]}${subjectToValidate.value}`);
            const cmd = domProcessor(false, 'getCMD', childData.subjectToValidate.cmd[0]);
            const cmdParam = childData.subjectToValidate.cmd[1];
            const errorText = domProcessor(false, 'getLocalText', 'minPrice');
            /* initial validation */
            const initialFieldsValidation = () => {
              cmd(subjectToValidateNode, childData.optionsToValidate[childNode.value].minPrice, 'placeholder');
              cmd(subjectToValidateNode, childData.optionsToValidate[childNode.value].minPrice, cmdParam[1]);
            };
            initialFieldsValidation();
            const getPriceErrorMessage = (price) => {
              const minPrice = childData.optionsToValidate[childNode.value].minPrice;
              if (price < minPrice) {
                return `${errorText.part1} ${minPrice}`;
              }
              return '';
            };
            const validatePrice = (price) => {
              const isValid = price >= Number(subjectToValidateNode.getAttribute('min'));
              subjectToValidateNode.classList.toggle('error-input-placeholder', isValid === false);
              return isValid;
            };
            pristinedForm.addValidator(subjectToValidateNode, validatePrice, getPriceErrorMessage);
            const typeSelectFieldInputHandler = (ev) => {
              /* set validated attribute */
              const validatedValue = childData.optionsToValidate[ev.currentTarget.value].minPrice;
              cmd(subjectToValidateNode, validatedValue, cmdParam[1]);
              /* set placeholder */
              subjectToValidateNode.placeholder = validatedValue;
              subjectToValidateNode.dispatchEvent(new Event('input'));
            };
            childNode.addEventListener('input', typeSelectFieldInputHandler);
            break;
          }
          case  'title': {
            const subjectToValidate = domProcessor(false, 'getChild', adFormName, adForm.children.adForm[index].subjectToValidate.subjectName);
            const subjectToValidateNode = document.querySelector(`${subjectToValidate.selector[0]}${subjectToValidate.value}`);
            const errorText = domProcessor(false, 'getLocalText', 'titleLength');
            const titleMinLength = Number(subjectToValidateNode.getAttribute('minLength'));
            const errorMessageMin = `${errorText.part1} ${errorText.part3} ${titleMinLength} ${errorText.part4}`;
            const titleMaxLength = Number(subjectToValidateNode.getAttribute('maxLength'));
            const errorMessageMax = `${errorText.part2} ${errorText.part3} ${titleMaxLength} ${errorText.part4}`;
            let timeOut = '';
            const timeOutLength = 2000;
            const getTitleErrorMessage = (title) => {
              if (title.length < titleMinLength) {
                return errorMessageMin;
              }
              if (title.length === titleMaxLength) {
                return errorMessageMax;
              }
              return '';
            };
            const validateTitle = (title) => {
              clearTimeout(timeOut);
              const isValid = title.length >= titleMinLength;
              if (title.length === titleMaxLength) {
                subjectToValidateNode.classList.toggle('error-input-placeholder', true);
                timeOut = setTimeout(() => {
                  subjectToValidateNode.classList.toggle('error-input-placeholder', false);
                }, timeOutLength);
                return false;
              }
              subjectToValidateNode.classList.toggle('error-input-placeholder', isValid === false);
              return isValid;
            };
            pristinedForm.addValidator(subjectToValidateNode, validateTitle, getTitleErrorMessage);
            break;
          }
        }
        pristinedForm.validate();
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
};

export { validateProcessor };
