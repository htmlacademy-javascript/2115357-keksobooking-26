import {assistApp} from './app-assistant.js';
import {getMapToInitialPosition, resetSimilarAdsFilterForm} from './filter-form.js';
import {pushToServer} from './fetch.js';

/*VARS START*/
/*texts*/
const PRICE_ERROR_LANG_ELEMENT = 'minPrice';
const priceErrorText = assistApp(false, 'getLocalText', PRICE_ERROR_LANG_ELEMENT);
const TITLE_ERROR_LANG_ELEMENT = 'titleLength';
const titleErrorText = assistApp(false, 'getLocalText', TITLE_ERROR_LANG_ELEMENT);
const REQUIRED_FIELD_LANG_ELEMENT = 'requiredFieldText';
const requiredFieldText = assistApp(false, 'getLocalText', REQUIRED_FIELD_LANG_ELEMENT);
/*classes*/
const NEW_IMAGE_CLASS_ELEMENT = 'newImage';
const UPLOADED_IMAGE_CLASS = assistApp(false, 'getClass', NEW_IMAGE_CLASS_ELEMENT);
const DISPLAY_NONE_CLASS_ELEMENT = 'hidden';
const DISPLAY_NONE_CLASS = assistApp(false, 'getClass', DISPLAY_NONE_CLASS_ELEMENT);
const PRISTINE_CLASSES_ELEMENT = 'pristine';
const pristineClasses = assistApp(false, 'getClass', PRISTINE_CLASSES_ELEMENT);
/*configs*/
const sliderConfig = assistApp(false, 'getConfig', 'sliderConfig');
const propertyGuestsConfig = assistApp(false, 'getConfig', 'propertyGuestsConfig');
const serverResponseConfig = assistApp(false, 'getConfig', 'serverResponseConfig');
const addressFieldData = {
  addressInitial: '',
  addressCurrent: '',
};
/*adForm*/
const AD_FORM_NAME = 'adForm';
const adFormConfig = assistApp(false, 'getContainer', AD_FORM_NAME);
const adFormChildren = adFormConfig.children;
/*rest*/
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
const adFormNode = document.querySelector(adFormConfig.selector);
const adFormFieldsNodes = {
  address: '',
  type: '',
  price: '',
  title: '',
  timein: '',
  timeout: '',
  roomsNumber: '',
  capacity: '',
};
const resetButton = document.querySelector(adFormChildren.reset.selector);
const submitButton = document.querySelector(adFormChildren.submit.selector);
const avatarInputField = document.querySelector(adFormChildren.avatar.selector);
const avatarImageContainer = document.querySelector(adFormChildren.avatarContainer.selector);
const avatarBlankImage = adFormNode.querySelector(adFormChildren.avatarContainer.children.blankImage.selector);
const imagesInputField = document.querySelector(adFormChildren.images.selector);
const imagesImageContainer = document.querySelector(adFormChildren.imagesContainer.selector);
const priceSlider = document.createElement('div');
priceSlider.classList.add(sliderConfig.class);
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
const setAddressFieldValue = (initial = false) => {
  if (initial) {
    /*setTimeout - formReset removes values slower*/
    adFormFieldsNodes.address.value = addressFieldData.addressInitial;
  } else {
    adFormFieldsNodes.address.value = addressFieldData.addressCurrent;
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
const resumeValidation = () => {
  propertyGuestsConfig.skipValidation = 1;
};

const initializeSlider = () => {
  noUiSlider.create(priceSlider, {
    range: {
      min: sliderConfig.initialMinPrice,
      max: sliderConfig.initialMaxPrice,
    },
    start: sliderConfig.initialStartPrice,
    step: sliderConfig.initialStep,
  });
};
const updateSlider = (sliderMinPrice, sliderStep, priceNode, sliderMaxPrice = sliderConfig.initialMaxPrice) => {
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
  assistApp(serverResponseConfig.texts, 'fillContainerWithTemplate', serverResponseConfig.dom.children.success, serverResponseConfig.dom.container);
  /*popups remove toggle*/
  serverResponseConfig.popups.success = document.querySelector(`.${serverResponseConfig.dom.children.success}`);
  serverResponseConfig.popups.error = '';
};
const processServerFailResponse = () => {
  /*error popups*/
  assistApp(serverResponseConfig.texts, 'fillContainerWithTemplate', serverResponseConfig.dom.children.error, serverResponseConfig.dom.container);
  /*popus remove toggle*/
  serverResponseConfig.popups.error = document.querySelector(`.${serverResponseConfig.dom.children.error}`);
  serverResponseConfig.popups.success = '';
};
const processDomAfterServerResponse = () => {
  window.removeEventListener('keydown', eventHandlers.windowEscKeydownHandler);
  window.removeEventListener('click', eventHandlers.windowClickHandler);
  /*page to enabled state*/
  assistApp(false, 'adFormEnable');
  /*enable back the submit button*/
  enableSubmitButton();
  if (serverResponseConfig.popups.success) {
    /*form fields back to defaults*/
    resetButton.click();
    serverResponseConfig.popups.success.remove();
  }
  if (serverResponseConfig.popups.error) {
    serverResponseConfig.popups.error.remove();
  }
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

const validateInitial = (node, removeErrorClass = true) => {
  /*initial validation, after resetButton removes validation results for selected fields*/
  if (removeErrorClass) {
    node.dispatchEvent(new Event('input'));
    node.classList.remove(pristineClasses.errorDefined);
  }
};
const validateOnReset = () => {
  if (nodesToValidateOnReset.length) {
    propertyGuestsConfig.skipValidation = 0;
    nodesToValidateOnReset.forEach((node) =>{
      validateInitial(node);
    });
    setAddressFieldValue(true);
  }
};

const validateTypeAndPrice = (assistantData) => {
  /*initialize slider start*/
  adFormFieldsNodes.price.parentNode.insertBefore(priceSlider, adFormFieldsNodes.price.nextSibling);
  initializeSlider();
  priceSlider.noUiSlider.on('update', () => {
    if (sliderConfig.priceToggle.slideToPriceBlocker) {
      return;
    }
    sliderConfig.priceToggle.priceToSlideBlocker = 1;
    adFormFieldsNodes.price.value = Number(priceSlider.noUiSlider.get());
    adFormFieldsNodes.price.dispatchEvent(new Event('input'));
    sliderConfig.priceToggle.priceToSlideBlocker = 0;
  });
  /*initialize slider end*/
  /*normalize typeSelect > options*/
  const [typeOptionNodes] = [...getOptionNodes(assistantData, adFormFieldsNodes.type)];
  typeOptionNodes.forEach((optionNode) => {
    /*set typeSelect > options > textContent*/
    optionNode.textContent = assistantData.optionsToValidate[optionNode.value].name;
  });
  /*Validate and set dependencies for Type/Price fields*/
  const bungalowZeroPriceException = assistantData.optionsToValidate.bungalow.zeroPriceException;
  const maxPrice = Number(adFormFieldsNodes.price.getAttribute('max'));
  const getPriceErrorMessage = (price) => {
    /*childNode.value - typeSelect>options.values*/
    const minPrice = assistantData.optionsToValidate[adFormFieldsNodes.type.value].minPrice;
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
    if (adFormFieldsNodes.type.value === bungalowZeroPriceException[0] && bungalowZeroPriceException[1].includes(price)) {
      return true;
    }
    const isValid = price && price >= Number(adFormFieldsNodes.price.getAttribute('min')) && price <= maxPrice || false;
    adFormFieldsNodes.price.classList.toggle(pristineClasses.errorDefined, isValid === false);
    return isValid;
  };
  /*pristine sends priceNode.value to callback functions as a parameter (price)*/
  pristine.addValidator(adFormFieldsNodes.price, validatePrice, getPriceErrorMessage);
};
const validateTitle = () => {
  const titleMinLength = Number(adFormFieldsNodes.title.getAttribute('minLength'));
  const errorMessageMin = `${titleErrorText.part1} ${titleErrorText.part3} ${titleMinLength} ${titleErrorText.part4}`;
  const titleMaxLength = Number(adFormFieldsNodes.title.getAttribute('maxLength'));
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
    adFormFieldsNodes.title.classList.toggle(pristineClasses.errorDefined, isValid === false);
    return isValid;
  };
  pristine.addValidator(adFormFieldsNodes.title, validateTitleValue, getTitleErrorMessage);
};
const validateTimeinAndTimeout = (timeOutAssistentData, assistantData) => {
  /*normalize both select > options*/
  const [timeinOptionNodes, timeoutOptionNodes] = [...getOptionNodes(assistantData, adFormFieldsNodes.timein, adFormFieldsNodes.timeout)];
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
};
const validateRoomsnumberAndCapacity = (capacityAssistentData, assistantData) => {
  /*normalize both select > options*/
  const [roomsnumberOptionNodes, capacityOptionNodes] = [...getOptionNodes(assistantData, adFormFieldsNodes.roomsNumber, adFormFieldsNodes.capacity)];
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
  propertyGuestsConfig.propertyError.toggle = 1;
  propertyGuestsConfig.guestsError.toggle = 1;
  /*roomsNumberNode side validation*/
  const getRoomsNumberErrorMessage = () => propertyGuestsConfig.propertyError.toggle && propertyGuestsConfig.propertyError.value.part1 || '';
  const validateRoomsNumberField = (roomsNumber) => {
    /*skip initial validation*/
    if (!propertyGuestsConfig.skipValidation) {
      return true;
    }
    /*get the opposite side value*/
    const guestsNumber = Number(adFormFieldsNodes.capacity.value);
    /*get amount of rooms suitable for those guests*/
    const roomsSuitable = [];
    for (const indexRoomsNumber in assistantData.capacityNumberGuestsRules) {
      if (assistantData.capacityNumberGuestsRules[indexRoomsNumber].includes(guestsNumber)) {
        roomsSuitable.push(indexRoomsNumber);
      }
    }
    return roomsSuitable.includes(roomsNumber);
  };
  /*capacityNode side validation*/
  const getGuestsNumberErrorMessage = () => propertyGuestsConfig.guestsError.toggle && propertyGuestsConfig.guestsError.value.part1 || '';
  const validateGuestsNumberField = (guestsNumber) => {
    if (!propertyGuestsConfig.skipValidation) {
      return true;
    }
    /*get the opposite side value*/
    const roomsNumber = Number(adFormFieldsNodes.roomsNumber.value);
    /*capacityNumberGuestsRules: index-roomssNumber, value[guestsNumbers]*/
    /*get amount of guests suitable for this room*/
    const guestsSuitable = assistantData.capacityNumberGuestsRules[roomsNumber];
    return guestsSuitable.includes(Number(guestsNumber));
  };
  /*capacity input = number of guests input*/
  pristine.addValidator(adFormFieldsNodes.roomsNumber, validateRoomsNumberField, getRoomsNumberErrorMessage);
  pristine.addValidator(adFormFieldsNodes.capacity, validateGuestsNumberField, getGuestsNumberErrorMessage);
};

const addEventHandlers = () => {
  adFormFieldsNodes.type.addEventListener('input', eventHandlers.typeSelectInputHandler);
  adFormFieldsNodes.price.addEventListener('input', eventHandlers.priceNumberFiledInputHandler);
  /*initial type select*/
  adFormFieldsNodes.type.dispatchEvent(new Event('input'));

  adFormFieldsNodes.timein.addEventListener('input', eventHandlers.timeinSelectInputHandler);
  adFormFieldsNodes.timeout.addEventListener('input', eventHandlers.timeoutSelectInputHandler);
  /*initial normalization for timeIn/timeOut fields if the options are mixed up*/
  adFormFieldsNodes.timein.dispatchEvent(new Event('input'));

  adFormFieldsNodes.roomsNumber.addEventListener('change', eventHandlers.roomsSelectInputHandler);
  adFormFieldsNodes.roomsNumber.addEventListener('click', eventHandlers.roomsSelectClickHandler);
  adFormFieldsNodes.capacity.addEventListener('change', eventHandlers.guestsSelectInputHandler);
  adFormFieldsNodes.capacity.addEventListener('click', eventHandlers.guestsSelectClickHandler);

  avatarInputField.addEventListener('change', eventHandlers.avatarInputChangeHandler);
  imagesInputField.addEventListener('change', eventHandlers.imagesInputChangeHandler);

  resetButton.addEventListener('click', eventHandlers.resetButtonClickHandler);
  submitButton.addEventListener('click', eventHandlers.submitButtonClickHandler);
};
/*functions END*/

/*ev handlers start*/
eventHandlers.typeSelectInputHandler = (ev) => {
  /*has to additionaly get the data here*/
  const assistantData = adFormChildren[ev.currentTarget.id];
  /*set validated attribute, min and placeholder*/
  const validatedValue = assistantData.optionsToValidate[ev.currentTarget.value].minPrice;
  /*set new placeholder and min price to priceInputField*/
  adFormFieldsNodes.price.placeholder = validatedValue;
  adFormFieldsNodes.price.min = validatedValue;
  /*remove the price filed shaking after select is changed*/
  if (!adFormFieldsNodes.price.value) {
    adFormFieldsNodes.price.style.setProperty('box-shadow', 'none');
    adFormFieldsNodes.price.style.setProperty('border', sliderConfig.shakingBorderStyle);
  }
  if (!sliderConfig.priceToggle.initialState) {
    adFormFieldsNodes.price.dispatchEvent(new Event('input'));
  }
  /*delete validation results from price field if it is empty, after a new type was selected*/
  validateInitial(adFormFieldsNodes.price, adFormFieldsNodes.price.value === '');
  /*setTimeout - because it removes styles before dom proceeds it and it has no effect otherwise*/
  setTimeout(() => {
    if (adFormFieldsNodes.price) {
      adFormFieldsNodes.price.style.removeProperty('box-shadow');
      adFormFieldsNodes.price.style.removeProperty('border');
    }
  });
  /*set new conf values for the slider*/
  updateSlider(validatedValue, validatedValue || sliderConfig.initialStep, adFormFieldsNodes.price);
};
eventHandlers.priceNumberFiledInputHandler = () => {
  if (sliderConfig.priceToggle.priceToSlideBlocker) {
    return;
  }
  /*updates slider value*/
  sliderConfig.priceToggle.initialState = false;
  clearTimeout(sliderConfig.priceToggle.timeOut);
  sliderConfig.priceToggle.slideToPriceBlocker = 1;
  sliderConfig.priceToggle.timeOut = setTimeout(()=>{
    updateSliderValue(adFormFieldsNodes.price.value);
    sliderConfig.priceToggle.slideToPriceBlocker = 0;
  }, sliderConfig.priceToggle.timeOutLength);
};

eventHandlers.timeinSelectInputHandler = (ev) => {
  adFormFieldsNodes.timeout.value = ev.currentTarget.value;
};
eventHandlers.timeoutSelectInputHandler = (ev) => {
  adFormFieldsNodes.timein.value = ev.currentTarget.value;
};

eventHandlers.roomsSelectInputHandler = () => {
  /*revalidate the opposit field*/
  /*toggle - to write down only one error messg. at a time*/
  propertyGuestsConfig.guestsError.toggle = 0;
  adFormFieldsNodes.capacity.dispatchEvent(new Event('input'));
  propertyGuestsConfig.guestsError.toggle = 1;
};
eventHandlers.roomsSelectClickHandler = () => {
  /*recharge validation*/
  resumeValidation();
};
eventHandlers.guestsSelectInputHandler = () => {
  /*revalidate the opposit field*/
  /*toggle - to write down only one error messg. at a time*/
  propertyGuestsConfig.propertyError.toggle = 0;
  adFormFieldsNodes.roomsNumber.dispatchEvent(new Event('input'));
  /*recharge opposite error*/
  propertyGuestsConfig.propertyError.toggle = 1;
};
eventHandlers.guestsSelectClickHandler = () => {
  /*recharge validation*/
  resumeValidation();
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

eventHandlers.windowEscKeydownHandler = (ev) => {
  if (isEscapeKey(ev)) {
    processDomAfterServerResponse();
  }
};
eventHandlers.windowClickHandler = () => {
  processDomAfterServerResponse();
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
eventHandlers.submitButtonClickHandler = (ev) => {
  ev.preventDefault();
  /*prevent click on window after fetch is completed (closes the popups)*/
  ev.stopPropagation();
  propertyGuestsConfig.skipValidation = 1;
  const isFormValid = pristine.validate();
  if (isFormValid) {
    /*FETCH*/
    sendNewAdToServer();
  }
};
/*ev handlers end*/

const validateAdForm = () => {
  /*normalize and add validation to the adForm START*/
  if (typeof adFormNode !=='undefined') {
    /*normalize HTML for adFormNode*/
    for (const attribute in adFormConfig.attributes) {
      adFormNode.setAttribute(attribute, adFormConfig.attributes[attribute]);
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
        const objectToValidate = adFormConfig.children[childData.objectToValidate.name];
        const objectToValidateNode = document.querySelector(objectToValidate.selector);
        switch (childKey) {
          /*childNode - first node/field to compare/validate*/
          /*objectToValidateNode - second node/field to compare/validate*/
          case 'address': {
            /*sets the addressFieldNode and record addresses than onPointerMove from the map*/
            adFormFieldsNodes.address = childNode;
            setAddressFieldValue(true);
            break;
          }
          case 'type': {
            adFormFieldsNodes.type = childNode;
            adFormFieldsNodes.price = objectToValidateNode;
            validateTypeAndPrice(childData);
            break;
          }
          case 'title': {
            adFormFieldsNodes.title = objectToValidateNode;
            validateTitle();
            break;
          }
          case 'timein': {
            adFormFieldsNodes.timein = childNode;
            adFormFieldsNodes.timeout = objectToValidateNode;
            validateTimeinAndTimeout(objectToValidate, childData);
            break;
          }
          case 'roomNumber': {
            /*capacity = number of guests*/
            adFormFieldsNodes.roomsNumber = childNode;
            adFormFieldsNodes.capacity = objectToValidateNode;
            /*additional push for the second selectInput (capacity input)*/
            nodesToValidateOnReset.push(adFormFieldsNodes.capacity);
            validateRoomsnumberAndCapacity(objectToValidate, childData);
            break;
          }
        }
        /*first validation after the load*/
        validateInitial(childNode);
      }
    }
  }
  addEventHandlers();
  /*normalize and add validation to the adForm END*/
};

export { recordAdAddressFromMap };
export { validateAdForm };
