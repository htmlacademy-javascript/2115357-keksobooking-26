/*functions*/
import   {getPristine}    from './functions.js';
import   {getRandomNumber}    from './functions.js';

/*dom processor*/
import   { domProcessor }        from './dom-processor.js';

const PRISTINE_CLASS = domProcessor(false, 'getClass', 'pristineAdFormClass');
const PRISTINE_ERROR_CLASS = PRISTINE_CLASS.errorTemporaryClass;
const SERVER_RESPONSE_DOM = {
  container: 'body',
  children: {
    success: 'success',
    error: 'error',
  },
};
const SERVER_RESPONSE_TEXT = {
  templates: {
    success:{
      message: `${domProcessor(false, 'getLocalText', 'serverResponseOkText').part1}\n${domProcessor(false, 'getLocalText', 'serverResponseOkText').part2}`,
    },
    error:{
      message: domProcessor(false, 'getLocalText', 'serverResponseErrorText').part1,
      button: domProcessor(false, 'getLocalText', 'serverResponseErrorText').part2,
    },
  },
};
const SERVER_RESPONSE_NODES = {
  success: '',
  error: '',
};
const EVENT_HANDLERS = {
  adFormSubmitButtonClickHandler: () => '',
  windowClickResponseRemoveHandler: () => '',
  escKeydownResponseRemoveHandler: () => '',
  adFormResetButtonClickHandler: () => '',
  typeSelectFieldInputHandler: () => '',
  timeinSelectFieldInputHandler: () => '',
  timeoutSelectFieldInputHandler: () => '',
  roomsSelectFieldInputHandler: () => '',
  roomsSelectFieldClickHandler: () => '',
  guestsSelectFieldInputHandler: () => '',
  guestsSelectFieldClickHandler: () => '',
};
const nodesToValidateOnReset = [];
const adFormName = 'adForm';
const adForm = domProcessor(false, 'getContainer', adFormName);
const adFormNode = document.querySelector(`${adForm.selector}${adForm.value}`);
const pristine = getPristine(adFormNode, PRISTINE_CLASS);
const requiredFieldText = domProcessor(false, 'getLocalText', 'requiredFieldText').part1;
const adFormResetButton = document.querySelector(`${adForm.children.adForm.reset.selector[0]}${adForm.children.adForm.reset.value}`);
const adFormSubmitButton = document.querySelector(`${adForm.children.adForm.submit.selector[0]}${adForm.children.adForm.submit.value}`);
const isEscapeKey = (ev) => ev.key === 'Escape';
const formSubmitButtonToggle = (toggle) => {
  if (toggle) {
    /*enable submit*/
    adFormSubmitButton.addEventListener('click', EVENT_HANDLERS.adFormSubmitButtonClickHandler);
    adFormSubmitButton.disabled = false;
  } else {
    /*disable submit*/
    adFormSubmitButton.removeEventListener('click', EVENT_HANDLERS.adFormSubmitButtonClickHandler);
    adFormSubmitButton.disabled = true;
  }
};
const processDomAfterServerResponse = () => {
  /*page to enable state*/
  domProcessor(false, 'pageEnable');
  /*enable back the submit button*/
  formSubmitButtonToggle(true);
  if (SERVER_RESPONSE_NODES.success) {
    SERVER_RESPONSE_NODES.success.remove();
    /*form fields back to defaults*/
    adFormResetButton.click();
    /*further post success submit actions*/
  }
  if (SERVER_RESPONSE_NODES.error) {
    SERVER_RESPONSE_NODES.error.remove();
  }
};
/*skip/resume validation for some fields_ now it is used for roomsNumber/guestsNumber*/
const skipValidation = {
  toggle: 0,
};
const resumeValidation = () => {
  skipValidation.toggle = 1;
};
/*initial validation, after resetButton removes validation results for selected fields*/
const validateInitial = (node, removeErrorClass = true) => {
  /*reset removes values faster then validation event happens */
  setTimeout(() => {
    if (removeErrorClass) {
      node.dispatchEvent(new Event('input'));
      node.classList.remove(PRISTINE_ERROR_CLASS);
    }
  }, 1);
};
/*runs DOM.cmd, used for normalize HTML in form elements*/
const runCMD = (node, CMD, value = false) => {
  const nodeCMDParams = CMD[1];
  const nodeCMD = domProcessor(false, 'getCMD', CMD[0]);
  nodeCMDParams.forEach((value0Attribute1) => {
    //value = value !== false && value !! value0Attribute1[0];
    nodeCMD(node, value !== false ? value : value0Attribute1[0], value0Attribute1[1]);
  });
};

const ADS_DATA = {};

