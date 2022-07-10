import {assistApp} from './app-assistant.js';

import {getMapToInitialPosition, resetSimilarAdsFilterForm} from './filter-form.js';

import {pushToServer} from './fetch.js';

/*VARS START*/
/*address*/
const addressFieldData = {
  addressInitial: '',
  addressCurrent: '',
};
/*adForm*/
const AD_FORM_NAME = 'adForm';
const adFormAssistant = assistApp(false, 'getContainer', AD_FORM_NAME);
const adFormChildren = adFormAssistant.children;
/*server response*/
const serverResponseDom = {
  container: 'body',
  children: {
    success: 'success',
    error: 'error',
  },
};
const serverResponseTexts = {
  templates: {
    success:{
      message: `${assistApp(false, 'getLocalText', 'serverResponseOkText').part1}\n${assistApp(false, 'getLocalText', 'serverResponseOkText').part2}`,
    },
    error:{
      message: assistApp(false, 'getLocalText', 'serverResponseErrorText').part1,
      button: assistApp(false, 'getLocalText', 'serverResponseErrorText').part2,
    },
  },
};
const serverResponsePopups = {
  success: '',
  error: '',
};
/*classes*/
const NEW_IMAGE_CLASS_ELEMENT = 'newImage';
const UPLOADED_IMAGE_CLASS = assistApp(false, 'getClass', NEW_IMAGE_CLASS_ELEMENT);
const DISPLAY_NONE_CLASS_ELEMENT = 'hidden';
const DISPLAY_NONE_CLASS = assistApp(false, 'getClass', DISPLAY_NONE_CLASS_ELEMENT);
/*pristin*/
const PRISTINE_CLASSES_ELEMENT = 'pristine';
const pristineClasses = assistApp(false, 'getClass', PRISTINE_CLASSES_ELEMENT);
const PRISTINE_ERROR_CLASS = pristineClasses.errorDefined;
/*slider*/
const priceFieldShakingBorderStyle = '1px solid lightgray';
const SLIDER_CLASS_ELEMENT = 'slider';
const SLIDER_CLASS = assistApp(false, 'getClass', SLIDER_CLASS_ELEMENT);
const SLIDER_INITIAL_MIN_PRICE = 0;
const SLIDER_INITIAL_MAX_PRICE = 100000;
const SLIDER_INITIAL_START_PRICE = 0;
const SLIDER_INITIAL_STEP = 500;
const sliderAndPriceFieldToggleSettings = {
  initialState: true,
  slideToPriceBlocker: 1,
  priceToSlideBlocker: 0,
  priceSliderTimeOut: '',
  priceSliderTimeOutLength: 100,
};
/*price error text*/
const PRICE_ERROR_LANG_ELEMENT = 'minPrice';
const priceErrorText = assistApp(false, 'getLocalText', PRICE_ERROR_LANG_ELEMENT);
/*title error text*/
const TITLE_ERROR_LANG_ELEMENT = 'titleLength';
const titleErrorText = assistApp(false, 'getLocalText', TITLE_ERROR_LANG_ELEMENT);
/*roomNumber/Guests*/
const PROPERTY_SIDE_ERROR_LANG_ELEMENT = 'propertySideError';
const propertySideError = {
  toggle: '',
  value: '',
};
propertySideError.value = assistApp(false, 'getLocalText', PROPERTY_SIDE_ERROR_LANG_ELEMENT);
const GUEST_SIDE_ERROR_LANG_ELEMENT = 'guestsSideError';
const guestsSideError = {
  toggle: '',
  value: '',
};
guestsSideError.value = assistApp(false, 'getLocalText', GUEST_SIDE_ERROR_LANG_ELEMENT);
const skipValidation = {
  /*skip/resume validation for some fields*/
  toggle: 0,
};
/*rest*/
const REQUIRED_FIELD_LANG_ELEMENT = 'requiredFieldText';
const requiredFieldText = assistApp(false, 'getLocalText', REQUIRED_FIELD_LANG_ELEMENT).part1;
const nodesToValidateOnReset = [];
const ADDRESS_ROUND_FLOATS_NUMBER = 5;
const eventHandlers = {
  submitButtonClickHandler: () => '',
  windowClickHandler: () => '',
  windowEscKeydownHandler: () => '',
  resetButtonClickHandler: () => '',
  typeSelectInputHandler: () => '',
  timeinSelectInputHandler: () => '',
  timeoutSelectInputHandler: () => '',
  roomsSelectInputHandler: () => '',
  roomsSelectClickHandler: () => '',
  guestsSelectInputHandler: () => '',
  guestsSelectClickHandler: () => '',
  avatarInputChangeHandler: () => '',
  imagesInputChangeHandler: () => '',
};
/*VARS END*/

