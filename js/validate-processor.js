/*functions*/
import   {getPristine}    from './functions.js';

/*dom processor*/
import   { domProcessor }        from './dom-processor.js';

const PRISTINE_CLASS = domProcessor(false, 'getClass', 'pristineAdFormClass');
const PRISTINE_ERROR_CLASS = PRISTINE_CLASS.errorTemporaryClass;
const nodesToValidateOnReset = [];
const adFormName = 'adForm';
const adForm = domProcessor(false, 'getContainer', adFormName);
const adFormNode = document.querySelector(`${adForm.selector}${adForm.value}`);
const pristine = getPristine(adFormNode, PRISTINE_CLASS);
const adFormSubmitButton = document.querySelector(`${adForm.children.adForm.submit.selector[0]}${adForm.children.adForm.submit.value}`);
const adFormResetButton = document.querySelector(`${adForm.children.adForm.reset.selector[0]}${adForm.children.adForm.reset.value}`);
const requiredFieldText = domProcessor(false, 'getLocalText', 'requiredFieldText').part1;
/*skip validation*/
const skipValidation = {
  toggle: 0,
};
const resumeValidation = () => {
  skipValidation.toggle = 1;
};
/*initial validation*/
const validateInitial = (node, removeErrorClass = true) => {
  /*on reset removes values slower then event*/
  setTimeout(() => {
    if (removeErrorClass) {
      node.dispatchEvent(new Event('input'));
      node.classList.remove(PRISTINE_ERROR_CLASS);
    }
  }, 1);
};
/*normalize form elements*/
const runCMD = (node, CMD, value = false) => {
  const nodeCMDParams = CMD[1];
  const nodeCMD = domProcessor(false, 'getCMD', CMD[0]);
  nodeCMDParams.forEach((value0Attribute1) => {
    //value = value !== false && value !! value0Attribute1[0];
    nodeCMD(node, value !== false ? value : value0Attribute1[0], value0Attribute1[1]);
  });
};

