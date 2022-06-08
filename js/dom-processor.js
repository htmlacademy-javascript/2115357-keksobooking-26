/* functions */
import   { getLang }            from './functions.js';
import   { getRandomNumber }    from './functions.js';

/* CONTS */
const LANG = getLang();
const LOCAL = {
  numDeclen: {
    1: 1,
    4: 4,
    5: 5,
    21: 21,
    31: 31,
  },
  ru: {
    imgAlt:   'Фотография жилья',
    before:   'до',
    after:    'после',
    checkout: 'Выезд',
    checkin:  'Заезд',
    price:    '₽/ночь',
    flat:     'Квартира',
    bungalow: 'Бунгало',
    house:    'Дом',
    palace:   'Дворец',
    hotel:    'Отель',
    for:  'для',
    roomsWord:    {
      1:  'комната',
      4:  'комнаты',
      5:  'комнат',
    },
    guestsWord:    {
      1:  'гостя',
      4:  'гостей',
      5:  'гостей',
    },
  },
  en: {
    imgAlt:   'Property photo',
    before:   'before',
    after:    'after',
    checkout: 'Check-out',
    checkin:  'Check-in',
    price:    '$/night',
    flat:     'Flat',
    bungalow: 'Bungalow',
    house:    'House',
    palace:   'Palace',
    hotel:    'Hotel',
    for:  'for',
    roomsWord:    {
      1:  'room',
      4:  'rooms',
      5:  'rooms',
    },
    guestsWord:    {
      1:  'guest',
      4:  'guests',
      5:  'guests',
    },
  },
  lineJoin: [
    ',',
    ' ',
    '.',
    ':',
  ],
};

/* DOM functions */
import   { pageDisable }            from './dom-processor-js/page-disable.js';
import   { pageEnable }             from './dom-processor-js/page-enable.js';
/* Dom class v1.0 */
class Dom {
  constructor() {
    this.SELECTORS = {
      0: ['', 'tag'],
      1: ['#', 'id'],
      2: ['.', 'class'],
      classConnectors: {
        1: '__',
        2: '--',
        3: '-',
      },
    };
    this.CMD = {
      1: (content, container) => {
        container.textContent = content;
      },
      2: (content, container, params) => {
        container.setAttribute(params, content);
      },
      3: (content, container, params) => {
        /* take the container's child and clone it to the container */
        /* the new node gets a param with the content as value */
        /* content must be an array*/
        /* param[0] tag, 1 - attr */
        if (content.length) {
          content.forEach((el) => {
            const clone = container.querySelector(params[0]) && container.querySelector(params[0]).cloneNode(true);
            clone.setAttribute(params[1], el);
            container.appendChild(clone);
          });
        }
        container.querySelectorAll(params[0])[0].remove();
      },
      getDOMNode: (selector, value) => document.querySelector(`${selector}${value}`) || false,
    };
    this.CHILDREN = {
      popup: {
        title:        {
          value: 'title',
          selector: this.getSelector(2),
          cmd:  [1], //0 - cmd, 1 - param
        },
        address:      {
          value: `text${this.getClassConnector(2)}address`,
          selector: this.getSelector(2),
          cmd:  [1],
        },
        price:        {
          value: `text${this.getClassConnector(2)}price`,
          selector: this.getSelector(2),
          cmd:  [1],
        },
        type:         {
          value: 'type',
          selector: this.getSelector(2),
          cmd:  [1],
        },
        capacity:     {
          value: `text${this.getClassConnector(2)}capacity`,
          selector: this.getSelector(2),
          cmd:  [1],
        },
        time:         {
          value: `text${this.getClassConnector(2)}time`,
          selector: this.getSelector(2),
          cmd:  [1],
        },
        features:     {
          value: 'features',
          selector: this.getSelector(2),
          cmd:  [1],
        },
        description:  {
          value: 'description',
          selector: this.getSelector(2),
          cmd:  [1],
        },
        photos:       {
          value: 'photos',
          selector: this.getSelector(2),
          cmd:  [3, ['img', 'src']],
        },
        avatar:       {
          value: 'avatar',
          selector: this.getSelector(2),
          cmd:  [2, 'src'],
        },
      },
      toDisable: [
        [this.getSelector(0)[0], 'input'],
        [this.getSelector(0)[0], 'select'],
        [this.getSelector(0)[0], 'textarea'],
        [this.getSelector(0)[0], 'button'],
      ],
    };
    this.CONTAINERS = {
      mapCanvas: {
        value: `map${this.getClassConnector(3)}canvas`,
        selector: this.getSelector(1)[0],
      },
      adForm: {
        value: `ad${this.getClassConnector(3)}form`,
        selector: this.getSelector(2)[0],
        children: this.getChildren(['toDisable', 0], ['toDisable', 1], ['toDisable', 2], ['toDisable', 3]),
      },
      mapFilters: {
        value: `map${this.getClassConnector(1)}filters`,
        selector: this.getSelector(2)[0],
        children: this.getChildren(['toDisable', 0], ['toDisable', 1], ['toDisable', 2], ['toDisable', 3]),
      },
    };
    this.TEMPLATES = {
      card: {
        id: 'card', // real DOM select fragment
        class: '',  // real DOM select fragment
        selector: this.getSelector(1),  // real DOM select fragment
        fragment: {
          id: '', // real DOM select fragment content
          class: 'popup', //real DOM select fragment content
          selector: this.getSelector(2), // real DOM select fragment content
          thisCHILDREN: 'popup', // list of children from this obj, not the DOM
          classConnector: this.getClassConnector(1), // class name parts connector
          content: '',
          children: {},
        },
      },
    };
    this.CLASSES = {
        adFormDisabled: `ad${this.getClassConnector(3)}form${this.getClassConnector(2)}disabled`,
    };
    this.getFragmentChildren = this.getFragmentChildren.bind(this);
    this.getTemplateContent = this.getTemplateContent.bind(this);
    this.getSelector = this.getSelector.bind(this);
    this.getChildren = this.getChildren.bind(this);
    this.getClassConnector = this.getClassConnector.bind(this);
    this.setTemplate = this.setTemplate.bind(this);
  }