/*NODES START*/
const adFormNode = document.querySelector(adFormAssistant.selector);
const resetButton = document.querySelector(adFormChildren.reset.selector);
const submitButton = document.querySelector(adFormChildren.submit.selector);
const avatarInputField = document.querySelector(adFormChildren.avatar.selector);
const avatarImageContainer = document.querySelector(adFormChildren.avatarContainer.selector);
const avatarBlankImage = adFormNode.querySelector(adFormChildren.avatarContainer.children.blankImage.selector);
const imagesInputField = document.querySelector(adFormChildren.images.selector);
const imagesImageContainer = document.querySelector(adFormChildren.imagesContainer.selector);
const priceSlider = document.createElement('div');
priceSlider.classList.add(SLIDER_CLASS);
/*NODES END*/

/*initialize pristine*/
const pristine = new Pristine(adFormNode, pristineClasses);

/*functions START*/
const isEscapeKey = (ev) => ev.key === 'Escape';
const getOptionNodes = (childData, firstNode, secondNode = false) => {
  const firstNodeNodes = [...firstNode.querySelectorAll(childData.objectToValidate.selector)];
  const secondNodeNodes = secondNode && [...secondNode.querySelectorAll(childData.objectToValidate.selector)] || '';
  return [firstNodeNodes, secondNodeNodes];
};
const enableSubmitButton = () => {
  submitButton.addEventListener('click', eventHandlers.submitButtonClickHandler);
  submitButton.disabled = false;
};
const disableSubmitButton = () => {
  submitButton.removeEventListener('click', eventHandlers.submitButtonClickHandler);
  submitButton.disabled = true;
};
const processServerOkResponse = () => {
  /*success popups*/
  assistApp(serverResponseTexts, 'fillContainerWithTemplate', serverResponseDom.children.success, serverResponseDom.container);
  /*popups remove toggle*/
  serverResponsePopups.success = document.querySelector(`.${serverResponseDom.children.success}`);
  serverResponsePopups.error = '';
};
const processServerFailResponse = () => {
  /*error popups*/
  assistApp(serverResponseTexts, 'fillContainerWithTemplate', serverResponseDom.children.error, serverResponseDom.container);
  /*popus remove toggle*/
  serverResponsePopups.error = document.querySelector(`.${serverResponseDom.children.error}`);
  serverResponsePopups.success = '';
};
const sendNewAdToServer = () => {
  /*get the form data*/
  const newAdDataToSend = new FormData(adFormNode);
  disableSubmitButton();
  /*disable adForm*/
  assistApp(false, 'adFormDisable');
  pushToServer(newAdDataToSend)
    .then((response) => {
      if (response) {
        processServerOkResponse();
      } else {
        processServerFailResponse();
      }
    })
    .catch(() => {
      processServerFailResponse();
    });
  /*remove popup handlers*/
  window.addEventListener('keydown', eventHandlers.windowEscKeydownHandler);
  window.addEventListener('click', eventHandlers.windowClickHandler);
};
const setAddressFieldValue = (initial = false) => {
  if (initial) {
    /*setTimeout - formReset removes values slower*/
    addressFieldData.node.value = addressFieldData.addressInitial;
  } else {
    addressFieldData.node.value = addressFieldData.addressCurrent;
  }
};
const recordAdAddressFromMap = (address, init = false) => {
  const addressString = `${address.lat.toFixed(ADDRESS_ROUND_FLOATS_NUMBER)}, ${address.lng.toFixed(ADDRESS_ROUND_FLOATS_NUMBER)}`;
  if (init) {
    addressFieldData.addressInitial = addressString;
  } else {
    /*the map onMainMarkerMove records a new address and sets the new value to the addr field*/
    addressFieldData.addressCurrent = addressString;
    setAddressFieldValue(false);
  }
};
const validateInitial = (node, removeErrorClass = true) => {
  /*initial validation, after resetButton removes validation results for selected fields*/
  if (removeErrorClass) {
    node.dispatchEvent(new Event('input'));
    node.classList.remove(PRISTINE_ERROR_CLASS);
  }
};
const processDomAfterServerResponse = () => {
  window.removeEventListener('keydown', eventHandlers.windowEscKeydownHandler);
  window.removeEventListener('click', eventHandlers.windowClickHandler);
  /*page to enabled state*/
  assistApp(false, 'adFormEnable');
  /*enable back the submit button*/
  enableSubmitButton();
  if (serverResponsePopups.success) {
    /*form fields back to defaults*/
    resetButton.click();
    serverResponsePopups.success.remove();
  }
  if (serverResponsePopups.error) {
    serverResponsePopups.error.remove();
  }
};
const initializeSlider = () => {
  noUiSlider.create(priceSlider, {
    range: {
      min: SLIDER_INITIAL_MIN_PRICE,
      max: SLIDER_INITIAL_MAX_PRICE,
    },
    start: SLIDER_INITIAL_START_PRICE,
    step: SLIDER_INITIAL_STEP,
  });
};
const updateSlider = (sliderMinPrice, sliderStep, priceNode, sliderMaxPrice = SLIDER_INITIAL_MAX_PRICE) => {
  /*priceInputFiledSetsNewValue > slederGetsNewValue*/
  priceSlider.noUiSlider.updateOptions({
    range: {
      min: sliderMinPrice,
      max: sliderMaxPrice,
    },
    start: priceSlider.noUiSlider.get(),
    step: sliderStep,
  });
  if (!priceNode.value || Number(priceNode.value) < sliderMinPrice) {
    priceSlider.noUiSlider.set(sliderMinPrice);
  }
};
const updateSliderValue = (price) => {
  /*slederSetsNewValue > priceInputFiledGetsNewValue*/
  priceSlider.noUiSlider.set(price);
};
const resetAvatarImageContainer = () => {
  [...avatarImageContainer.childNodes].forEach((child) => {
    if (child !== avatarBlankImage) {
      child.remove();
    }
  });
  for (const attribute in adFormChildren.avatarContainer.children.blankImage.attributes) {
    avatarBlankImage.setAttribute(attribute, adFormChildren.avatarContainer.children.blankImage.attributes[attribute]);
  }
  avatarBlankImage.classList.remove(DISPLAY_NONE_CLASS);
};
const resetImagesImageContainer = () => {
  imagesImageContainer.classList.remove(UPLOADED_IMAGE_CLASS);
  imagesImageContainer.style.removeProperty('background-image');
};
const setImgSrc = (img, container) => {
  container.src = img;
};
const resumeValidation = () => {
  skipValidation.toggle = 1;
};
/*reset adForm*/
const validateOnReset = () => {
  if (nodesToValidateOnReset.length) {
    skipValidation.toggle = 0;
    nodesToValidateOnReset.forEach((node) =>{
      validateInitial(node);
    });
    setAddressFieldValue(true);
  }
};
/*functions END*/

