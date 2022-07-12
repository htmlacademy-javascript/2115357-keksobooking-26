import { getLocalText } from './functions/normalize-card-template.js';
import { formStateToggle } from './functions/form-state-toggle.js';
import { fillContainerWithTemplate } from './functions/fill-container-with-template.js';

const adFormAttributes = {
  method: 'POST',
  action: 'https://26.javascript.pages.academy/keksobooking',
  enctype: 'multipart/form-data',
};

const titleAttributes = {
  minlength: 30,
  maxlength: 101,
  required: '',
};
const priceAttributes = {
  type: 'type',
  max: 100000,
  required: '',
};
const avatarAttributes = {
  accept: 'image/*',
};
const blankImageAttributes = {
  src: 'img/muffin-grey.svg',
};
const imagesAttributes = {
  accept: 'image/*',
};
const addressAttributes = {
  readonly: '',
};

const timeInOptions = {
  1200: {
    value: `${getLocalText('checkin')} ${getLocalText('after')} ${getLocalText('1200')}`,
  },
  1300: {
    value: `${getLocalText('checkin')} ${getLocalText('after')} ${getLocalText('1300')}`,
  },
  1400: {
    value: `${getLocalText('checkin')} ${getLocalText('after')} ${getLocalText('1400')}`,
  },
};
const timeOutOptions = {
  1200: {
    value: `${getLocalText('checkout')} ${getLocalText('before')} ${getLocalText('1200')}`,
  },
  1300: {
    value: `${getLocalText('checkout')} ${getLocalText('before')} ${getLocalText('1300')}`,
  },
  1400: {
    value: `${getLocalText('checkout')} ${getLocalText('before')} ${getLocalText('1400')}`,
  },
};
const roomNumberOptions = {
  1: {
    value: `${1} ${getLocalText('roomsWord')[1]}`,
  },
  2: {
    value: `${2} ${getLocalText('roomsWord')[4]}`,
  },
  3: {
    value: `${3} ${getLocalText('roomsWord')[4]}`,
  },
  100: {
    value: `${100} ${getLocalText('roomsWord')[5]}`,
  },
};
const capacityOptions = {
  1: {
    value: `${getLocalText('for')} ${1} ${getLocalText('guestsWord')[1]}`,
  },
  2: {
    value: `${getLocalText('for')} ${2} ${getLocalText('guestsWord')[4]}`,
  },
  3: {
    value: `${getLocalText('for')} ${3} ${getLocalText('guestsWord')[4]}`,
  },
  0: {
    value: `${getLocalText('not')} ${getLocalText('for')} ${getLocalText('guestsWord')[5]}`,
  },
};
const capacityNumberGuestsRules = {
  1: [1],
  2: [1, 2],
  3: [1, 2, 3],
  100: [0],
};
const similarAdsFilterPriceRange = {
  0: [0, 100000], /*for 'any' value*/
  middle: [10000, 50000],
  low: [0, 10000],
  high: [50000, 100000],
};

const sliderConfig = {
  shakingBorderStyle: '1px solid lightgray',
  class: 'slider__container',
  initialMinPrice: 0,
  initialMaxPrice: 100000,
  initialStartPrice: 0,
  initialStep:500,
  priceToggle: {
    initialState: true,
    slideToPriceBlocker: 1,
    priceToSlideBlocker: 0,
    timeOut: '',
    timeOutLength: 100,
  },
};
const propertyGuestsConfig = {
  propertyError: {
    toggle: '',
    value: getLocalText('propertySideError'),
  },
  guestsError: {
    toggle: '',
    value:  getLocalText('guestsSideError'),
  },
  skipValidation: 0,
};
const serverResponseConfig = {
  dom: {
    container: 'body',
    children: {
      success: 'success',
      error: 'error',
    },
  },
  texts: {
    templates: {
      success:{
        message: `${getLocalText('serverResponseOkText').part1}\n${getLocalText('serverResponseOkText').part2}`,
      },
      error:{
        message: getLocalText('serverResponseErrorText').part1,
        button: getLocalText('serverResponseErrorText').part2,
      },
    }
  },
  popups: {
    success: '',
    error: '',
  }
};
const similarAdsConfig = {
  nodes: [],
  parameters: {
    filterDelayTimeOut: '',
    filterDelayLength: 500,
    anyWord: 'any',
    typeField: 'type',
    priceField: 'price',
    roomsField: 'rooms',
    guestsField: 'guests',
    featuresField: 'features',
    classFirstPart: 'housing-',
    templateContainerName: 'mapCanvas',
    mapPopUpNodes: 'mapPopUpNodes',
    shuffleRandomizer: 0.5,
    adsMaxNumber: 10,
    /*these keys (inside similarAds.nodes) come from fillContainerWithTemplate*/
    /*prepareCardTemplateData() > normalizedAdsReturnToMap.push([fi...*/
    popupNodeKey: 0,
    addressKey: 1,
    dataKey: 2,
  }
};
const refreshButtonConfig = {
  class1: 'features__label',
  class2: 'refresh_similar_ads_button',
  text: getLocalText('refreshSimilarAdsButton'),
};