  getSelector(index) {
    return this.SELECTORS[index];
  }

  getClassConnector(index) {
    return this.SELECTORS.classConnectors[index];
  }

  getTemplateContent(template) {
    template.fragment.content = document
      .querySelector(`${template.selector[0]}${template[template.selector[1]]}`)
      .content
      .querySelector(`${template.fragment.selector[0]}${template.fragment[template.fragment.selector[1]]}`);
  }

  getFragmentChildren(template) {
    /* get fragment's children from the prepaired list,
    (not from the real DOM - to be sure it's bridged with the data properly) */
    /* nodes that are not in the prepaired list
    or have empty data will be displaynoned */
    template.fragment.children = this.CHILDREN[template.fragment.thisCHILDREN];
  }

  getChildren(...children) {
    const foundChildren = {};
    children.forEach((categoryIndex) => {
      if (typeof foundChildren[categoryIndex[0]] === 'undefined') {
        foundChildren[categoryIndex[0]] = [];
      };
      this.CHILDREN[categoryIndex[0]] &&
      this.CHILDREN[categoryIndex[0]][categoryIndex[1]] &&
      foundChildren[categoryIndex[0]].push(this.CHILDREN[categoryIndex[0]][categoryIndex[1]]);
    });
    return foundChildren;
  }

  getContainer(containerName) {
    return this.CONTAINERS[containerName] && this.CONTAINERS[containerName].selector && this.CONTAINERS[containerName].value &&
    this.CMD.getDOMNode(this.CONTAINERS[containerName].selector, this.CONTAINERS[containerName].value)
    || false;
  }

  setTemplate(templateName) {
    /* select element */
    const template = this.TEMPLATES[templateName];
    /* reset template */
    template.fragment.content = '';
    template.fragment.children = {};
    /* fill content with HTML from the real DOM */
    this.getTemplateContent(template);
    /* get template's "children" */
    this.getFragmentChildren(template);
    return template;
  }

  hideNode(node) {
    node.style.display = 'none';
  }
}
const DOM = new Dom();