eventHandlers.windowEscKeydownHandler = (ev) => {
  if (isEscapeKey(ev)) {
    processDomAfterServerResponse();
  }
};
eventHandlers.windowClickHandler = () => {
  processDomAfterServerResponse();
};
eventHandlers.submitButtonClickHandler = (ev) => {
  ev.preventDefault();
  /*prevent click on window after fetch is completed (closes the popups)*/
  ev.stopPropagation();
  skipValidation.toggle = 1;
  const isFormValid = pristine.validate();
  if (isFormValid) {
    /*FETCH*/
    sendNewAdToServer();
  }
};
eventHandlers.avatarInputChangeHandler = () => {
  resetAvatarImageContainer();
  const uploadedImg = URL.createObjectURL(avatarInputField.files[0]);
  const newAvatar = avatarBlankImage.cloneNode();
  setImgSrc(uploadedImg, newAvatar);
  avatarBlankImage.classList.add(DISPLAY_NONE_CLASS);
  avatarImageContainer.append(newAvatar);
};
eventHandlers.imagesInputChangeHandler = () => {
  resetImagesImageContainer();
  const uploadedImg = URL.createObjectURL(imagesInputField.files[0]);
  imagesImageContainer.classList.add(UPLOADED_IMAGE_CLASS);
  imagesImageContainer.style.backgroundImage = `url(${uploadedImg})`;
};
eventHandlers.resetButtonClickHandler = () => {
  resetSimilarAdsFilterForm();
  getMapToInitialPosition();
  resetAvatarImageContainer();
  resetImagesImageContainer();
  setTimeout(()=>{
    validateOnReset();
    setAddressFieldValue(true);
  });
  window.scrollTo({top: 0, behavior: 'smooth'});
};