const validateProcessor = () => {
  /*normalize and add validation to the adForm START*/
  if (typeof adFormNode !=='undefined') {
    /*normalize DOM container adFormNode*/
    runCMD(adFormNode, adForm.cmd);
    /*children nodes*/
    for (const index in adForm.children.adForm) {
      const childData = adForm.children.adForm[index];
      const childNode = document.querySelector(`${childData.selector[0]}${childData.value}`);
      /*normalize children DOM nodes*/
      if (childData.cmd) {
        runCMD(childNode, childData.cmd);
      }
      /*validation / dependencies for children DOM nodes START*/
      if (typeof childData.optionsToValidate !== 'undefined') {
        nodesToValidateOnReset.push(childNode);
        const objectToValidate = domProcessor(false, 'getChild', adFormName, childData.objectToValidate.name);
        const objectToValidateNode = document.querySelector(`${objectToValidate.selector[0]}${objectToValidate.value}`);
        switch (index) {
          case 'type': {
            /*normalize select > options*/
            const childNodeOptionNodes = [...childNode.querySelectorAll(`${childData.objectToValidate.selector}`)];
            childNodeOptionNodes.forEach((option) => {
              runCMD(option, childData.objectToValidate.normalizeItself.cmd, childData.optionsToValidate[option.value].name);
            });
            /*Validate and set dependencies for Type/Price fields*/
            const bungalowZeroPriceException = ['bungalow',['', 0]];
            const errorLangElement = 'minPrice';
            const maxPrice = Number(objectToValidateNode.getAttribute('max'));
            const errorText = domProcessor(false, 'getLocalText', errorLangElement);
            const getPriceErrorMessage = (price) => {
              const minPrice = childData.optionsToValidate[childNode.value].minPrice;
              if (price === '') {
                return requiredFieldText;
              }
              if (price < minPrice) {
                return `${errorText.part1} ${minPrice}`;
              }
              if (price > maxPrice) {
                return `${errorText.part2} ${maxPrice}`;
              }
              return '';
            };
            const validatePrice = (price) => {
              /*bungalow with 0 price*/
              if (childNode.value === bungalowZeroPriceException[0] && bungalowZeroPriceException[1].includes(price)) {
                return true;
              }
              const isValid = price && price >= Number(objectToValidateNode.getAttribute('min')) && price <= maxPrice || false;
              objectToValidateNode.classList.toggle(PRISTINE_ERROR_CLASS, isValid === false);
              return isValid;
            };
            const typeSelectFieldInputHandler = (ev) => {
              /*set validated attribute*/
              const validatedValue = childData.optionsToValidate[ev.currentTarget.value].minPrice;
              runCMD(objectToValidateNode, childData.objectToValidate.cmd, validatedValue);
              validateInitial(objectToValidateNode, objectToValidateNode.value === '');
              objectToValidateNode.dispatchEvent(new Event('input'));
            };
            pristine.addValidator(objectToValidateNode, validatePrice, getPriceErrorMessage);
            childNode.addEventListener('input', typeSelectFieldInputHandler);
            break;
          }
          case 'title': {
            const errorText = domProcessor(false, 'getLocalText', 'titleLength');
            const titleMinLength = Number(objectToValidateNode.getAttribute('minLength'));
            const errorMessageMin = `${errorText.part1} ${errorText.part3} ${titleMinLength} ${errorText.part4}`;
            const titleMaxLength = Number(objectToValidateNode.getAttribute('maxLength'));
            const errorMessageMax = `${errorText.part2} ${errorText.part3} ${titleMaxLength - 1} ${errorText.part4}`;
            const getTitleErrorMessage = (title) => {
              if (title === '') {
                return requiredFieldText;
              }
              if (title.length < titleMinLength) {
                return errorMessageMin;
              }
              if (title.length === titleMaxLength) {
                return errorMessageMax;
              }
              return '';
            };
            const validateTitle = (title) => {
              const isValid = title.length >= titleMinLength && title.length < titleMaxLength;
              objectToValidateNode.classList.toggle(PRISTINE_ERROR_CLASS, isValid === false);
              return isValid;
            };
            pristine.addValidator(objectToValidateNode, validateTitle, getTitleErrorMessage);
            break;
          }
          case 'timein': {
            /*normalize select > options*/
            const childNodeOptionNodes = [...childNode.querySelectorAll(`${childData.objectToValidate.selector}`)];
            const objectToValidateOptionNodes = [...objectToValidateNode.querySelectorAll(`${childData.objectToValidate.selector}`)];
            /*timein's options*/
            childNodeOptionNodes.forEach((optionNode) => {
              const normalizedOptionValue = childData.optionsToValidate[optionNode.value.replace(':', '')].value;
              runCMD(optionNode, childData.objectToValidate.cmd, normalizedOptionValue);
            });
            /*timeout's options*/
            objectToValidateOptionNodes.forEach((optionNode) => {
              const normalizedOptionValue = objectToValidate.options[optionNode.value.replace(':', '')].value;
              runCMD(optionNode, childData.objectToValidate.cmd, normalizedOptionValue);
            });
            /*options dependencies*/
            const timeinSelectFieldInputHandler = (ev) => {
              objectToValidateNode.value = ev.currentTarget.value;
            };
            const timeoutSelectFieldInputHandler = (ev) => {
              childNode.value = ev.currentTarget.value;
            };
            childNode.addEventListener('input', timeinSelectFieldInputHandler);
            objectToValidateNode.addEventListener('input', timeoutSelectFieldInputHandler);
            /*initial validate if they are mixed up*/
            childNode.dispatchEvent(new Event('input'));
            break;
          }
          case 'roomNumber': {
            /*additional push for the second input*/
            nodesToValidateOnReset.push(objectToValidateNode);
            /*normalize select > options*/
            const childNodeOptionNodes = [...childNode.querySelectorAll(`${childData.objectToValidate.selector}`)];
            const objectToValidateOptionNodes = [...objectToValidateNode.querySelectorAll(`${childData.objectToValidate.selector}`)];
            /*roomnumber's options*/
            childNodeOptionNodes.forEach((optionNode) => {
              const normalizedOptionValue = childData.optionsToValidate[optionNode.value].value;
              runCMD(optionNode, childData.objectToValidate.cmd, normalizedOptionValue);
            });
            /*capacity's options*/
            objectToValidateOptionNodes.forEach((optionNode) => {
              const normalizedOptionValue = objectToValidate.options[optionNode.value].value;
              runCMD(optionNode, childData.objectToValidate.cmd, normalizedOptionValue);
            });
            /*validation*/
            const propertySideErrorElement = 'propertySideError';
            const propertySideError = {
              toggle: '',
              value: '',
            };
            propertySideError.toggle = 1;
            propertySideError.value = domProcessor(false, 'getLocalText', propertySideErrorElement);
            const guestsSideErrorElement = 'guestsSideError';
            const guestsSideError = {
              toggle: '',
              value: '',
            };
            guestsSideError.toggle = 1;
            guestsSideError.value = domProcessor(false, 'getLocalText', guestsSideErrorElement);
            /*childNode validation*/
            const getRoomsNumberErrorMessage = () => {
              return  propertySideError.toggle && propertySideError.value.part1 || '';
            };
            const validateRoomsNumberField = (roomsNumber) => {
              if (!skipValidation.toggle) {
                return true;
              }
              /*get the opposite side value*/
              const guestsNumber = Number(objectToValidateNode.value);
              /*get amount of rooms suitable for those guests*/
              const roomsSuitable = [];
              for (const indexRoomsNumber in childData.capacityNumberGuestsRules) {
                if (childData.capacityNumberGuestsRules[indexRoomsNumber].includes(guestsNumber)) {
                  roomsSuitable.push(indexRoomsNumber);
                }
              }
              return roomsSuitable.includes(roomsNumber);
            };
            const roomsSelectFieldInputHandler = () => {
              /*recharge validation*/
              skipValidation.toggle = 1;
              /*revalidate the opposit field*/
              guestsSideError.toggle = 0;
              objectToValidateNode.dispatchEvent(new Event('input'));
              guestsSideError.toggle = 1;
            };
            const roomsSelectFieldClickHandler = () => {
              resumeValidation();
            };
            /*objectToValidateNode validation*/
            const getGuestsNumberErrorMessage = () => {
              return  guestsSideError.toggle && guestsSideError.value.part1 || '';
            };
            const validateGuestsNumberField = (guestsNumber) => {
              if (!skipValidation.toggle) {
                return true;
              }
              /*get the opposite side value*/
              const roomsNumber = Number(childNode.value);
              /*capacityNumberGuestsRules: index-roomssNumber, value[guestsNumbers]*/
              /*get amount of guests suitable for this room*/
              const guestsSuitable = childData.capacityNumberGuestsRules[roomsNumber];
              return guestsSuitable.includes(Number(guestsNumber));
            };
            const guestsSelectFieldInputHandler = () => {
              /*recharge validation*/
              skipValidation.toggle = 1;
              /*revalidate the opposit field*/
              propertySideError.toggle = 0;
              childNode.dispatchEvent(new Event('input'));
              /*recharge opposite error*/
              propertySideError.toggle = 1;
            };
            const guestsSelectFieldClickHandler = () => {
              resumeValidation();
            };
            pristine.addValidator(childNode, validateRoomsNumberField, getRoomsNumberErrorMessage);
            pristine.addValidator(objectToValidateNode, validateGuestsNumberField, getGuestsNumberErrorMessage);
            childNode.addEventListener('change', roomsSelectFieldInputHandler);
            childNode.addEventListener('click', roomsSelectFieldClickHandler);
            objectToValidateNode.addEventListener('change', guestsSelectFieldInputHandler);
            objectToValidateNode.addEventListener('click', guestsSelectFieldClickHandler);
            break;
          }
        }
        /*initial validation*/
        validateInitial(childNode);
      }
      /*validation / dependencies for children DOM nodes END*/
    }
    /*submit adForm*/
    const adFormSubmitButtonClickHandler = (ev) => {
      ev.preventDefault();
      skipValidation.toggle = 1;
      const isFormValid = pristine.validate();
      console.log(isFormValid);
    };
    adFormSubmitButton.addEventListener('click', adFormSubmitButtonClickHandler);
    /*reset adForm*/
    /*validateOnReset*/
    const validateOnReset = () => {
      if (nodesToValidateOnReset.length) {
        skipValidation.toggle = 0;
        nodesToValidateOnReset.forEach((node) =>{
          validateInitial(node);
        });
      }
    };
    const adFormResetButtonClickHandler = () => {
      validateOnReset();
    };
    adFormResetButton.addEventListener('click', adFormResetButtonClickHandler);
  }
  /*normalize and add validation to the adForm END*/
};

export { validateProcessor };