/* data to DOM normalizer v1.0 */
const normalizeDataToDOM = (data, ...templates) => {

  /* normalizes data for the whole project - missing parts should be added */
  /* in this case normalized data should be added to the Dom calss for each template / element */

  /* or it is to be devided into smaller parts for each template */

  /* now it normalizes data for each template / element manually */
  /* now normalized data are separated from the Dom calss */

  /* normalized data are stored to data.templates[templName] for each template sent */
  /* original data remains */


  data.templates = {};
  templates.forEach((templName) => {
    switch (templName) {
      /* normalizes data for the 'card' template START */
      case 'card':
        data.templates[templName] = {};
        data.templates[templName].title = data.offer.title && data.offer.title  || '';
        data.templates[templName].description = data.offer.description && data.offer.description || '';
        data.templates[templName].address = data.offer.address && data.offer.address || '';
        data.templates[templName].price = data.offer.price && `${data.offer.price.toLocaleString()}${LOCAL.lineJoin[1]}${LOCAL[LANG]['price']}` || '';
        data.templates[templName].type = data.offer.type && LOCAL[LANG][data.offer.type] || '';
        switch (true) {
          case data.offer.rooms === LOCAL.numDeclen[1]:
          case data.offer.rooms === LOCAL.numDeclen[21]:
          case data.offer.rooms === LOCAL.numDeclen[31]:
            data.templates[templName].rooms = `${data.offer.rooms}${LOCAL.lineJoin[1]}${LOCAL[LANG]['roomsWord'][LOCAL.numDeclen[1]]}`;
            break;
          case data.offer.rooms > LOCAL.numDeclen[1] && data.offer.rooms <= LOCAL.numDeclen[4]:
            data.templates[templName].rooms = `${data.offer.rooms}${LOCAL.lineJoin[1]}${LOCAL[LANG]['roomsWord'][LOCAL.numDeclen[4]]}`;
            break;
          case data.offer.rooms >= LOCAL.numDeclen[5]:
            data.templates[templName].rooms = `${data.offer.rooms}${LOCAL.lineJoin[1]}${LOCAL[LANG]['roomsWord'][LOCAL.numDeclen[5]]}`;
            break;
          default:
            data.templates[templName].rooms = '';
        }
        switch (true) {
          case data.offer.guests === LOCAL.numDeclen[1]:
          case data.offer.guests === LOCAL.numDeclen[21]:
          case data.offer.guests === LOCAL.numDeclen[31]:
            data.templates[templName].guests = `${data.offer.guests}${LOCAL.lineJoin[1]}${LOCAL[LANG]['guestsWord'][1]}`;
            break;
          case data.offer.guests > LOCAL.numDeclen[1] && data.offer.guests <= LOCAL.numDeclen[4]:
            data.templates[templName].guests = `${data.offer.guests}${LOCAL.lineJoin[1]}${LOCAL[LANG]['guestsWord'][4]}`;
            break;
          case data.offer.guests >= LOCAL.numDeclen[5]:
            data.templates[templName].guests = `${data.offer.guests}${LOCAL.lineJoin[1]}${LOCAL[LANG]['guestsWord'][5]}`;
            break;
          default:
            data.templates[templName].guests = '';
        }
        data.templates[templName].capacity =
          data.templates[templName].rooms && data.templates[templName].guests &&
            `${data.templates[templName].rooms}${LOCAL.lineJoin[1]}${LOCAL[LANG].for}${LOCAL.lineJoin[1]}${data.templates[templName].guests}${LOCAL.lineJoin[2]}`
          ||
            '';
        delete data.templates[templName].rooms;
        delete data.templates[templName].guests;
        data.templates[templName].checkin = data.offer.checkin && `${LOCAL[LANG].checkin}${LOCAL.lineJoin[1]}${LOCAL[LANG].after}${LOCAL.lineJoin[3]}${LOCAL.lineJoin[1]}${data.offer.checkin}${LOCAL.lineJoin[2]}` || '';
        data.templates[templName].checkout = data.offer.checkout && `${LOCAL[LANG].checkout}${LOCAL.lineJoin[1]}${LOCAL[LANG].before}${LOCAL.lineJoin[3]}${LOCAL.lineJoin[1]}${data.offer.checkout}${LOCAL.lineJoin[2]}` || '';
        data.templates[templName].time =
          data.templates[templName].checkin && data.templates[templName].checkout &&
            `${data.templates[templName].checkin}${LOCAL.lineJoin[1]}${data.templates[templName].checkout}`
          ||
            '';
        delete data.templates[templName].checkin;
        delete data.templates[templName].checkout;
        data.templates[templName].features = data.offer.features.length && data.offer.features.join(`${LOCAL.lineJoin[0]}${LOCAL.lineJoin[1]}`) || '';
        data.templates[templName].photos = data.offer.photos.length && data.offer.photos || [];
        data.templates[templName].avatar = data.author.avatar && data.author.avatar || '';
        break;
      /* normalizes data for the 'card' template END */
    }
  });
  return data;
};

