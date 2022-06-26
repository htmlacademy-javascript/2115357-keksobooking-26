/* DOM processor functions */
import   { getLocalText }                 from './functions/normalize-card-template.js';
import   { formStateToggle }              from './functions/form-state-toggle.js';
import   { fillContainerWithTemplate }    from './functions/fill-container-with-template.js';

const SimilarAdsFilterPriceRange = {
  0: [0, 100000], /*for 'any' value*/
  middle: [10000, 50000],
  low: [0, 10000],
  high: [50000, 100000],
};
const TitleAttributesToSet = [
  [30, 'minlength'],
  [101, 'maxlength'],
  ['', 'required'],
];
const PriceAttributesToSet = [
  ['number', 'type'],
  [100000, 'max'],
  ['', 'required'],
];
const AdFormAttributesToSet = [
  ['POST', 'method'],
  ['https://26.javascript.pages.academy/keksobooking', 'action'],
  ['multipart/form-data', 'enctype'],
];
const AvatarAttributesToSet = [
  ['image/*', 'accept'],
];
const ImagesAttributesToSet = [
  ['image/*', 'accept'],
];
const TimeInOptionsToValidate = {
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
const TimeOutOptions = {
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
const RoomNumberOptionsToValidate = {
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
const CapacityNumberGuestsRules = {
  1: [1],
  2: [1, 2],
  3: [1, 2, 3],
  100: [0],
};
const CapacityOptions = {
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
const AddressAttributesToSet = [['', 'readonly'],];

class DomClass {
  constructor() {
    this.Children = {
      popup: {
        title: {
          partToBridge: '__title',
        },
        address: {
          partToBridge: '__text--address',
        },
        price: {
          partToBridge: '__text--price',
        },
        type: {
          partToBridge: '__type',
        },
        capacity: {
          partToBridge: '__text--capacity',
        },
        time: {
          partToBridge: '__text--time',
        },
        features: {
          partToBridge: '__features',
        },
        description: {
          partToBridge: '__description',
        },
        photos: {
          partToBridge: '__photos',
        },
        avatar: {
          partToBridge: '__avatar',
        },
      },
      success: {
        message: {
          partToBridge: '__message',
        },
      },
      error: {
        message: {
          partToBridge: '__message',
        },
        button: {
          partToBridge: '__button',
        },
      },
    };
    this.Containers = {
      mapCanvas: {
        selectorValue: '#map-canvas',
      },
      adForm: {
        selectorValue: '.ad-form',
        attributesToSet: AdFormAttributesToSet,
        children: {
          /* as in HTML */
          avatar: {
            selectorValue: '#avatar',
            attributesToSet: AvatarAttributesToSet,
          },
          avatarContainer: {
            selectorValue: '.ad-form-header__preview',
          },
          description: {
            selectorValue: '#description',
          },
          submit: {
            selectorValue: '.ad-form__submit',
          },
          reset: {
            selectorValue: '.ad-form__reset',
          },
          images: {
            selectorValue: '#images',
            attributesToSet: ImagesAttributesToSet,
          },
          imagesContainer: {
            selectorValue: '.ad-form__photo',
          },
          /* required */
          title: {
            selectorValue: '#title',
            attributesToSet: TitleAttributesToSet,
            objectToValidate: {
              selectorValue: '#title',
              name: 'title',
            },
          },
          price: {
            selectorValue: '#price',
            attributesToSet: PriceAttributesToSet,
          },
          /* need validation / dependencies */
          type: {
            selectorValue: '#type',
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
              selectorValue: 'option',
              name: 'price',
            },
          },
          timein: {
            selectorValue: '#timein',
            optionsToValidate: TimeInOptionsToValidate,
            objectToValidate: {
              selectorValue: 'option',
              name: 'timeout',
            },
          },
          timeout: {
            selectorValue: '#timeout',
            options: TimeOutOptions,
          },
          roomNumber: {
            selectorValue: '#room_number',
            optionsToValidate: RoomNumberOptionsToValidate,
            objectToValidate: {
              selectorValue: 'option',
              name: 'capacity',
            },
            capacityNumberGuestsRules: CapacityNumberGuestsRules,
          },
          capacity: {
            selectorValue: '#capacity',
            options: CapacityOptions,
          },
          address: {
            selectorValue: '#address',
            attributesToSet: AddressAttributesToSet,
            objectToValidate: {
              name: 'address',
            },
          },
        },
      },
      mapFilters: {
        selectorValue: '.map__filters',
        children: {
          price: SimilarAdsFilterPriceRange,
        },
        classes: {
          class1: 'features__label',
          class2: 'refresh_similar_ads_button',
        },
      },
      body: {
        selectorValue: 'body',
      },
    };
    this.Templates = {
      card: {
        selectorValue: '#card',
        fragment: {
          selectorValue: '.popup',
          childrenListName: 'popup', // list of children from this obj, not the DOM
          classConnector: '__', // class name parts connector
        },
        mapPopUpNodes: '',
      },
      success: {
        selectorValue: '#success',
        fragment: {
          selectorValue: '.success',
          childrenListName: 'success', // list of children from this obj, not the DOM
          classConnector: '__', // class name parts connector
        },
      },
      error: {
        selectorValue: '#error',
        fragment: {
          selectorValue: '.error',
          childrenListName: 'error', // list of children from this obj, not the DOM
          classConnector: '__', // class name parts connector
        },
      },
    };
    this.Classes = {
      adFormDisabled: 'ad-form--disabled',
      pristineClass: {
        classTo: 'ad-form__element',
        errorClass: 'form__item--invalid',
        successClass: 'form__item--valid',
        errorTextParent: 'ad-form__element',
        errorTextTag: 'div',
        errorTextClass: 'form__error',
        errorTemporaryClass: 'error-input-placeholder',
      },
      hidden: 'hidden',
      newImageClass: 'ad-form__photo-new-image',
      sliderClass: 'slider__container',
    };
    this.getContainer = this.getContainer.bind(this);
    this.getClass = this.getClass.bind(this);
    this.getContainerNode = this.getContainerNode.bind(this);
    this.setTemplate = this.setTemplate.bind(this);
  }

  getContainer(containerName) {
    return this.Containers[containerName];
  }

  getContainerNode(containerName) {
    return document.querySelector(this.Containers[containerName].selectorValue);
  }

  getClass(className) {
    return this.Classes[className] || false;
  }

  setTemplate(templateName) {
    /* fills a template with a real template nodes from the DOM */
    const template = this.Templates[templateName];
    /* reset template */
    template.nickName = '';
    template.fragment.content = '';
    template.fragment.children = {};
    /* fill content with HTML*/
    template.fragment.content = document
      .querySelector(template.selectorValue)
      .content
      .querySelector(template.fragment.selectorValue);
    /* get template's "children" */
    template.fragment.children = this.Children[template.fragment.childrenListName] || '';
    if (template.fragment.content && template.fragment.children) {
      template.nickName = templateName;
      return template;
    }
    template.fragment.content = '';
    template.fragment.children = {};
    return '';
  }
}
const domClass = new DomClass();

const processDomClass = (dataOriginal = false, ...params) => {
  /* params[0] - what to do */
  switch (params[0]) {
    /* get a template and fill a container with it */
    case 'fillContainerWithTemplate': {
      /* COMMAND: domProcessor(adsObject, 'fillContainerWithTemplate', TEMPLATE_FROM_DOM_CLASS, CONTAINER_FROM_DOM_CLASS, return template true/false) */
      /* adsObject - dataObject, params[1] template, params[2] container, params[3] return */
      const template = domClass.setTemplate(params[1]);
      const container = domClass.getContainerNode(params[2]);
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
    case 'pageDisable':
      /* COMMAND: domProcessor(false, 'pageDisable');*/
      formStateToggle(true, domClass.Containers['adForm'], domClass.Classes.adFormDisabled);
      break;
    case 'pageEnable':
      /* COMMAND: domProcessor(false, 'pageEnable');*/
      formStateToggle(false, domClass.Containers['adForm'], domClass.Classes.adFormDisabled);
      break;
    /* toggle the state of the mapFilterForm*/
    case 'mapFilterDisable':
      /* COMMAND: domProcessor(false, 'mapFilterDisable');*/
      formStateToggle(true, domClass.Containers['mapFilters'], domClass.Classes.adFormDisabled);
      break;
    case 'mapFilterEnable':
      /* COMMAND: domProcessor(false, 'mapFilterEnable');*/
      formStateToggle(false, domClass.Containers['mapFilters'], domClass.Classes.adFormDisabled);
      break;
    /* get container from DOM class*/
    case 'getContainer':
      /* COMMAND: domProcessor(false, 'getContainer', CONTAINER_FROM_DOM_CLASS_NAME); */
      /* params[1] - container's name */
      return domClass.getContainer(params[1]);
    case 'getClass':
      /* COMMAND: domProcessor(false, 'getClass', className); */
      return domClass.getClass(params[1]);
    case 'getLocalText':
      /* COMMAND: domProcessor(false, 'getLocalText', property); */
      return getLocalText(params[1]);
    default:
      return null;
  }
};

export { processDomClass };