/*!!! TEMP CHANGE START !!!*/
const setAdsData = (initial = false, ...nodes) => {
  /*!!!START CHANGE now it updates the address only CHANGE!!!*/
  nodes.forEach((node) => {
    // eslint-disable-next-line valid-typeof
    if (typeof node === 'undefind' || typeof node === null) {
      return;
    }
    /*either extend it to other fields or reduce to the address only*/
    setTimeout(() => {
      if (initial) {
        node.value = ADS_DATA.addressInitial;
      } else {
        node.value = ADS_DATA.addressCurrent;
      }
    });
  });
  /*!!!CHANGE now it updates the address only CHANGE END!!!*/
};
const temporaryFetch = () => {
  /*prepare to fetch*/
  /*page to disable state*/
  domProcessor(false, 'pageDisable');
  /*disable the submit button*/
  formSubmitButtonToggle(false);
  /*Here's going to be a fetch to the server with a response.*/
  /*Simulate a server response*/
  const serverMinResponseTime = 300;
  const serverMaxResponseTime = 1500;
  setTimeout(() => {
    const serverResponse = getRandomNumber(0, 1);
    if (serverResponse) {
      /*responses with OK*/
      /*success popups*/
      domProcessor(SERVER_RESPONSE_TEXT, 'fillContainerWithTemplate', SERVER_RESPONSE_DOM.children.success, SERVER_RESPONSE_DOM.container);
      /*popups remove toggle*/
      SERVER_RESPONSE_NODES.success = document.querySelector(`.${SERVER_RESPONSE_DOM.children.success}`);
      SERVER_RESPONSE_NODES.error = '';
    } else {
      /*responses with ERROR*/
      /*error popups*/
      domProcessor(SERVER_RESPONSE_TEXT, 'fillContainerWithTemplate', SERVER_RESPONSE_DOM.children.error, SERVER_RESPONSE_DOM.container);
      /*popus remove toggle*/
      SERVER_RESPONSE_NODES.error = document.querySelector(`.${SERVER_RESPONSE_DOM.children.error}`);
      SERVER_RESPONSE_NODES.success = '';
    }
    /*remove popup*/
    window.addEventListener('keydown', EVENT_HANDLERS.escKeydownResponseRemoveHandler);
    window.addEventListener('click', EVENT_HANDLERS.windowClickResponseRemoveHandler);
  }, getRandomNumber(serverMinResponseTime, serverMaxResponseTime));
};
/*!!! TEMP CHANGE END !!!*/

const recordAdAddressFromMap = (address, init = false) => {
  const ADDRSTR = `${address.lat}, ${address.lng}`;
  if (init) {
    ADS_DATA.addressInitial = ADDRSTR;
  } else {
    /*the map onPointerMove records a new address and sets the new value to the addr field*/
    ADS_DATA.addressCurrent = ADDRSTR;
    setAdsData(false, ADS_DATA.addressNode);
  }
};

