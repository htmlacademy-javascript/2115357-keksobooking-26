/*functions*/
import   {getPristine}    from './functions.js';

/*dom processor*/
import   { domProcessor }        from './dom-processor.js';

/*map processor*/
import   { resetSimilarAdsFilterForm }        from './map-processor.js';

/* api processor */
import   { processApi }          from './api-processor.js';

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
  avatarInputChangeHandler: () => '',
  imagesInputChangeHandler: () => '',
};
const nodesToValidateOnReset = [];
const adFormName = 'adForm';
const adForm = domProcessor(false, 'getContainer', adFormName);
const adFormNode = document.querySelector(`${adForm.selector}${adForm.value}`);
const pristine = getPristine(adFormNode, PRISTINE_CLASS);
const requiredFieldText = domProcessor(false, 'getLocalText', 'requiredFieldText').part1;
const adFormResetButton = document.querySelector(`${adForm.children.adForm.reset.selector[0]}${adForm.children.adForm.reset.value}`);
const adFormSubmitButton = document.querySelector(`${adForm.children.adForm.submit.selector[0]}${adForm.children.adForm.submit.value}`);
const avatarInputFieldNode = document.querySelector(`${adForm.children.adForm.avatar.selector[0]}${adForm.children.adForm.avatar.value}`);
const imagesInputFieldNode = document.querySelector(`${adForm.children.adForm.images.selector[0]}${adForm.children.adForm.images.value}`);
const avatarImageContainerNode = document.querySelector(`${adForm.children.adForm.avatarContainer.selector[0]}${adForm.children.adForm.avatarContainer.value}`);
const avatarImageContainerBlankImage = document.querySelector(`${adForm.children.adForm.avatarContainer.selector[0]}${adForm.children.adForm.avatarContainer.value}`).querySelector('img');
const imagesImageContainerNode = document.querySelector(`${adForm.children.adForm.imagesContainer.selector[0]}${adForm.children.adForm.imagesContainer.value}`);
const NEW_UPLOADED_IMAGE_CLASS = domProcessor(false, 'getClass', 'newImageClass');
const DISPLAY_NONE_CLASS = domProcessor(false, 'getClass', 'hidden');
const ADDRESS_ROUND_FLOATS_NUMBER = 5;
const similarAdsFilterFormDomClassElement = 'mapFilters';
const similarAdsFilterForm = domProcessor(false, 'getContainer', similarAdsFilterFormDomClassElement);
const refreshSimilarAdsButtonClass2 = similarAdsFilterForm.classes.class2;
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
  /*keep adFilterForm disabled if similar ads load error START*/
  if (document.querySelector(`.${refreshSimilarAdsButtonClass2}`)) {
    domProcessor(false, 'mapFilterDisable');
  }
  /*keep adFilterForm disabled if similar ads load error END*/
  /*enable back the submit button*/
  formSubmitButtonToggle(true);
  if (SERVER_RESPONSE_NODES.success) {
    /*form fields back to defaults*/
    adFormResetButton.click();
    SERVER_RESPONSE_NODES.success.remove();
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
    if (node === 'undefind' || node === null) {
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
const sendNewAdToApi = () => {
  /*prepare to fetch*/
  /*get the form data*/
  const newAdDataToSend = new FormData(adFormNode);
  /*disable the submit button*/
  formSubmitButtonToggle(false);
  /*page to disable state*/
  domProcessor(false, 'pageDisable');
  processApi('push', newAdDataToSend, 'POST')
    .then((response) => {
      /*!!!TEMP DELETE TEMP!!!*/
      const submitErrorToggle = Math.floor(Math.random() * 2) === 0;
      /*!!!TEMP DELETE TEMP!!!*/
      if (response && submitErrorToggle) {
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
    });
};
const resetAvatarImageContainer = () => {
  [...avatarImageContainerNode.childNodes].forEach((child) => {
    if (child !== avatarImageContainerBlankImage) {
      child.remove();
    }
  });
  avatarImageContainerBlankImage.classList.remove(DISPLAY_NONE_CLASS);
};
const resetImagesImageContainer = () => {
  imagesImageContainerNode.classList.remove(NEW_UPLOADED_IMAGE_CLASS);
  imagesImageContainerNode.style.removeProperty('background-image');
};
const setImgSrc = (img, container) => {
  container.src = img;
};
const recordAdAddressFromMap = (address, init = false) => {
  const ADDRSTRING = `${address.lat.toFixed(ADDRESS_ROUND_FLOATS_NUMBER)}, ${address.lng.toFixed(ADDRESS_ROUND_FLOATS_NUMBER)}`;
  if (init) {
    ADS_DATA.addressInitial = ADDRSTRING;
  } else {
    /*the map onMainMarkerMove records a new address and sets the new value to the addr field*/
    ADS_DATA.addressCurrent = ADDRSTRING;
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
  /*prevent click on window after fetch is completed (closes the popups)*/
  ev.stopPropagation();
  skipValidation.toggle = 1;
  const isFormValid = pristine.validate();
  if (isFormValid) {
    /*FETCH*/
    sendNewAdToApi();
  }
};
EVENT_HANDLERS.avatarInputChangeHandler = () => {
  resetAvatarImageContainer();
  const uploadedImg = URL.createObjectURL(avatarInputFieldNode.files[0]);
  const newAvatar = avatarImageContainerBlankImage.cloneNode();
  setImgSrc(uploadedImg, newAvatar);
  avatarImageContainerBlankImage.classList.add(DISPLAY_NONE_CLASS);
  avatarImageContainerNode.append(newAvatar);
};
EVENT_HANDLERS.imagesInputChangeHandler = () => {
  resetImagesImageContainer();
  const uploadedImg = URL.createObjectURL(imagesInputFieldNode.files[0]);
  imagesImageContainerNode.classList.add(NEW_UPLOADED_IMAGE_CLASS);
  imagesImageContainerNode.style.backgroundImage = `url(${uploadedImg})`;
};


/*validate processor*/
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
          /*!!!CHANGE each case move to separate function CHANGE!!!*/
          /*address - TEMP CHANGE*/
          case 'address': {
            setAdsData(true, childNode);
            /*sets the address DOM real node to record addresses than onPointerMove on the map*/
            ADS_DATA.addressNode = childNode;
            break;
          }
          case 'type': {
            /*slider start*/
            /*slider initialize START*/
            const priceFieldShakinBorderStyleDef = '1px solid lightgray';
            const SLIDER_CLASS = 'slider__container';
            const SLIDER_INITIAL_MIN_PRICE = 0;
            const SLIDER_INITIAL_MAX_PRICE = 100000;
            const SLIDER_INITIAL_START_PRICE = 0;
            const SLIDER_INITIAL_STEP = 500;
            const slidePriceToggles = {
              slideToPriceBloker: 1,
              priceToSlideBlocker: 0,
              priceSliderTimeOut: '',
              priceSliderTimeOutTime: 100,
            };
            const priceSlider = document.createElement('div');
            priceSlider.classList.add(SLIDER_CLASS);
            objectToValidateNode.parentNode.insertBefore(priceSlider, objectToValidateNode.nextSibling);
            noUiSlider.create(priceSlider, {
              range: {
                min: SLIDER_INITIAL_MIN_PRICE,
                max: SLIDER_INITIAL_MAX_PRICE,
              },
              start: SLIDER_INITIAL_START_PRICE,
              step: SLIDER_INITIAL_STEP,
            });
            /*slider initialize END*/
            /*update slider conf values*/
            const updateSlider = (sliderMinPrice, sliderStep, sliderMaxPrice = SLIDER_INITIAL_MAX_PRICE) => {
              priceSlider.noUiSlider.updateOptions({
                range: {
                  min: sliderMinPrice,
                  max: sliderMaxPrice,
                },
                start: priceSlider.noUiSlider.get(),
                step: sliderStep,
              });
              if (!objectToValidateNode.value || Number(objectToValidateNode.value) < sliderMinPrice) {
                priceSlider.noUiSlider.set(sliderMinPrice);
              }
            };
            /*priceInputFiledSetsNewValue > slederGetsNewValue*/
            const updateSliderValue = (price) => {
              priceSlider.noUiSlider.set(price);
            };
            /*slederSetsNewValue > priceInputFiledGetsNewValue*/
            priceSlider.noUiSlider.on('update', () => {
              if (slidePriceToggles.slideToPriceBloker) {
                return;
              }
              slidePriceToggles.priceToSlideBlocker = 1;
              objectToValidateNode.value = Number(priceSlider.noUiSlider.get());
              slidePriceToggles.priceToSlideBlocker = 0;
            });
            /*slider end*/
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
              /*reduce/remove? the price filed shaking after select is changed*/
              if (!objectToValidateNode.value) {
                objectToValidateNode.style.setProperty('box-shadow', 'none');
                objectToValidateNode.style.setProperty('border', priceFieldShakinBorderStyleDef);
              }
              objectToValidateNode.dispatchEvent(new Event('input'));
              setTimeout(() => {
                objectToValidateNode.style.removeProperty('box-shadow');
                objectToValidateNode.style.removeProperty('border');
              },);
              /*set new conf values for the slider*/
              updateSlider(validatedValue, validatedValue || SLIDER_INITIAL_STEP);
            };
            pristine.addValidator(objectToValidateNode, validatePrice, getPriceErrorMessage);
            childNode.addEventListener('input', EVENT_HANDLERS.typeSelectFieldInputHandler);
            /*updates slider value*/
            EVENT_HANDLERS.priceNumberFiledInputHandler = () => {
              if (slidePriceToggles.priceToSlideBlocker) {
                return;
              }
              clearTimeout(slidePriceToggles.priceSliderTimeOut);
              slidePriceToggles.slideToPriceBloker = 1;
              slidePriceToggles.priceSliderTimeOut = setTimeout(()=>{
                updateSliderValue(objectToValidateNode.value);
                slidePriceToggles.slideToPriceBloker = 0;
              }, slidePriceToggles.priceSliderTimeOutTime);
            };
            objectToValidateNode.addEventListener('input', EVENT_HANDLERS.priceNumberFiledInputHandler);
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
    /*avatar photo*/
    avatarInputFieldNode.addEventListener('change', EVENT_HANDLERS.avatarInputChangeHandler);
    /*property images*/
    imagesInputFieldNode.addEventListener('change', EVENT_HANDLERS.imagesInputChangeHandler);
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
      resetSimilarAdsFilterForm();
      resetAvatarImageContainer();
      resetImagesImageContainer();
      validateOnReset();
    };
    adFormResetButton.addEventListener('click', EVENT_HANDLERS.adFormResetButtonClickHandler);
  }
  /*normalize and add validation to the adForm END*/
};

export { recordAdAddressFromMap };
export { validateProcessor };