resetButton.addEventListener('click', eventHandlers.resetButtonClickHandler);
avatarInputField.addEventListener('change', eventHandlers.avatarInputChangeHandler);
imagesInputField.addEventListener('change', eventHandlers.imagesInputChangeHandler);
submitButton.addEventListener('click', eventHandlers.submitButtonClickHandler);


const validateTypeAndPrice = (typeNode, priceNode, assistantData) => {
  /*initialize slider start*/
  priceNode.parentNode.insertBefore(priceSlider, priceNode.nextSibling);
  initializeSlider();
  priceSlider.noUiSlider.on('update', () => {
    if (sliderAndPriceFieldToggleSettings.slideToPriceBlocker) {
      return;
    }
    sliderAndPriceFieldToggleSettings.priceToSlideBlocker = 1;
    priceNode.value = Number(priceSlider.noUiSlider.get());
    priceNode.dispatchEvent(new Event('input'));
    sliderAndPriceFieldToggleSettings.priceToSlideBlocker = 0;
  });
  /*initialize slider end*/
  /*normalize typeSelect > options*/
  const [typeOptionNodes] = [...getOptionNodes(assistantData, typeNode)];
  typeOptionNodes.forEach((optionNode) => {
    /*set typeSelect > options > textContent*/
    optionNode.textContent = assistantData.optionsToValidate[optionNode.value].name;
  });
  /*Validate and set dependencies for Type/Price fields*/
  const bungalowZeroPriceException = assistantData.optionsToValidate.bungalow.zeroPriceException;
  const maxPrice = Number(priceNode.getAttribute('max'));
  const getPriceErrorMessage = (price) => {
    /*childNode.value - typeSelect>options.values*/
    const minPrice = assistantData.optionsToValidate[typeNode.value].minPrice;
    if (price === '') {
      return requiredFieldText;
    }
    if (price < minPrice) {
      return `${priceErrorText.part1} ${minPrice}`;
    }
    if (price > maxPrice) {
      return `${priceErrorText.part2} ${maxPrice}`;
    }
    return '';
  };
  const validatePrice = (price) => {
    /*childNode.value - typeSelect>options.values*/
    /*pristine checks it on selectChange*/
    /*objectToValidateNode - priceInputField*/
    /*exclude bungalow with 0 or '' price*/
    if (typeNode.value === bungalowZeroPriceException[0] && bungalowZeroPriceException[1].includes(price)) {
      return true;
    }
    const isValid = price && price >= Number(priceNode.getAttribute('min')) && price <= maxPrice || false;
    priceNode.classList.toggle(PRISTINE_ERROR_CLASS, isValid === false);
    return isValid;
  };
  eventHandlers.typeSelectInputHandler = (ev) => {
    /*set validated attribute, min and placeholder*/
    const validatedValue = assistantData.optionsToValidate[ev.currentTarget.value].minPrice;
    /*set new placeholder and min price to priceInputField*/
    priceNode.placeholder = validatedValue;
    priceNode.min = validatedValue;
    /*remove the price filed shaking after select is changed*/
    if (!priceNode.value) {
      priceNode.style.setProperty('box-shadow', 'none');
      priceNode.style.setProperty('border', priceFieldShakingBorderStyle);
    }
    if (!sliderAndPriceFieldToggleSettings.initialState) {
      priceNode.dispatchEvent(new Event('input'));
    }
    /*delete validation results from price field if it is empty, after a new type was selected*/
    validateInitial(priceNode, priceNode.value === '');
    /*setTimeout - because it removes styles before dom proceeds it and it has no effect otherwise*/
    setTimeout(() => {
      if (priceNode) {
        priceNode.style.removeProperty('box-shadow');
        priceNode.style.removeProperty('border');
      }
    });
    /*set new conf values for the slider*/
    updateSlider(validatedValue, validatedValue || SLIDER_INITIAL_STEP, priceNode);
  };
  /*pristine sends priceNode.value to callback functions as a parameter (price)*/
  pristine.addValidator(priceNode, validatePrice, getPriceErrorMessage);
  typeNode.addEventListener('input', eventHandlers.typeSelectInputHandler);
  /*updates slider value*/
  eventHandlers.priceNumberFiledInputHandler = () => {
    if (sliderAndPriceFieldToggleSettings.priceToSlideBlocker) {
      return;
    }
    sliderAndPriceFieldToggleSettings.initialState = false;
    clearTimeout(sliderAndPriceFieldToggleSettings.priceSliderTimeOut);
    sliderAndPriceFieldToggleSettings.slideToPriceBlocker = 1;
    sliderAndPriceFieldToggleSettings.priceSliderTimeOut = setTimeout(()=>{
      updateSliderValue(priceNode.value);
      sliderAndPriceFieldToggleSettings.slideToPriceBlocker = 0;
    }, sliderAndPriceFieldToggleSettings.priceSliderTimeOutLength);
  };
  priceNode.addEventListener('input', eventHandlers.priceNumberFiledInputHandler);
};
const validateTitle = (titleNode) => {
  const titleMinLength = Number(titleNode.getAttribute('minLength'));
  const errorMessageMin = `${titleErrorText.part1} ${titleErrorText.part3} ${titleMinLength} ${titleErrorText.part4}`;
  const titleMaxLength = Number(titleNode.getAttribute('maxLength'));
  const errorMessageMax = `${titleErrorText.part2} ${titleErrorText.part3} ${titleMaxLength - 1} ${titleErrorText.part4}`;
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
  const validateTitleValue = (title) => {
    const isValid = title.length >= titleMinLength && title.length < titleMaxLength;
    titleNode.classList.toggle(PRISTINE_ERROR_CLASS, isValid === false);
    return isValid;
  };
  pristine.addValidator(titleNode, validateTitleValue, getTitleErrorMessage);
};
const validateTimeinAndTimeout = (timeInNode, timeOutNode, timeOutAssistentData, assistantData) => {
  /*normalize both select > options*/
  const [timeinOptionNodes, timeoutOptionNodes] = [...getOptionNodes(assistantData, timeInNode, timeOutNode)];
  /*timein's options*/
  timeinOptionNodes.forEach((optionNode) => {
    /*normalize option value (to match class property index) to get proper value from the dom class*/
    /*old '12:00' -> to match '1200' index*/
    optionNode.textContent = assistantData.optionsToValidate[optionNode.value.replace(':', '')].value;
  });
  /*timeout's options*/
  timeoutOptionNodes.forEach((optionNode) => {
    optionNode.textContent = timeOutAssistentData.options[optionNode.value.replace(':', '')].value;
  });

  /*options dependencies*/
  eventHandlers.timeinSelectInputHandler = (ev) => {
    timeOutNode.value = ev.currentTarget.value;
  };
  eventHandlers.timeoutSelectInputHandler = (ev) => {
    timeInNode.value = ev.currentTarget.value;
  };
  timeInNode.addEventListener('input', eventHandlers.timeinSelectInputHandler);
  timeOutNode.addEventListener('input', eventHandlers.timeoutSelectInputHandler);
  /*initial normalization if the options are mixed up*/
  timeInNode.dispatchEvent(new Event('input'));
};
const validateRoomsnumberAndCapacity = (roomsNumberNode, capacityNode, capacityAssistentData, assistantData) => {

  /*normalize both select > options*/
  const [roomsnumberOptionNodes, capacityOptionNodes] = [...getOptionNodes(assistantData, roomsNumberNode, capacityNode)];

  /*roomnumber's options*/
  roomsnumberOptionNodes.forEach((optionNode) => {
    optionNode.textContent = assistantData.optionsToValidate[optionNode.value].value;
  });

  /*capacity's options*/
  capacityOptionNodes.forEach((optionNode) => {
    optionNode.textContent = capacityAssistentData.options[optionNode.value].value;
  });

  /*validation*/
  /*toggles - to write down only error messg. for one field at a time*/
  propertySideError.toggle = 1;
  guestsSideError.toggle = 1;

  /*roomsNumberNode side validation*/
  const getRoomsNumberErrorMessage = () => propertySideError.toggle && propertySideError.value.part1 || '';
  const validateRoomsNumberField = (roomsNumber) => {
    /*skip initial validation*/
    if (!skipValidation.toggle) {
      return true;
    }
    /*get the opposite side value*/
    const guestsNumber = Number(capacityNode.value);
    /*get amount of rooms suitable for those guests*/
    const roomsSuitable = [];
    for (const indexRoomsNumber in assistantData.capacityNumberGuestsRules) {
      if (assistantData.capacityNumberGuestsRules[indexRoomsNumber].includes(guestsNumber)) {
        roomsSuitable.push(indexRoomsNumber);
      }
    }
    return roomsSuitable.includes(roomsNumber);
  };
  eventHandlers.roomsSelectInputHandler = () => {
    /*revalidate the opposit field*/
    /*toggle - to write down only one error messg. at a time*/
    guestsSideError.toggle = 0;
    capacityNode.dispatchEvent(new Event('input'));
    guestsSideError.toggle = 1;
  };
  eventHandlers.roomsSelectClickHandler = () => {
    /*recharge validation*/
    resumeValidation();
  };

  /*objectToValidateNode side validation*/
  const getGuestsNumberErrorMessage = () => guestsSideError.toggle && guestsSideError.value.part1 || '';
  const validateGuestsNumberField = (guestsNumber) => {
    if (!skipValidation.toggle) {
      return true;
    }
    /*get the opposite side value*/
    const roomsNumber = Number(roomsNumberNode.value);
    /*capacityNumberGuestsRules: index-roomssNumber, value[guestsNumbers]*/
    /*get amount of guests suitable for this room*/
    const guestsSuitable = assistantData.capacityNumberGuestsRules[roomsNumber];
    return guestsSuitable.includes(Number(guestsNumber));
  };
  eventHandlers.guestsSelectInputHandler = () => {
    /*revalidate the opposit field*/
    /*toggle - to write down only one error messg. at a time*/
    propertySideError.toggle = 0;
    roomsNumberNode.dispatchEvent(new Event('input'));
    /*recharge opposite error*/
    propertySideError.toggle = 1;
  };
  eventHandlers.guestsSelectClickHandler = () => {
    /*recharge validation*/
    resumeValidation();
  };

  /*capacity input = number of guests input*/
  pristine.addValidator(roomsNumberNode, validateRoomsNumberField, getRoomsNumberErrorMessage);
  pristine.addValidator(capacityNode, validateGuestsNumberField, getGuestsNumberErrorMessage);
  roomsNumberNode.addEventListener('change', eventHandlers.roomsSelectInputHandler);
  roomsNumberNode.addEventListener('click', eventHandlers.roomsSelectClickHandler);
  capacityNode.addEventListener('change', eventHandlers.guestsSelectInputHandler);
  capacityNode.addEventListener('click', eventHandlers.guestsSelectClickHandler);
};