EVENT_HANDLERS.escKeydownResponseRemoveHandler = (ev) => {
  if (isEscapeKey(ev)) {
    window.removeEventListener('keydown', EVENT_HANDLERS.escKeydownResponseRemoveHandler);
    window.removeEventListener('click', EVENT_HANDLERS.windowClickResponseRemoveHandler);
    processDomAfterServerResponse();
  }
};
EVENT_HANDLERS.windowClickResponseRemoveHandler = () => {
  window.removeEventListener('keydown', EVENT_HANDLERS.escKeydownResponseRemoveHandler);
  window.removeEventListener('click', EVENT_HANDLERS.windowClickResponseRemoveHandler);
  processDomAfterServerResponse();
};
EVENT_HANDLERS.adFormSubmitButtonClickHandler = (ev) => {
  ev.preventDefault();
  skipValidation.toggle = 1;
  const isFormValid = pristine.validate();
  if (isFormValid) {
    /*FETCH*/
    temporaryFetch();
    //adFormNode.submit();
  }
};
/*validate processor v1.0*/
const validateProcessor = () => {

  /*normalize and add validation to the adForm START*/
  if (typeof adFormNode !=='undefined') {
    /*normalize html elements inside adFormNode*/
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
      /*childData.optionsToValidate - set up in DOM.class*/
      if (typeof childData.optionsToValidate !== 'undefined') {
        nodesToValidateOnReset.push(childNode);
        /*get the data from DOM.class for this child node*/
        const objectToValidate = domProcessor(false, 'getChild', adFormName, childData.objectToValidate.name);
        const objectToValidateNode = document.querySelector(`${objectToValidate.selector[0]}${objectToValidate.value}`);
        switch (index) {
          /*address - TEMP CHANGE*/
          case 'address': {
            setAdsData(true, childNode);
            /*sets the address DOM real node to record addresses than onPointerMove on the map*/
            ADS_DATA.addressNode = childNode;
            break;
          }
          case 'type': {
            /*normalize select > options*/
            const childNodeOptionNodes = [...childNode.querySelectorAll(`${childData.objectToValidate.selector}`)];
            childNodeOptionNodes.forEach((option) => {
              runCMD(option, childData.objectToValidate.normalizeItself.cmd, childData.optionsToValidate[option.value].name);
            });
            /*Validate and set dependencies for Type/Price fields*/
            const bungalowZeroPriceException = childData.objectToValidate.bungalowZeroPriceException;
            const errorLangElement = 'minPrice';
            const errorText = domProcessor(false, 'getLocalText', errorLangElement);
            const maxPrice = Number(objectToValidateNode.getAttribute('max'));
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
              /*exclude bungalow with 0 or '' price*/
              if (childNode.value === bungalowZeroPriceException[0] && bungalowZeroPriceException[1].includes(price)) {
                return true;
              }
              const isValid = price && price >= Number(objectToValidateNode.getAttribute('min')) && price <= maxPrice || false;
              objectToValidateNode.classList.toggle(PRISTINE_ERROR_CLASS, isValid === false);
              return isValid;
            };
            EVENT_HANDLERS.typeSelectFieldInputHandler = (ev) => {
              /*set validated attribute, min and placeholder*/
              const validatedValue = childData.optionsToValidate[ev.currentTarget.value].minPrice;
              runCMD(objectToValidateNode, childData.objectToValidate.cmd, validatedValue);
              /*delete validation results from price field if it is empty, after a new type was selected*/
              validateInitial(objectToValidateNode, objectToValidateNode.value === '');
              objectToValidateNode.dispatchEvent(new Event('input'));
            };
            pristine.addValidator(objectToValidateNode, validatePrice, getPriceErrorMessage);
            childNode.addEventListener('input', EVENT_HANDLERS.typeSelectFieldInputHandler);
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
          case 'timein':  {
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
            EVENT_HANDLERS.timeinSelectFieldInputHandler = (ev) => {
              objectToValidateNode.value = ev.currentTarget.value;
            };
            EVENT_HANDLERS.timeoutSelectFieldInputHandler = (ev) => {
              childNode.value = ev.currentTarget.value;
            };
            childNode.addEventListener('input', EVENT_HANDLERS.timeinSelectFieldInputHandler);
            objectToValidateNode.addEventListener('input', EVENT_HANDLERS.timeoutSelectFieldInputHandler);
            /*initial normalization if the options are mixed up*/
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
            /*toggles - to write down only error messg. for one field at a time*/
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
            const getRoomsNumberErrorMessage = () => propertySideError.toggle && propertySideError.value.part1 || '';
            const validateRoomsNumberField = (roomsNumber) => {
              /*skip initial validation*/
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
            EVENT_HANDLERS.roomsSelectFieldInputHandler = () => {
              /*revalidate the opposit field*/
              /*toggle - to write down only one error messg. at a time*/
              guestsSideError.toggle = 0;
              objectToValidateNode.dispatchEvent(new Event('input'));
              guestsSideError.toggle = 1;
            };
            EVENT_HANDLERS.roomsSelectFieldClickHandler = () => {
              /*recharge validation*/
              resumeValidation();
            };
            /*objectToValidateNode validation*/
            const getGuestsNumberErrorMessage = () => guestsSideError.toggle && guestsSideError.value.part1 || '';
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
            EVENT_HANDLERS.guestsSelectFieldInputHandler = () => {
              /*revalidate the opposit field*/
              /*toggle - to write down only one error messg. at a time*/
              propertySideError.toggle = 0;
              childNode.dispatchEvent(new Event('input'));
              /*recharge opposite error*/
              propertySideError.toggle = 1;
            };
            EVENT_HANDLERS.guestsSelectFieldClickHandler = () => {
              /*recharge validation*/
              resumeValidation();
            };
            pristine.addValidator(childNode, validateRoomsNumberField, getRoomsNumberErrorMessage);
            pristine.addValidator(objectToValidateNode, validateGuestsNumberField, getGuestsNumberErrorMessage);
            childNode.addEventListener('change', EVENT_HANDLERS.roomsSelectFieldInputHandler);
            childNode.addEventListener('click', EVENT_HANDLERS.roomsSelectFieldClickHandler);
            objectToValidateNode.addEventListener('change', EVENT_HANDLERS.guestsSelectFieldInputHandler);
            objectToValidateNode.addEventListener('click', EVENT_HANDLERS.guestsSelectFieldClickHandler);
            break;
          }
        }
        /*first validation after the load*/
        validateInitial(childNode);
      }
      /*validation / dependencies for children DOM nodes END*/
    }
    /*submit adForm*/
    adFormSubmitButton.addEventListener('click', EVENT_HANDLERS.adFormSubmitButtonClickHandler);
    /*reset adForm*/
    /*validateOnReset*/
    const validateOnReset = () => {
      if (nodesToValidateOnReset.length) {
        skipValidation.toggle = 0;
        nodesToValidateOnReset.forEach((node) =>{
          validateInitial(node);
        });

        /*TEMP CHANGE, reset address field value*/
        setAdsData(true, nodesToValidateOnReset[nodesToValidateOnReset.length - 1]);
        /*TEMP CHANGE*/

      }
    };
    EVENT_HANDLERS.adFormResetButtonClickHandler = () => {
      validateOnReset();
    };
    adFormResetButton.addEventListener('click', EVENT_HANDLERS.adFormResetButtonClickHandler);
  }
  /*normalize and add validation to the adForm END*/
};

export { recordAdAddressFromMap };
export { validateProcessor };