class AppAssistant {
  constructor() {
    this.configs = {
      sliderConfig,
      propertyGuestsConfig,
      serverResponseConfig,
      similarAdsConfig,
      refreshButtonConfig,
    };
    this.children = {
      popup: {
        title: {
          partType: 'class',
          partToBridge: '__title',
        },
        address: {
          partType: 'class',
          partToBridge: '__text--address',
        },
        price: {
          partType: 'class',
          partToBridge: '__text--price',
        },
        type: {
          partType: 'class',
          partToBridge: '__type',
        },
        capacity: {
          partType: 'class',
          partToBridge: '__text--capacity',
        },
        time: {
          partType: 'class',
          partToBridge: '__text--time',
        },
        features: {
          partType: 'class',
          partToBridge: '__features',
        },
        description: {
          partType: 'class',
          partToBridge: '__description',
        },
        photos: {
          partType: 'class',
          partToBridge: '__photos',
        },
        avatar: {
          partType: 'class',
          partToBridge: '__avatar',
        },
      },
      success: {
        message: {
          partType: 'class',
          partToBridge: '__message',
        },
      },
      error: {
        message: {
          partType: 'class',
          partToBridge: '__message',
        },
        button: {
          partType: 'class',
          partToBridge: '__button',
        },
      },
    };
    this.containers = {
      mapCanvas: {
        selector: '#map-canvas',
        initialLat: 35.658581,
        initialLng: 139.745438,
        initialZoom: 10,
        openMap: {
          url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        },
        mainMarkerParam: {
          iconUrl: './img/main-pin.svg',
          iconSize: [52, 52],
          iconAnchor: [26, 52],
        },
        similarMarkerParam: {
          iconUrl: './img/pin.svg',
          iconSize: [40, 40],
          iconAnchor: [20, 40],
        },
        map: '',
        mainMarker: '',
        similarMarker: '',
        similarAdsLayer: '',
      },
      adForm: {
        selector: '.ad-form',
        attributes: adFormAttributes,
        children: {
          /* as in HTML */
          avatar: {
            selector: '#avatar',
            attributes: avatarAttributes,
          },
          avatarContainer: {
            selector: '.ad-form-header__preview',
            children: {
              blankImage: {
                selector: 'img',
                attributes: blankImageAttributes,
              }
            }
          },
          description: {
            selector: '#description',
          },
          submit: {
            selector: '.ad-form__submit',
          },
          reset: {
            selector: '.ad-form__reset',
          },
          images: {
            selector: '#images',
            attributes: imagesAttributes,
          },
          imagesContainer: {
            selector: '.ad-form__photo',
          },
          /* required */
          title: {
            selector: '#title',
            attributes: titleAttributes,
            objectToValidate: {
              selector: '#title',
              name: 'title',
            },
          },
          price: {
            selector: '#price',
            attributes: priceAttributes,
          },
          /* need validation / dependencies */
          type: {
            selector: '#type',
            optionsToValidate: {
              bungalow: {
                name: getLocalText('bungalow'),
                minPrice: 0,
                zeroPriceException: ['bungalow',[0]],
              },
              flat: {
                name: getLocalText('flat'),
                minPrice: 1000,
              },
              hotel: {
                name: getLocalText('hotel'),
                minPrice: 3000,
              },
              house: {
                name: getLocalText('house'),
                minPrice: 5000,
              },
              palace: {
                name: getLocalText('palace'),
                minPrice: 10000,
              },
            },
            objectToValidate: {
              selector: 'option',
              name: 'price',
            },
          },
          timein: {
            selector: '#timein',
            optionsToValidate: timeInOptions,
            objectToValidate: {
              selector: 'option',
              name: 'timeout',
            },
          },
          timeout: {
            selector: '#timeout',
            options: timeOutOptions,
          },
          roomNumber: {
            selector: '#room_number',
            optionsToValidate: roomNumberOptions,
            objectToValidate: {
              selector: 'option',
              name: 'capacity',
            },
            capacityNumberGuestsRules,
          },
          capacity: {
            selector: '#capacity',
            options: capacityOptions,
          },
          address: {
            selector: '#address',
            attributes: addressAttributes,
            objectToValidate: {
              name: 'address',
            },
          },
        },
      },
      mapFilters: {
        selector: '.map__filters',
        children: {
          price: similarAdsFilterPriceRange,
        },
        classes: {
          class1: 'features__label',
          class2: 'refresh_similar_ads_button',
        },
      },
      body: {
        selector: 'body',
      },
    };
    this.templates = {
      card: {
        selector: '#card',
        fragment: {
          selector: '.popup',
          childrenListName: 'popup',
          classConnector: '__',
        },
        mapPopUpNodes: '',
      },
      success: {
        selector: '#success',
        fragment: {
          selector: '.success',
          childrenListName: 'success',
          classConnector: '__',
        },
      },
      error: {
        selector: '#error',
        fragment: {
          selector: '.error',
          childrenListName: 'error',
          classConnector: '__',
        },
      },
    };
    this.classes = {
      adFormDisabled: 'ad-form--disabled',
      pristine: {
        /*pristine build-in property keys*/
        classTo: 'ad-form__element',
        errorClass: 'form__item--invalid',
        successClass: 'form__item--valid',
        errorTextParent: 'ad-form__element',
        errorTextTag: 'div',
        errorTextClass: 'form__error',
        /**/
        errorDefined: 'error-input-placeholder',
      },
      hidden: 'hidden',
      newImage: 'ad-form__photo-new-image',
      slider: 'slider__container',
    };
    this.getContainer = this.getContainer.bind(this);
    this.getClass = this.getClass.bind(this);
    this.getConfig = this.getConfig.bind(this);
    this.setTemplate = this.setTemplate.bind(this);
  }

