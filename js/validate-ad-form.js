/*dom processor*/
import { processDomClass } from './dom-class.js';
/*map processor*/
import   { resetSimilarAdsFilterForm } from './map-and-filter-form.js';
import   { getMapToInitialPosition } from './map-and-filter-form.js';
/* api processor */
import { connectToApi } from './fetch-api.js';

/*VARS START*/
/*address*/
const AddressFieldData = {
  addressInitial: '',
  addressCurrent: '',
};
/*adForm*/
const AD_FORM_NAME = 'adForm';
const AdForm = processDomClass(false, 'getContainer', AD_FORM_NAME);
const AdFormChildren = AdForm.children;
/*server response*/
const ServerResponseDom = {
  container: 'body',
  children: {
    success: 'success',
    error: 'error',
  },
};
const ServerResponseText = {
  templates: {
    success:{
      message: `${processDomClass(false, 'getLocalText', 'serverResponseOkText').part1}\n${processDomClass(false, 'getLocalText', 'serverResponseOkText').part2}`,
    },
    error:{
      message: processDomClass(false, 'getLocalText', 'serverResponseErrorText').part1,
      button: processDomClass(false, 'getLocalText', 'serverResponseErrorText').part2,
    },
  },
};
const ServerResponsePopups = {
  success: '',
  error: '',
};
/*classes*/
const NEW_IMAGE_CLASS_NAME = 'newImageClass';
const UPLOADED_IMAGE_CLASS = processDomClass(false, 'getClass', NEW_IMAGE_CLASS_NAME);
const HIDDEN_CLASS_NAME = 'hidden';
const DISPLAY_NONE_CLASS = processDomClass(false, 'getClass', HIDDEN_CLASS_NAME);
/*pristin*/
const PRISTINE_CLASS_NAME = 'pristineClass';
const PRISTINE_CLASS = processDomClass(false, 'getClass', PRISTINE_CLASS_NAME);
const PRISTINE_ERROR_CLASS = PRISTINE_CLASS.errorTemporaryClass;
/*slider*/
const priceFieldShakingBorderStyle = '1px solid lightgray';
const SLIDER_CLASS_NAME = 'sliderClass';
const SLIDER_CLASS = processDomClass(false, 'getClass', SLIDER_CLASS_NAME);
const SLIDER_INITIAL_MIN_PRICE = 0;
const SLIDER_INITIAL_MAX_PRICE = 100000;
const SLIDER_INITIAL_START_PRICE = 0;
const SLIDER_INITIAL_STEP = 500;
const SlidePriceToggles = {
  slideToPriceBlocker: 1,
  priceToSlideBlocker: 0,
  priceSliderTimeOut: '',
  priceSliderTimeOutTime: 100,
};
/*price error text*/
const PRICE_ERROR_LANG = 'minPrice';
const priceErrorText = processDomClass(false, 'getLocalText', PRICE_ERROR_LANG);
/*title error text*/
const TITLE_ERROR_LANG = 'titleLength';
const titleErrorText = processDomClass(false, 'getLocalText', TITLE_ERROR_LANG);
/*roomNumber/Guests*/
const PROPERTY_SIDE_ERROR_LANG = 'propertySideError';
const propertySideError = {
  toggle: '',
  value: '',
};
propertySideError.value = processDomClass(false, 'getLocalText', PROPERTY_SIDE_ERROR_LANG);
const GUEST_SIDE_ERROR_LANG = 'guestsSideError';
const guestsSideError = {
  toggle: '',
  value: '',
};
guestsSideError.value = processDomClass(false, 'getLocalText', GUEST_SIDE_ERROR_LANG);
const skipValidation = {
  /*skip/resume validation for some fields (it is used for roomsNumber/guestsNumber only)*/
  toggle: 0,
};
/*rest*/
const REQUIRED_FIELD_LANG = 'requiredFieldText';
const ADDRESS_ROUND_FLOATS_NUMBER = 5;
const requiredFieldText = processDomClass(false, 'getLocalText', REQUIRED_FIELD_LANG).part1;
const nodesToValidateOnReset = [];
const EventHandlers = {
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
/*VARS END*/

/*NODES START*/
const adFormNode = document.querySelector(AdForm.selectorValue);
const adFormResetButton = document.querySelector(AdFormChildren.reset.selectorValue);
const adFormSubmitButton = document.querySelector(AdFormChildren.submit.selectorValue);
const avatarInputFieldNode = document.querySelector(AdFormChildren.avatar.selectorValue);
const avatarImageContainerNode = document.querySelector(AdFormChildren.avatarContainer.selectorValue);
const avatarImageContainerBlankImage = avatarImageContainerNode.querySelector('img');
const imagesInputFieldNode = document.querySelector(AdFormChildren.images.selectorValue);
const imagesImageContainerNode = document.querySelector(AdFormChildren.imagesContainer.selectorValue);
const priceSlider = document.createElement('div');
priceSlider.classList.add(SLIDER_CLASS);
/*NODES END*/

/*functions START*/
/*initialize pristine*/
const getPristine = (form, classes) => new Pristine(form, classes);
const pristine = getPristine(adFormNode, PRISTINE_CLASS);
const isEscapeKey = (ev) => ev.key === 'Escape';
const getOptionNodes = (childData, firstNode, secondNode = false) => {
  const firstNodeNodes = [...firstNode.querySelectorAll(childData.objectToValidate.selectorValue)];
  const secondNodeNodes = secondNode && [...secondNode.querySelectorAll(childData.objectToValidate.selectorValue)] || '';
  return [firstNodeNodes, secondNodeNodes];
};
const formSubmitButtonToggle = (toggle) => {
  if (toggle) {
    /*enable submit*/
    adFormSubmitButton.addEventListener('click', EventHandlers.adFormSubmitButtonClickHandler);
    adFormSubmitButton.disabled = false;
  } else {
    /*disable submit*/
    adFormSubmitButton.removeEventListener('click', EventHandlers.adFormSubmitButtonClickHandler);
    adFormSubmitButton.disabled = true;
  }
};
const sendNewAdToApi = () => {
  /*get the form data*/
  const newAdDataToSend = new FormData(adFormNode);
  /*disable the submit button*/
  formSubmitButtonToggle(false);
  /*disable adForm*/
  processDomClass(false, 'pageDisable');
  connectToApi('push', newAdDataToSend, 'POST')
    .then((response) => {

      /*!!!TEMP Simulate the server error DELETE TEMP!!!*/
      const submitErrorToggle = Math.floor(Math.random() * 2) === 0;
      /*!!!TEMP Simulate the server error DELETE TEMP!!!*/

      if (response && submitErrorToggle) {
        /*responses with OK*/
        /*success popups*/
        processDomClass(ServerResponseText, 'fillContainerWithTemplate', ServerResponseDom.children.success, ServerResponseDom.container);
        /*popups remove toggle*/
        ServerResponsePopups.success = document.querySelector(`.${ServerResponseDom.children.success}`);
        ServerResponsePopups.error = '';
      } else {
        /*responses with ERROR*/
        /*error popups*/
        processDomClass(ServerResponseText, 'fillContainerWithTemplate', ServerResponseDom.children.error, ServerResponseDom.container);
        /*popus remove toggle*/
        ServerResponsePopups.error = document.querySelector(`.${ServerResponseDom.children.error}`);
        ServerResponsePopups.success = '';
      }
      /*remove popup*/
      window.addEventListener('keydown', EventHandlers.escKeydownResponseRemoveHandler);
      window.addEventListener('click', EventHandlers.windowClickResponseRemoveHandler);
    });
};
const setAddressFieldValue = (initial = false) => {
  if (initial) {
    /*setTimeout - formReset removes values slower*/
    setTimeout(()=>{
      AddressFieldData.node.value = AddressFieldData.addressInitial;
    });
  } else {
    AddressFieldData.node.value = AddressFieldData.addressCurrent;
  }
};
const recordAdAddressFromMap = (address, init = false) => {
  const addressString = `${address.lat.toFixed(ADDRESS_ROUND_FLOATS_NUMBER)}, ${address.lng.toFixed(ADDRESS_ROUND_FLOATS_NUMBER)}`;
  if (init) {
    AddressFieldData.addressInitial = addressString;
  } else {
    /*the map onMainMarkerMove records a new address and sets the new value to the addr field*/
    AddressFieldData.addressCurrent = addressString;
    setAddressFieldValue(false);
  }
};
const validateInitial = (node, removeErrorClass = true) => {
  /*initial validation, after resetButton removes validation results for selected fields*/
  /*setTimeout - because formReset removes values slower than this function*/
  setTimeout(() => {
    if (removeErrorClass) {
      node.dispatchEvent(new Event('input'));
      node.classList.remove(PRISTINE_ERROR_CLASS);
    }
  }, 1);
};
const processDomAfterServerResponse = () => {
  /*page to enabled state*/
  processDomClass(false, 'pageEnable');
  /*enable back the submit button*/
  formSubmitButtonToggle(true);
  if (ServerResponsePopups.success) {
    /*form fields back to defaults*/
    adFormResetButton.click();
    ServerResponsePopups.success.remove();
  }
  if (ServerResponsePopups.error) {
    ServerResponsePopups.error.remove();
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

EventHandlers.escKeydownResponseRemoveHandler = (ev) => {
  if (isEscapeKey(ev)) {
    window.removeEventListener('keydown', EventHandlers.escKeydownResponseRemoveHandler);
    window.removeEventListener('click', EventHandlers.windowClickResponseRemoveHandler);
    processDomAfterServerResponse();
  }
};
EventHandlers.windowClickResponseRemoveHandler = () => {
  window.removeEventListener('keydown', EventHandlers.escKeydownResponseRemoveHandler);
  window.removeEventListener('click', EventHandlers.windowClickResponseRemoveHandler);
  processDomAfterServerResponse();
};
EventHandlers.adFormSubmitButtonClickHandler = (ev) => {
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
EventHandlers.avatarInputChangeHandler = () => {
  resetAvatarImageContainer();
  const uploadedImg = URL.createObjectURL(avatarInputFieldNode.files[0]);
  const newAvatar = avatarImageContainerBlankImage.cloneNode();
  setImgSrc(uploadedImg, newAvatar);
  avatarImageContainerBlankImage.classList.add(DISPLAY_NONE_CLASS);
  avatarImageContainerNode.append(newAvatar);
};
EventHandlers.imagesInputChangeHandler = () => {
  resetImagesImageContainer();
  const uploadedImg = URL.createObjectURL(imagesInputFieldNode.files[0]);
  imagesImageContainerNode.classList.add(UPLOADED_IMAGE_CLASS);
  imagesImageContainerNode.style.backgroundImage = `url(${uploadedImg})`;
};
EventHandlers.adFormResetButtonClickHandler = () => {
  resetSimilarAdsFilterForm();
  getMapToInitialPosition();
  resetAvatarImageContainer();
  resetImagesImageContainer();
  validateOnReset();
  setAddressFieldValue(true);
  window.scrollTo({top: 0, behavior: 'smooth'});
};

adFormResetButton.addEventListener('click', EventHandlers.adFormResetButtonClickHandler);
avatarInputFieldNode.addEventListener('change', EventHandlers.avatarInputChangeHandler);
imagesInputFieldNode.addEventListener('change', EventHandlers.imagesInputChangeHandler);
adFormSubmitButton.addEventListener('click', EventHandlers.adFormSubmitButtonClickHandler);

const validateAdForm = () => {
  /*normalize and add validation to the adForm START*/
  if (typeof adFormNode !=='undefined') {
    /*normalize HTML for adFormNode*/
    AdForm.attributesToSet.forEach((value0Property1) => {
      adFormNode.setAttribute(value0Property1[1], value0Property1[0]);
    });
    /*normalize and validate adForm fields*/
    for (const index in AdFormChildren) {
      const ChildData = AdFormChildren[index];
      const childNode = document.querySelector(ChildData.selectorValue);
      /*html*/
      if (ChildData.attributesToSet) {
        ChildData.attributesToSet.forEach((value0Property1) => {
          childNode.setAttribute(value0Property1[1], value0Property1[0]);
        });
      }
      /*validation / dependencies START*/
      /*childData.optionsToValidate - set up in DOM class*/
      if (typeof ChildData.objectToValidate !== 'undefined') {
        nodesToValidateOnReset.push(childNode);
        /*get the data from DOM class for this child node*/
        const ObjectToValidate = AdForm.children[ChildData.objectToValidate.name];
        const objectToValidateNode = document.querySelector(ObjectToValidate.selectorValue);
        switch (index) {
          /*childNode - first node/field to compare/validate*/
          /*objectToValidateNode - second node/field to compare/validate*/
          case 'address': {
            /*sets the addressFieldNode and record addresses than onPointerMove from the map*/
            AddressFieldData.node = childNode;
            setAddressFieldValue(true);
            break;
          }
          case 'type': {
            /*initialize slider start*/
            objectToValidateNode.parentNode.insertBefore(priceSlider, objectToValidateNode.nextSibling);
            initializeSlider();
            priceSlider.noUiSlider.on('update', () => {
              if (SlidePriceToggles.slideToPriceBlocker) {
                return;
              }
              SlidePriceToggles.priceToSlideBlocker = 1;
              objectToValidateNode.value = Number(priceSlider.noUiSlider.get());
              SlidePriceToggles.priceToSlideBlocker = 0;
            });
            /*initialize slider end*/
            /*normalize select > options*/
            const [childNodeOptionNodes] = [...getOptionNodes(ChildData, childNode)];
            /*const childNodeOptionNodes = [...childNode.querySelectorAll(ChildData.objectToValidate.selectorValue)];*/
            childNodeOptionNodes.forEach((optionNode) => {
              /*set typeSelect > options > textContent*/
              optionNode.textContent = ChildData.optionsToValidate[optionNode.value].name;
            });
            /*Validate and set dependencies for Type/Price fields*/
            const bungalowZeroPriceException = ChildData.optionsToValidate.bungalow.zeroPriceException;
            const maxPrice = Number(objectToValidateNode.getAttribute('max'));
            const getPriceErrorMessage = (price) => {
              /*childNode.value - typeSelect>options.values*/
              const minPrice = ChildData.optionsToValidate[childNode.value].minPrice;
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
            EventHandlers.typeSelectFieldInputHandler = (ev) => {
              /*set validated attribute, min and placeholder*/
              const validatedValue = ChildData.optionsToValidate[ev.currentTarget.value].minPrice;
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
            childNode.addEventListener('input', EventHandlers.typeSelectFieldInputHandler);
            /*updates slider value*/
            EventHandlers.priceNumberFiledInputHandler = () => {
              if (SlidePriceToggles.priceToSlideBlocker) {
                return;
              }
              clearTimeout(SlidePriceToggles.priceSliderTimeOut);
              SlidePriceToggles.slideToPriceBlocker = 1;
              SlidePriceToggles.priceSliderTimeOut = setTimeout(()=>{
                updateSliderValue(objectToValidateNode.value);
                SlidePriceToggles.slideToPriceBlocker = 0;
              }, SlidePriceToggles.priceSliderTimeOutTime);
            };
            objectToValidateNode.addEventListener('input', EventHandlers.priceNumberFiledInputHandler);
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
            const [childNodeOptionNodes, objectToValidateOptionNodes] = [...getOptionNodes(ChildData, childNode, objectToValidateNode)];
            /*timein's options*/
            childNodeOptionNodes.forEach((optionNode) => {
              /*normalize option value (to match class property index) to get proper value from the dom class*/
              /*old '12:00' -> to match '1200' index*/
              const normalizedOptionValue = ChildData.optionsToValidate[optionNode.value.replace(':', '')].value;
              optionNode.textContent = normalizedOptionValue;
            });
            /*timeout's options*/
            objectToValidateOptionNodes.forEach((optionNode) => {
              const normalizedOptionValue = ObjectToValidate.options[optionNode.value.replace(':', '')].value;
              optionNode.textContent = normalizedOptionValue;
            });
            /*options dependencies*/
            EventHandlers.timeinSelectFieldInputHandler = (ev) => {
              objectToValidateNode.value = ev.currentTarget.value;
            };
            EventHandlers.timeoutSelectFieldInputHandler = (ev) => {
              childNode.value = ev.currentTarget.value;
            };
            childNode.addEventListener('input', EventHandlers.timeinSelectFieldInputHandler);
            objectToValidateNode.addEventListener('input', EventHandlers.timeoutSelectFieldInputHandler);
            /*initial normalization if the options are mixed up*/
            childNode.dispatchEvent(new Event('input'));
            break;
          }
          case 'roomNumber': {
            /*additional push for the second (capacity) selectInput*/
            nodesToValidateOnReset.push(objectToValidateNode);
            /*normalize select > options*/
            const [childNodeOptionNodes, objectToValidateOptionNodes] = [...getOptionNodes(ChildData, childNode, objectToValidateNode)];
            /*roomnumber's options*/
            childNodeOptionNodes.forEach((optionNode) => {
              const normalizedOptionValue = ChildData.optionsToValidate[optionNode.value].value;
              optionNode.textContent = normalizedOptionValue;
            });
            /*capacity's options*/
            objectToValidateOptionNodes.forEach((optionNode) => {
              const normalizedOptionValue = ObjectToValidate.options[optionNode.value].value;
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
              for (const indexRoomsNumber in ChildData.capacityNumberGuestsRules) {
                if (ChildData.capacityNumberGuestsRules[indexRoomsNumber].includes(guestsNumber)) {
                  roomsSuitable.push(indexRoomsNumber);
                }
              }
              return roomsSuitable.includes(roomsNumber);
            };
            EventHandlers.roomsSelectFieldInputHandler = () => {
              /*revalidate the opposit field*/
              /*toggle - to write down only one error messg. at a time*/
              guestsSideError.toggle = 0;
              objectToValidateNode.dispatchEvent(new Event('input'));
              guestsSideError.toggle = 1;
            };
            EventHandlers.roomsSelectFieldClickHandler = () => {
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
              const guestsSuitable = ChildData.capacityNumberGuestsRules[roomsNumber];
              return guestsSuitable.includes(Number(guestsNumber));
            };
            EventHandlers.guestsSelectFieldInputHandler = () => {
              /*revalidate the opposit field*/
              /*toggle - to write down only one error messg. at a time*/
              propertySideError.toggle = 0;
              childNode.dispatchEvent(new Event('input'));
              /*recharge opposite error*/
              propertySideError.toggle = 1;
            };
            EventHandlers.guestsSelectFieldClickHandler = () => {
              /*recharge validation*/
              resumeValidation();
            };
            pristine.addValidator(childNode, validateRoomsNumberField, getRoomsNumberErrorMessage);
            pristine.addValidator(objectToValidateNode, validateGuestsNumberField, getGuestsNumberErrorMessage);
            childNode.addEventListener('change', EventHandlers.roomsSelectFieldInputHandler);
            childNode.addEventListener('click', EventHandlers.roomsSelectFieldClickHandler);
            objectToValidateNode.addEventListener('change', EventHandlers.guestsSelectFieldInputHandler);
            objectToValidateNode.addEventListener('click', EventHandlers.guestsSelectFieldClickHandler);
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