const validateAdForm = () => {
  /*normalize and add validation to the adForm START*/
  if (typeof adFormNode !=='undefined') {
    /*normalize HTML for adFormNode*/
    for (const attribute in adFormAssistant.attributes) {
      adFormNode.setAttribute(attribute, adFormAssistant.attributes[attribute]);
    }
    /*normalize and validate adForm fields*/
    for (const childKey in adFormChildren) {
      const childData = adFormChildren[childKey];
      const childNode = document.querySelector(childData.selector);
      /*html*/
      for (const attribute in childData.attributes) {
        childNode.setAttribute(attribute, childData.attributes[attribute]);
      }
      /*validation / dependencies START*/
      /*childData.objectToValidate - either has value or it is undefined*/
      if (typeof childData.objectToValidate !== 'undefined') {
        nodesToValidateOnReset.push(childNode);
        /*get the data from DOM class for this child node*/
        const objectToValidate = adFormAssistant.children[childData.objectToValidate.name];
        const objectToValidateNode = document.querySelector(objectToValidate.selector);
        switch (childKey) {
          /*childNode - first node/field to compare/validate*/
          /*objectToValidateNode - second node/field to compare/validate*/
          case 'address': {
            /*sets the addressFieldNode and record addresses than onPointerMove from the map*/
            addressFieldData.node = childNode;
            setAddressFieldValue(true);
            break;
          }
          case 'type': {
            validateTypeAndPrice(childNode, objectToValidateNode, childData);
            break;
          }
          case 'title': {
            validateTitle(objectToValidateNode);
            break;
          }
          case 'timein': {
            validateTimeinAndTimeout(childNode, objectToValidateNode, objectToValidate, childData);
            break;
          }
          case 'roomNumber': {
            /*additional push for the second selectInput (capacity input)*/
            nodesToValidateOnReset.push(objectToValidateNode);
            /*capacity = number of guests*/
            validateRoomsnumberAndCapacity(childNode, objectToValidateNode, objectToValidate, childData);
            break;
          }
        }
        /*first validation after the load*/
        validateInitial(childNode);
      }
    }
  }
  /*normalize and add validation to the adForm END*/
};

export { recordAdAddressFromMap };
export { validateAdForm };
