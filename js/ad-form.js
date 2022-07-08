import { assistApp } from './app-assistant.js';

import { resetSimilarAdsFilterForm } from './filter-form.js';
import { getMapToInitialPosition } from './filter-form.js';

import {pushToServer} from './fetch.js';

/*VARS START*/
/*address*/
const addressFieldData = {
  addressInitial: '',
  addressCurrent: '',
};
/*adForm*/
const AD_FORM_NAME = 'adForm';
const adForm = assistApp(false, 'getContainer', AD_FORM_NAME);
const adFormChildren = adForm.children;
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
const slidePriceToggles = {
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
  /*skip/resume validation for some fields (it is used for roomsNumber/guestsNumber only)*/
  toggle: 0,
};
/*rest*/
const REQUIRED_FIELD_LANG_ELEMENT = 'requiredFieldText';
const requiredFieldText = assistApp(false, 'getLocalText', REQUIRED_FIELD_LANG_ELEMENT).part1;
const nodesToValidateOnReset = [];
const ADDRESS_ROUND_FLOATS_NUMBER = 5;
const eventHandlers = {
  adFormSubmitButtonClickHandler: () => '',
  windowClickHandler: () => '',
  windowEscKeydownHandler: () => '',
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
/*VARS END*/

/*NODES START*/
const adFormNode = document.querySelector(adForm.selector);
const adFormResetButton = document.querySelector(adFormChildren.reset.selector);
const adFormSubmitButton = document.querySelector(adFormChildren.submit.selector);
const avatarInputFieldNode = document.querySelector(adFormChildren.avatar.selector);
const avatarImageContainerNode = document.querySelector(adFormChildren.avatarContainer.selector);
const avatarImageContainerBlankImage = adFormNode.querySelector(adFormChildren.avatarContainer.children.blankImage.selector);
const imagesInputFieldNode = document.querySelector(adFormChildren.images.selector);
const imagesImageContainerNode = document.querySelector(adFormChildren.imagesContainer.selector);
const priceSlider = document.createElement('div');
priceSlider.classList.add(SLIDER_CLASS);
/*NODES END*/

/*functions START*/
/*initialize pristine*/
const pristine = new Pristine(adFormNode, pristineClasses);
const isEscapeKey = (ev) => ev.key === 'Escape';
const getOptionNodes = (childData, firstNode, secondNode = false) => {
  const firstNodeNodes = [...firstNode.querySelectorAll(childData.objectToValidate.selector)];
  const secondNodeNodes = secondNode && [...secondNode.querySelectorAll(childData.objectToValidate.selector)] || '';
  return [firstNodeNodes, secondNodeNodes];
};
const enableSubmitButton = () => {
  adFormSubmitButton.addEventListener('click', eventHandlers.adFormSubmitButtonClickHandler);
  adFormSubmitButton.disabled = false;
};
const disableSubmitButton = () => {
  adFormSubmitButton.removeEventListener('click', eventHandlers.adFormSubmitButtonClickHandler);
  adFormSubmitButton.disabled = true;
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
    adFormResetButton.click();
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
  [...avatarImageContainerNode.childNodes].forEach((child) => {
    if (child !== avatarImageContainerBlankImage) {
      child.remove();
    }
  });
  for (const attribute in adFormChildren.avatarContainer.children.blankImage.attributes) {
    avatarImageContainerBlankImage.setAttribute(attribute, adFormChildren.avatarContainer.children.blankImage.attributes[attribute]);
  }
  avatarImageContainerBlankImage.classList.remove(DISPLAY_NONE_CLASS);
};
const resetImagesImageContainer = () => {
  imagesImageContainerNode.classList.remove(UPLOADED_IMAGE_CLASS);
  imagesImageContainerNode.style.removeProperty('background-image');
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
eventHandlers.adFormSubmitButtonClickHandler = (ev) => {
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
  const uploadedImg = URL.createObjectURL(avatarInputFieldNode.files[0]);
  const newAvatar = avatarImageContainerBlankImage.cloneNode();
  setImgSrc(uploadedImg, newAvatar);
  avatarImageContainerBlankImage.classList.add(DISPLAY_NONE_CLASS);
  avatarImageContainerNode.append(newAvatar);
};
eventHandlers.imagesInputChangeHandler = () => {
  resetImagesImageContainer();
  const uploadedImg = URL.createObjectURL(imagesInputFieldNode.files[0]);
  imagesImageContainerNode.classList.add(UPLOADED_IMAGE_CLASS);
  imagesImageContainerNode.style.backgroundImage = `url(${uploadedImg})`;
};
eventHandlers.adFormResetButtonClickHandler = () => {
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

adFormResetButton.addEventListener('click', eventHandlers.adFormResetButtonClickHandler);
avatarInputFieldNode.addEventListener('change', eventHandlers.avatarInputChangeHandler);
imagesInputFieldNode.addEventListener('change', eventHandlers.imagesInputChangeHandler);
adFormSubmitButton.addEventListener('click', eventHandlers.adFormSubmitButtonClickHandler);

const validateAdForm = () => {
  /*normalize and add validation to the adForm START*/
  if (typeof adFormNode !=='undefined') {
    /*normalize HTML for adFormNode*/
    for (const attribute in adForm.attributes) {
      adFormNode.setAttribute(attribute, adForm.attributes[attribute]);
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
      /*childData.objectToValidate - it either has value or it is undefined*/
      if (typeof childData.objectToValidate !== 'undefined') {
        nodesToValidateOnReset.push(childNode);
        /*get the data from DOM class for this child node*/
        const objectToValidate = adForm.children[childData.objectToValidate.name];
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
            /*initialize slider start*/
            objectToValidateNode.parentNode.insertBefore(priceSlider, objectToValidateNode.nextSibling);
            initializeSlider();
            priceSlider.noUiSlider.on('update', () => {
              if (slidePriceToggles.slideToPriceBlocker) {
                return;
              }
              slidePriceToggles.priceToSlideBlocker = 1;
              objectToValidateNode.value = Number(priceSlider.noUiSlider.get());
              objectToValidateNode.dispatchEvent(new Event('input'));
              slidePriceToggles.priceToSlideBlocker = 0;
            });
            /*initialize slider end*/
            /*normalize select > options*/
            const [childNodeOptionNodes] = [...getOptionNodes(childData, childNode)];
            childNodeOptionNodes.forEach((optionNode) => {
              /*set typeSelect > options > textContent*/
              optionNode.textContent = childData.optionsToValidate[optionNode.value].name;
            });
            /*Validate and set dependencies for Type/Price fields*/
            const bungalowZeroPriceException = childData.optionsToValidate.bungalow.zeroPriceException;
            const maxPrice = Number(objectToValidateNode.getAttribute('max'));
            const getPriceErrorMessage = (price) => {
              /*childNode.value - typeSelect>options.values*/
              const minPrice = childData.optionsToValidate[childNode.value].minPrice;
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
              if (childNode.value === bungalowZeroPriceException[0] && bungalowZeroPriceException[1].includes(price)) {
                return true;
              }
              const isValid = price && price >= Number(objectToValidateNode.getAttribute('min')) && price <= maxPrice || false;
              objectToValidateNode.classList.toggle(PRISTINE_ERROR_CLASS, isValid === false);
              return isValid;
            };
            eventHandlers.typeSelectFieldInputHandler = (ev) => {
              /*set validated attribute, min and placeholder*/
              const validatedValue = childData.optionsToValidate[ev.currentTarget.value].minPrice;
              /*set new placeholder and min price to priceInputField*/
              objectToValidateNode.placeholder = validatedValue;
              objectToValidateNode.min = validatedValue;
              /*delete validation results from price field if it is empty, after a new type was selected*/
              validateInitial(objectToValidateNode, objectToValidateNode.value === '');
              /*remove the price filed shaking after select is changed*/
              if (!objectToValidateNode.value) {
                objectToValidateNode.style.setProperty('box-shadow', 'none');
                objectToValidateNode.style.setProperty('border', priceFieldShakingBorderStyle);
              }
              objectToValidateNode.dispatchEvent(new Event('input'));
              /*setTimeout - because it removes styles before dom proceeds it and it has no effect otherwise*/
              setTimeout(() => {
                objectToValidateNode.style.removeProperty('box-shadow');
                objectToValidateNode.style.removeProperty('border');
              });
              /*set new conf values for the slider*/
              updateSlider(validatedValue, validatedValue || SLIDER_INITIAL_STEP, objectToValidateNode);
            };
            /*pristine sends objectToValidateNode.value to callback functions as a parameter (price)*/
            pristine.addValidator(objectToValidateNode, validatePrice, getPriceErrorMessage);
            childNode.addEventListener('input', eventHandlers.typeSelectFieldInputHandler);
            /*updates slider value*/
            eventHandlers.priceNumberFiledInputHandler = () => {
              if (slidePriceToggles.priceToSlideBlocker) {
                return;
              }
              clearTimeout(slidePriceToggles.priceSliderTimeOut);
              slidePriceToggles.slideToPriceBlocker = 1;
              slidePriceToggles.priceSliderTimeOut = setTimeout(()=>{
                updateSliderValue(objectToValidateNode.value);
                slidePriceToggles.slideToPriceBlocker = 0;
              }, slidePriceToggles.priceSliderTimeOutLength);
            };
            objectToValidateNode.addEventListener('input', eventHandlers.priceNumberFiledInputHandler);
            break;
          }
          case 'title': {
            const titleMinLength = Number(objectToValidateNode.getAttribute('minLength'));
            const errorMessageMin = `${titleErrorText.part1} ${titleErrorText.part3} ${titleMinLength} ${titleErrorText.part4}`;
            const titleMaxLength = Number(objectToValidateNode.getAttribute('maxLength'));
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
            const [childNodeOptionNodes, objectToValidateOptionNodes] = [...getOptionNodes(childData, childNode, objectToValidateNode)];
            /*timein's options*/
            childNodeOptionNodes.forEach((optionNode) => {
              /*normalize option value (to match class property index) to get proper value from the dom class*/
              /*old '12:00' -> to match '1200' index*/
              const normalizedOptionValue = childData.optionsToValidate[optionNode.value.replace(':', '')].value;
              optionNode.textContent = normalizedOptionValue;
            });
            /*timeout's options*/
            objectToValidateOptionNodes.forEach((optionNode) => {
              const normalizedOptionValue = objectToValidate.options[optionNode.value.replace(':', '')].value;
              optionNode.textContent = normalizedOptionValue;
            });
            /*options dependencies*/
            eventHandlers.timeinSelectFieldInputHandler = (ev) => {
              objectToValidateNode.value = ev.currentTarget.value;
            };
            eventHandlers.timeoutSelectFieldInputHandler = (ev) => {
              childNode.value = ev.currentTarget.value;
            };
            childNode.addEventListener('input', eventHandlers.timeinSelectFieldInputHandler);
            objectToValidateNode.addEventListener('input', eventHandlers.timeoutSelectFieldInputHandler);
            /*initial normalization if the options are mixed up*/
            childNode.dispatchEvent(new Event('input'));
            break;
          }
          case 'roomNumber': {
            /*additional push for the second (capacity) selectInput*/
            nodesToValidateOnReset.push(objectToValidateNode);
            /*normalize select > options*/
            const [childNodeOptionNodes, objectToValidateOptionNodes] = [...getOptionNodes(childData, childNode, objectToValidateNode)];
            /*roomnumber's options*/
            childNodeOptionNodes.forEach((optionNode) => {
              const normalizedOptionValue = childData.optionsToValidate[optionNode.value].value;
              optionNode.textContent = normalizedOptionValue;
            });
            /*capacity's options*/
            objectToValidateOptionNodes.forEach((optionNode) => {
              const normalizedOptionValue = objectToValidate.options[optionNode.value].value;
              optionNode.textContent = normalizedOptionValue;
            });
            /*validation*/
            /*toggles - to write down only error messg. for one field at a time*/
            propertySideError.toggle = 1;
            guestsSideError.toggle = 1;
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
            eventHandlers.roomsSelectFieldInputHandler = () => {
              /*revalidate the opposit field*/
              /*toggle - to write down only one error messg. at a time*/
              guestsSideError.toggle = 0;
              objectToValidateNode.dispatchEvent(new Event('input'));
              guestsSideError.toggle = 1;
            };
            eventHandlers.roomsSelectFieldClickHandler = () => {
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
            eventHandlers.guestsSelectFieldInputHandler = () => {
              /*revalidate the opposit field*/
              /*toggle - to write down only one error messg. at a time*/
              propertySideError.toggle = 0;
              childNode.dispatchEvent(new Event('input'));
              /*recharge opposite error*/
              propertySideError.toggle = 1;
            };
            eventHandlers.guestsSelectFieldClickHandler = () => {
              /*recharge validation*/
              resumeValidation();
            };
            pristine.addValidator(childNode, validateRoomsNumberField, getRoomsNumberErrorMessage);
            pristine.addValidator(objectToValidateNode, validateGuestsNumberField, getGuestsNumberErrorMessage);
            childNode.addEventListener('change', eventHandlers.roomsSelectFieldInputHandler);
            childNode.addEventListener('click', eventHandlers.roomsSelectFieldClickHandler);
            objectToValidateNode.addEventListener('change', eventHandlers.guestsSelectFieldInputHandler);
            objectToValidateNode.addEventListener('click', eventHandlers.guestsSelectFieldClickHandler);
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