/* fill a container with a template START */
const fillContainerWithTemplate = (dataOriginal, template, container) => {

  container = DOM.getContainer(container);
  if (!container) {
    return false;
  }

  const data = {};
  let emptyCounter = 0;
  switch (template) {
    case 'card':
      /* set the template data */
      DOM.setTemplate(template);
      /* futher dataOriginal check if needed */
      /* TEMP CHANGE !! there's 10 ads at the moment, chose 1 !!TEMP CHANGE*/
      /* to be sure there's data in this ad */
      while (!emptyCounter) {
        Object.keys(data).forEach((el) => delete data[el]);
        Object.assign(data, dataOriginal[getRandomNumber(0, dataOriginal.length - 1)]);
        /* now it normalizes data for each template / element manually */
        /* now normalized data are separated from the Dom class */
        Object.assign(data, normalizeDataToDOM(data, template));
        emptyCounter = Object.values(data.templates[template]).length;
      }
      break;
    default:
      return false;
  }

  /* TEMP DELETE!! Empty some fileds to check out dispalynone TEMP DELETE!!*/
  Object.keys(data.templates[template]).forEach((el, id, ar) => {
    if (id === getRandomNumber(0, ar.length) && typeof data.templates[template][el] === 'string') {
      data.templates[template][el] = '';
    }
    if (id === getRandomNumber(0, ar.length) && typeof data.templates[template][el] === 'object') {
      data.templates[template][el] = [];
    }
  });
  /* TEMP DELETE!! empty one filed to check out dispalynone TEMP DELETE!!*/

  const newNode = DOM.TEMPLATES[template].fragment.content.cloneNode(true);
  /* fill fragmentNodes with the normalized data START */
  for (const index in DOM.TEMPLATES[template].fragment.children) {
    /* .fragment.children[index] - index - (name of line: title, price etc.) is the bridge btw the data and the fragment node */
    const bridge = index;
    const bridgeSelector = [];
    bridgeSelector.push(DOM.TEMPLATES[template].fragment.children[bridge].selector[1]);
    bridgeSelector.push(`${DOM.TEMPLATES[template].fragment.classConnector}${DOM.TEMPLATES[template].fragment.children[bridge].value}`);

    /* bridgeSelector[0] - nodeAttribute, e.g. class */
    /* bridgeSelector[1] - part of the nodeAttribute value, eg. "__title" */
    /* node.query where nodeAttributeValue contains __title */
    /* newNode.querySelector('[class*="__title"]')' */
    /* newNode - a real DOM element */
    /* "class" and "__title" are prepaired values generated from the Dom.class */
    /* bridge-index joins apiData with the DOM elements via same indexes */

    /* data.templates[template][bridge] - content */
    /* newNode[bridgeSelector] - fragmentNode to fill  */

    /* cmd - how the content should be put into the container */
    /* params passed to cmd */
    const cmd = DOM.TEMPLATES[template].fragment.children[bridge].cmd[0] || false;
    const params = DOM.TEMPLATES[template].fragment.children[bridge].cmd[1] || false;
    if (typeof DOM.CMD[cmd] !== 'undefined' && data.templates[template][bridge]) {
      DOM.CMD[cmd](
        data.templates[template][bridge],
        newNode.querySelector(`[${bridgeSelector[0]}*="${bridgeSelector[1]}"]`),
        params
      );
    }
    /* hide empty fields */
    if (!data.templates[template][bridge]) {
      DOM.hideNode(newNode.querySelector(`[${bridgeSelector[0]}*="${bridgeSelector[1]}"]`));
    }
  }
  /* fill fragmentNodes with the normalized data END */
  container.appendChild(newNode);
};
/* fill a container with a template END */

/* entry point to domPropcessor START */
const domProcessor = (dataOriginal = false, ...params) => {
  /* params[0] what to do */
  switch (params[0]) {
    case 'fillContainerWithTemplate':
      /* params[1] template, params[2] container */
      if (params[1] && params[2] && dataOriginal &&
      typeof dataOriginal === 'object') {
        fillContainerWithTemplate(dataOriginal, params[1], params[2]);
      }
      break;
    case 'pageDisable':
      /* pageDisable */
      pageDisable(DOM.CLASSES, DOM.CMD, DOM.CONTAINERS['adForm'], DOM.CONTAINERS['mapFilters']);
      break;
    case 'pageEnable':
        /* pageEnable */
        pageEnable(DOM.CLASSES, DOM.CMD, DOM.CONTAINERS['adForm'], DOM.CONTAINERS['mapFilters']);
        break;
    default:
      return null;
  }
};
/* entry point to domPropcessor END */

export { domProcessor };