  getContainer(containerName) {
    return this.containers[containerName];
  }

  getClass(className) {
    return this.classes[className];
  }

  getConfig(configName) {
    return this.configs[configName];
  }

  setTemplate(templateName) {
    /* prepare a template, fills a template with a real template nodes from the DOM */
    const template = this.templates[templateName];
    /* reset template */
    template.nickName = '';
    template.fragment.content = '';
    template.fragment.children = {};
    /* fill content with HTML*/
    template.fragment.content = document
      .querySelector(template.selector)
      .content
      .querySelector(template.fragment.selector);
    /* get template's "children" */
    template.fragment.children = this.children[template.fragment.childrenListName] || '';
    if (template.fragment.content && template.fragment.children) {
      template.nickName = templateName;
      return template;
    }
    template.fragment.content = '';
    template.fragment.children = {};
    return '';
  }
}
const appAssistant = new AppAssistant();

const assistApp = (dataOriginal = false, ...params) => {
  /* params[0] - what to do */
  switch (params[0]) {
    /* get a template and fill a container with it */
    case 'fillContainerWithTemplate': {
      /* COMMAND: assistApp(adsObject, 'fillContainerWithTemplate', TEMPLATE_FROM_DOM_CLASS, CONTAINER_FROM_DOM_CLASS, return template true/false) */
      /* adsObject - dataObject, params[1] template, params[2] container, params[3] return */
      const template = appAssistant.setTemplate(params[1]);
      const container = document.querySelector(appAssistant.containers[params[2]].selector);
      if (template && container && dataOriginal &&
        typeof dataOriginal === 'object') {
        fillContainerWithTemplate(dataOriginal, template, container);
      }
      /*return template true/false*/
      if (params[3]) {
        return template;
      }
      break;
    }
    /* toggle the state of the adForm*/
    case 'adFormDisable':
      /* COMMAND: assistApp(false, 'adFormDisable');*/
      formStateToggle(true, appAssistant.containers['adForm'], appAssistant.classes.adFormDisabled);
      break;
    case 'adFormEnable':
      /* COMMAND: assistApp(false, 'adFormEnable');*/
      formStateToggle(false, appAssistant.containers['adForm'], appAssistant.classes.adFormDisabled);
      break;
    /* toggle the state of the mapFilterForm*/
    case 'filterFormDisable':
      /* COMMAND: assistApp(false, 'filterFormDisable');*/
      formStateToggle(true, appAssistant.containers['mapFilters'], appAssistant.classes.adFormDisabled);
      break;
    case 'filterFormEnable':
      /* COMMAND: assistApp(false, 'filterFormEnable');*/
      formStateToggle(false, appAssistant.containers['mapFilters'], appAssistant.classes.adFormDisabled);
      break;
    /* get container from DOM class*/
    case 'getContainer':
      /* COMMAND: assistApp(false, 'getContainer', CONTAINER_FROM_DOM_CLASS_NAME); */
      /* params[1] - container's name */
      return appAssistant.getContainer(params[1]);
    case 'getClass':
      /* COMMAND: assistApp(false, 'getClass', className); */
      return appAssistant.getClass(params[1]);
    case 'getConfig':
      /* COMMAND: assistApp(false, 'getConfig', configName); */
      return appAssistant.getConfig(params[1]);
    case 'getLocalText':
      /* COMMAND: assistApp(false, 'getLocalText', property); */
      return getLocalText(params[1]);
    default:
      return null;
  }
};

export { assistApp };
